import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, forkJoin, map, mergeMap, Observable } from 'rxjs';
import { ClinicaUsuariosService, Especialista, Usuario } from './clinica-usuarios.service';
import { FirestoreService } from './firestore.service';
import { Consultorio, valorDia, FranjaHoraria, HORARIO_CLINICA, NumeroConsultorio, Ocupacion, Turno, claveDia, PosibleTurno, diaValorClave } from '../interfaces/clinica';
import { collection, doc, DocumentReference, Firestore, getDoc, onSnapshot, runTransaction, Timestamp } from '@angular/fire/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ClinicaTurnosService {

  constructor(
    private firestore: Firestore,
    private firestoreService: FirestoreService,
    private clinicaUsuariosService: ClinicaUsuariosService,
    private userService: UserService,
  ) {
  }

  getTurnos(): Observable<Turno[]> {
    const turnosColl = collection(this.firestore, 'turnos');
    return new Observable<Turno[]>((observer) => {
      const unsubscribe = onSnapshot(turnosColl, (querySnapshot) => {
        const turnos: Turno[] = [];
        querySnapshot.forEach((doc) => {
          turnos.push(doc.data() as Turno);
        });
        observer.next(turnos as Turno[]);
      });
      return () => unsubscribe();
    });
  }

  getTurnosEspecialista(especialistaId: string) {
    return this.getTurnos().pipe(
      map((turnos)=>{
        return turnos.filter((turno)=>{
          return turno.especialistaId === especialistaId;
        });
      }),
    );
  }

  getTurnosDisponibles(especialidad: string): Observable<PosibleTurno[]> {
    const today = new Date();
    const next15Days = this.getNext15Days(today); // Obtiene los próximos 15 días

    return this.getConsultorios().pipe(
      map((consultorios) => {
        return consultorios.flatMap((consultorio) => {
          return consultorio.ocupaciones.map((ocupacion) => ({
            consultorio: consultorio.numero,
            especialistaId: ocupacion.especialistaId,
            franjaHoraria: ocupacion.franjaHoraria,
            diaSemana: ocupacion.dia, // Suponiendo que tienes el día de la semana en la ocupación
          }));
        });
      }),
      mergeMap((ocupaciones) => {
        // Buscamos la información del especialista para cada ocupación
        return forkJoin(
          ocupaciones.map(async (ocupacion) => {
            const especialista = await this.clinicaUsuariosService.getEspecialista(ocupacion.especialistaId);
            return {
              ...ocupacion,
              especialista, // Añadimos la información del especialista
            };
          })
        );
      }),
      map((ocupacionesConEspecialista) => {
        // Filtramos las ocupaciones por la especialidad
        return ocupacionesConEspecialista
          .filter((ocupacion) => ocupacion.especialista.especialidades.includes(especialidad))
          .flatMap((ocupacion) => {
            // Aquí asignamos los turnos para los siguientes 15 días
            return next15Days
              .filter((fecha) => diaValorClave[(fecha.getDay() as valorDia)] === ocupacion.diaSemana) // Filtramos los días correctos
              .map((fecha) => {
                return {
                  consultorio: ocupacion.consultorio,
                  franjaHoraria: ocupacion.franjaHoraria,
                  especialistaId: ocupacion.especialistaId,
                  especialistaNombre: `${ocupacion.especialista.nombre} ${ocupacion.especialista.apellido}`,
                  especialidad: especialidad,
                  fecha: fecha,
                  minutosDuracion: 60, // Ajusta la duración si es necesario
                };
              });
          });
      })
    );
  }


  getNext15Days(startDate: Date): Date[] {
  const days = [];
  const currentDate = new Date(startDate);

  // Aseguramos que el inicio sea el siguiente día
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 0; i < 15; i++) {
    days.push(new Date(currentDate)); // Añadimos el día
    currentDate.setDate(currentDate.getDate() + 1); // Avanzamos al siguiente día
  }
  return days;
}


  //permite ver el estado de los consultorios
  getConsultorios(): Observable<Consultorio[]> {
    const consultoriosColl = collection(this.firestore, 'consultorios');
    return new Observable<Consultorio[]>((observer) => {
      const unsubscribe = onSnapshot(consultoriosColl, (querySnapshot) => {
        const consultorios: Consultorio[] = [];
        querySnapshot.forEach((doc) => {
          consultorios.push(doc.data() as Consultorio);
        });
        observer.next(consultorios as Consultorio[]);
      });
      return () => unsubscribe();
    });
  }

  getOcupacionesEspecialista (especialistaId: string): Observable<{ numero: NumeroConsultorio; ocupaciones: Ocupacion[];}[]> {
    return this.getConsultorios().pipe(
      map((consultorios)=>{
        return consultorios.filter((consultorio)=>{
          return consultorio.ocupaciones.some((ocupacion)=>{
            return ocupacion.especialistaId === especialistaId;
          })
        }).map((consultorio)=>{
          return {numero: consultorio.numero, ocupaciones: consultorio.ocupaciones.filter((ocupacion)=>{
            return ocupacion.especialistaId === especialistaId;
          })}
        })
      }),
    )
  }

  async ocuparConsultorio(
    numeroConsultorio: NumeroConsultorio,
    nuevaOcupacion: Ocupacion
  ): Promise<void> {

    if (!this.horarioCorrespondeAClinica(nuevaOcupacion.franjaHoraria, nuevaOcupacion.dia)) {
      throw new Error('El horario indicado no corresponde al de la clínica');
    }

    // Verificar incompatibilidades con los horarios del especialista
    const ocupacionesEspecialista = await firstValueFrom(this.getOcupacionesEspecialista(nuevaOcupacion.especialistaId));

    const conflicto = ocupacionesEspecialista.some((ocupacion) =>{
    return ocupacion.ocupaciones.some((ocup) =>{

      return (ocup.dia === nuevaOcupacion.dia && this.hayConflictoDeHorario(ocup.franjaHoraria, nuevaOcupacion.franjaHoraria))
      })
    }
    );

    if (conflicto) {
      throw new Error('El especialista ya está ocupado en otro consultorio en esa franja horaria.');
    }

    const consultorioRef = doc(this.firestore, `consultorios/${numeroConsultorio}`);

    return runTransaction(this.firestore, async (transaction) => {
      const consultorioSnap = await transaction.get(consultorioRef);

      if (!consultorioSnap.exists()) {
        throw new Error('El consultorio no existe.');
      }

      const consultorioData = consultorioSnap.data() as Consultorio;

      const ocupado = consultorioData.ocupaciones.some((ocupacion) =>
        (ocupacion.dia === nuevaOcupacion.dia && this.hayConflictoDeHorario(ocupacion.franjaHoraria, nuevaOcupacion.franjaHoraria))
      );

      if (ocupado) {
        throw new Error('El consultorio ya está ocupado en esa franja horaria.');
      }

      transaction.update(consultorioRef, {
        ocupaciones: [...consultorioData.ocupaciones, nuevaOcupacion],
      });
    });
  }


  private horarioCorrespondeAClinica(franjaHoraria: FranjaHoraria, diaSemana: claveDia): boolean {

    if (!HORARIO_CLINICA[diaSemana]) {
      return false;
    }

    const horarioClinicaDia = HORARIO_CLINICA[diaSemana];

    // Verificar si la franja cruza un día o si las horas están fuera del horario permitido
    const franjaFueraDeHorario =
      franjaHoraria.inicio < horarioClinicaDia.inicio * 60 ||
      franjaHoraria.fin > horarioClinicaDia.fin * 60;

    if (franjaFueraDeHorario) {
      return false; // Si hay conflicto con el horario, no corresponde.
    }

    return true; // Si pasa todas las verificaciones, la franja corresponde al horario de la clínica.
  }


  private  hayConflictoDeHorario(franja1: FranjaHoraria, franja2: FranjaHoraria): boolean {
    const inicio1 = franja1.inicio;
    const fin1 = franja1.fin;
    const inicio2 = franja2.inicio;
    const fin2 = franja2.fin;

    return (
      (inicio2 >= inicio1 && inicio2 < fin1) || // El inicio de la segunda está dentro de la primera
      (fin2 > inicio1 && fin2 <= fin1) ||      // El final de la segunda está dentro de la primera
      (inicio2 <= inicio1 && fin2 >= fin1)     // La segunda abarca completamente a la primera
    );
  }

}
