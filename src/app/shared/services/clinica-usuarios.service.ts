import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, CollectionReference, doc, docData, documentId, DocumentReference, Firestore, firestoreInstance$, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { BehaviorSubject, from, map, mergeMap, Observable, of } from 'rxjs';

export type Rol = 'admin' | 'paciente' | 'especialista';

export interface Foto {
  userEmail: string,
  image: string,
  uploaded: Date,
}

export interface Usuario {
  nombre: string,
  apellido: string,
  edad: number,
  dni: string,
  email: string,
  rol: Rol;
  clave: string,
  id: string,
  imagen: string,
  aprobado: boolean,
  emailVerificado: boolean,
}

export interface Paciente extends Usuario {
  nombre: string,
  apellido: string,
  edad: number,
  dni: string,
  email: string,
  rol: 'paciente';
  obraSocial: string,
  clave: string,
  imagen: string,
  imagen2: string,
}

export interface Especialista extends Usuario{
  nombre: string,
  apellido: string,
  edad: number,
  dni: string,
  especialidades: string[],
  email: string,
  rol: 'especialista';
  clave: string,
  imagen: string,
  aprobado: boolean,
}

export interface Administrador extends Usuario {
  nombre: string,
  apellido: string,
  edad: number,
  dni: string,
  email: string,
  rol: 'admin';
  imagen: string,
}

export interface UsuarioResult {
  result: {
    code: string,
    message: string,
  };
  success: boolean;
  user: Usuario | null;
}

export interface InfoResult {
  code: string,
  message: string
}

export interface PacienteValidado {
  paciente: Paciente | null,
  infoResult: InfoResult,
}
export interface EspecialistaValidado {
  especialista: Especialista | null,
  infoResult: InfoResult,
}

export const valoresAdmitidos = {
  minAge: 18,
  maxAge: 99,
  minNamesLength: 2,
  dniLength: 8,
  minPassLength: 6,
  obrasSociales: ['Osde', 'Galeno', 'Medicus', 'Otra'],
};

export interface Especialidad{
  nombre: string,
  clave: string,
}


export const usuariosDePrueba = {
  pacientes: [
    {email: 'pacienteprueba1@gmail.com', password: '123456'},
    {email: 'pacienteprueba2@gmail.com', password: '123456'},
    {email: 'pacienteprueba3@gmail.com', password: '123456'},
  ],
  especialistas: [
    {email: 'especialistaprueba1@gmail.com', password: '123456'},
    {email: 'especialistaprueba2@gmail.com', password: '123456'},
    {email: 'especialistaprueba3@gmail.com', password: '123456'},
  ],
}

@Injectable({
  providedIn: 'root'
})
export class ClinicaUsuariosService {
  public firestore: Firestore = inject(Firestore);

  constructor() {
    this.cargarUsuarios();
  }

  private usersCollection = collection(this.firestore, 'users');

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuarios$ = this.usuariosSubject.asObservable();

  async setAprobacionDeUsuario(especialista: Especialista, nuevoValor: boolean) {
    // Referencia al documento del usuario especialista en Firestore usando el id
    const especialistaRef = doc(this.usersCollection, especialista.id);

    // Actualizar el campo 'aprobado' (o el nombre que uses) con el nuevo valor
    return updateDoc(especialistaRef, { aprobado: nuevoValor })
      .then(() => {
      })
      .catch(error => {
      });
  }

  async setVerificacionDeEmail(userId: string, nuevoValor: boolean) {
    // Referencia al documento del usuario usuario en Firestore usando el id
    const usuarioRef = doc(this.usersCollection, userId);

    // Actualizar el campo 'aprobado' (o el nombre que uses) con el nuevo valor
    return updateDoc(usuarioRef, { emailVerificado: nuevoValor })
      .then(() => {
      })
      .catch(error => {
      });
  }

  registerUser(userData: {}, email: string, rol: Rol) {
    const data = {
      ...userData,
      email,
      rol,
      registrationDate: new Date(),
    } as any;
    return from(addDoc(this.usersCollection, data));
  }

  private cargarUsuarios(): void {
    // Inicia la suscripción en tiempo real
    onSnapshot(this.usersCollection, (snapshot) => {
      const usuariosList: Usuario[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Usuario[];

      // Emitir la lista actualizada a los suscriptores
      this.usuariosSubject.next(usuariosList);
    }, (error) => {
      console.error('Error al obtener usuarios:', error);
      this.usuariosSubject.next([]); // Emitir un array vacío en caso de error
    });
  }


  obtenerUsuarioPorEmail(email: string): Observable<Usuario | null> {
    return this.usuarios$.pipe(
      map((usuarios) => (usuarios.find((usuario) => usuario.email === email)) || null)
    );
  }

  async getEspecialista(especialistaId: string): Promise<Especialista> {
    const especialistaRef = doc(this.firestore, `users/${especialistaId}`);
    const especialistaDoc = await getDoc(especialistaRef);
    return especialistaDoc.data() as Especialista;
  }

  getEspecialidades(): Observable<Especialidad[]> {
    return this.getUsuariosPorRol('especialista').pipe(
      map((especialistas) => {
        // Obtener todas las claves de especialidades de los especialistas
        const especialidadesClaves = (especialistas as Especialista[]).flatMap(
          (especialista) => especialista.especialidades
        );
        return Array.from(new Set(especialidadesClaves)); // Quitar duplicados
      }),
      mergeMap((especialidadesClaves) => {
        // Buscar las especialidades en Firestore por las claves
        const especialidadesRef = collection(this.firestore, 'especialidades-agregadas');
        const especialidadesQuery = query(
          especialidadesRef,
          where('clave', 'in', especialidadesClaves.slice(0, 10)) // Firestore limita "in" a 10 valores por consulta
        );

        return getDocs(especialidadesQuery).then((querySnapshot) =>
          querySnapshot.docs.map((doc) => doc.data() as Especialidad)
        );
      })
    );
  }


  private getUsuariosPorRol(rol: Rol): Observable<Usuario[]> {
    const usuariosRef = collection(this.firestore, 'users');
    const usuariosQuery = query(usuariosRef, where('rol', '==', rol));
    return collectionData(usuariosQuery, { idField: 'id' }) as Observable<Usuario[]>;
  }


  async agregarEspecialidades(nuevasEspecialidades: { nombre: string; clave: string }[]) {
    const especialidadesCollection = collection(this.firestore, 'especialidades-agregadas');

    // Convertimos las especialidades existentes a un Map
    const especialidadesExistentes = new Map<string, string>();

    const querySnapshot = await getDocs(especialidadesCollection);
    querySnapshot.forEach((doc) => {
      const docData = doc.data() as any;
      especialidadesExistentes.set(docData.clave, docData.nombre);
    });

    // Filtramos nuevas especialidades que no estén ya en la colección
    const especialidadesParaAgregar = nuevasEspecialidades.filter(
      (especialidad) => !especialidadesExistentes.has(especialidad.clave)
    );

    // Agregamos las especialidades nuevas
    const batch = writeBatch(this.firestore);
    especialidadesParaAgregar.forEach((especialidad) => {
      const docRef = doc(especialidadesCollection, especialidad.clave);
      batch.set(docRef, especialidad);
    });

    // Ejecutamos el batch para guardar los datos
    await batch.commit();

    return especialidadesParaAgregar;
  }


  validarPaciente(paciente: Paciente): PacienteValidado {
    if (!this.isNombreValido(paciente.nombre) || !this.isNombreValido(paciente.apellido)) {
      const infoResult: InfoResult = {
        code: 'No validado',
        message: 'Nombre y/o Apellido no válido'}
      return {paciente: null, infoResult};
    }

    if (!this.isEdadValida(paciente.edad)) {
      const infoResult: InfoResult = {
        code: 'No validado',
        message: 'La edad no es válida'}
      return {paciente: null, infoResult};
    }

    if (!this.isObraSocialValida(paciente.obraSocial)) {
      const infoResult: InfoResult = {
        code: 'No validado',
        message: 'La obra social no es válida'}
      return {paciente: null, infoResult};
    }

    // Otros criterios de validación...
      const infoResult: InfoResult = {
        code: 'Validado',
        message: 'Los datos del paciente fueron validados correctamente'}
    return {
      paciente,
      infoResult,
    };
  }

  validarEspecialista(especialista: Especialista): EspecialistaValidado {
    if (!this.isNombreValido(especialista.nombre) || !this.isNombreValido(especialista.apellido)) {
      const infoResult: InfoResult = {
        code: 'No validado',
        message: 'Nombre y/o Apellido no válido'}
      return {especialista: null, infoResult};
    }

    if (!this.isEdadValida(especialista.edad)) {
      const infoResult: InfoResult = {
        code: 'No validado',
        message: 'La edad no es válida'}
      return {especialista: null, infoResult};
    }

    if (!this.isAtLeastOneEspecialidad(especialista.especialidades)) {
      const infoResult: InfoResult = {
        code: 'No validado',
        message: 'El especialista no tiene especialidades asignadas'}
      return {especialista: null, infoResult};
    }

    // Otros criterios de validación...
    const infoResult: InfoResult = {
      code: 'Validado',
      message: 'el especialista fue validado correctamente'}
    return {especialista, infoResult};
  }


  private isNombreValido(nombre: string): boolean {
    return nombre.length >= valoresAdmitidos.minNamesLength;
  }

  private isEdadValida(edad: number): boolean {
    return edad >= valoresAdmitidos.minAge && edad <= valoresAdmitidos.maxAge;
  }

  private isObraSocialValida(obraSocial: string): boolean {
    return valoresAdmitidos.obrasSociales.includes(obraSocial);
  }

  private isAtLeastOneEspecialidad(especialidades: string[]): boolean {
    return especialidades.length > 0;
  }
}
