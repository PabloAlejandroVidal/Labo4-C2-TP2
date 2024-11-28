import { Component, Input, SimpleChanges } from '@angular/core';
import { ClinicaTurnosService } from '../../../shared/services/clinica-turnos.service';
import {Consultorio, recordDia, FranjaHoraria, HORARIO_CLINICA, claveDia as ClaveDia, Ocupacion, valorDia, claveDia } from '../../../shared/interfaces/clinica';
import { filter, map, Subscription, take } from 'rxjs';
import { ClinicaUsuariosService, Especialista, Usuario } from '../../../shared/services/clinica-usuarios.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.scss'
})
export class MisHorariosComponent {

  diasDisponibles: ClaveDia[] = [];
  diaSeleccionado: ClaveDia | null = null;

  consultoriosDisponibles: Consultorio[] = [];
  consultorioSeleccionado: Consultorio | null = null;

  horariosInicioDisponibles: number[] = [];
  horarioInicioSeleccionado: number | null = null;

  horariosHastaDisponibles: number[] = [];
  horarioHastaSeleccionada: number | null = null;

  getOcupacionesEmpty() {
    return {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: [],
    };
  }

  misOcupaciones: Record<ClaveDia, {horario: FranjaHoraria, consultorio: number}[]> = this.getOcupacionesEmpty();

  subscrptions: Subscription[] = [];

  diaParaMostrar = recordDia;
  horario = HORARIO_CLINICA;

  currentUser: Especialista | null = null;

  constructor(
    private clinicaTurnosService: ClinicaTurnosService,
    private clinicaUsuariosService: ClinicaUsuariosService,
    private userService: UserService,
  ) {
    this.obtenerDiasDisponibles();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getConsultorios();
    this.getMisOcupaciones();

  }

  getCurrentUser() {
    this.userService.observeCurrentUser().pipe(
      filter((user)=>user !== null),
      take(1),
    ).subscribe((usuario)=>{
      if (usuario.rol === 'especialista'){
        this.currentUser = usuario as Especialista;
      }
  })
  }

  getMisOcupaciones() {
    if (!this.currentUser){
      return;
    }
    const subscription = this.clinicaTurnosService.getOcupacionesEspecialista(this.currentUser.id).subscribe((consultorios)=>{
      this.misOcupaciones = this.getOcupacionesEmpty();
    consultorios.forEach((consultorio)=>{
      consultorio.ocupaciones.forEach((ocupacion)=>{
        this.misOcupaciones[ocupacion.dia].push({horario: ocupacion.franjaHoraria, consultorio: consultorio.numero})
      });
    });
  })
  this.subscrptions.push(subscription);
  }


  getConsultorios() {
    const subscription = this.clinicaTurnosService.getConsultorios().subscribe((consultorios)=>{
      this.consultoriosDisponibles = consultorios;
      if (consultorios.length > 0){
        this.consultorioSeleccionado = consultorios[0];
        this.onConsultorioSeleccionado(this.consultorioSeleccionado);
      }
    })
    this.subscrptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscrptions.forEach((subscription)=>{
      subscription.unsubscribe();
    });
  }

  getHoraMinuto(minutos: number): string {
    const horas = Math.floor(minutos / 60); // Obtener la parte entera de las horas
    const minutosRestantes = minutos % 60; // Calcular los minutos restantes
    const minutosFormateados = minutosRestantes.toString().padStart(2, '0'); // Asegurar formato de 2 dígitos
    return `${horas}:${minutosFormateados}`;
  }

  cargarHorarios(dia: ClaveDia, consultorio: Consultorio) {
    const diaHorario = this.horario[dia];
    if (diaHorario === null){
      return;
    }

    this.horariosInicioDisponibles = this.calcularHorariosInicioDisponibles(diaHorario.inicio, diaHorario.fin, consultorio);
    if (this.horariosInicioDisponibles.length > 0){
      this.horarioInicioSeleccionado = this.horariosInicioDisponibles[0];
      this.horariosHastaDisponibles = this.calcularHorariosFinDisponibles(this.horarioInicioSeleccionado, diaHorario.fin, consultorio, 60);
      if (this.horariosHastaDisponibles.length){
        this.horarioHastaSeleccionada = this.horariosHastaDisponibles[0];
      }
    }
  }

  onDiaSelected(diaSeleccionado: ClaveDia) {
    if (this.consultorioSeleccionado){
      this.onConsultorioSeleccionado(this.consultorioSeleccionado);
    }
  }

  onConsultorioSeleccionado(consultorioSeleccionado: Consultorio) {
    if (this.diaSeleccionado && this.consultorioSeleccionado){
      this.cargarHorarios(this.diaSeleccionado, this.consultorioSeleccionado);
    }
  }

  onHoraSelected() {
    if (!this.diaSeleccionado){
      return;
    }
    const horario = this.horario[this.diaSeleccionado];
    if (horario && this.horarioInicioSeleccionado&& this.consultorioSeleccionado){
      this.horariosHastaDisponibles = this.calcularHorariosFinDisponibles(this.horarioInicioSeleccionado, horario.fin, this.consultorioSeleccionado, 60);
      if (this.horariosHastaDisponibles.length){
        this.horarioHastaSeleccionada = this.horariosHastaDisponibles[0];
      }
    }
  }

  calcularHorariosInicioDisponibles(
    horaInicio: number,
    horaFin: number,
    consultorio: Consultorio,
    minutosPorBloque: number = 60
  ): number[] {
    const horariosInicio: number[] = [];
    const horaInicioEnMinutos = horaInicio * 60;
    const horaFinEnMinutos = horaFin * 60;

    for (let minutos = horaInicioEnMinutos; minutos < horaFinEnMinutos; minutos += minutosPorBloque) {
      const nuevoBloque = {
        inicio: minutos,
        fin: minutos + minutosPorBloque
      };

      // Verificar si el bloque está ocupado
      const estaOcupado = consultorio.ocupaciones.some((ocupacion) => {
        return (
          this.diaSeleccionado === ocupacion.dia &&
          this.verificarRangoOcupado(nuevoBloque, ocupacion.franjaHoraria)
        );
      });

      if (!estaOcupado) {
        horariosInicio.push(minutos);
      }
    }
    return horariosInicio;
  }

  calcularHorariosFinDisponibles(
    inicioSeleccionado: number,
    horaFin: number,
    consultorio: Consultorio,
    minutosPorBloque: number = 60
  ): number[] {
    const listaFin: number[] = [];
    const horaInicioEnMinutos = inicioSeleccionado;
    const horaFinEnMinutos = horaFin * 60;

    for (let minutos = horaInicioEnMinutos + minutosPorBloque; minutos <= horaFinEnMinutos; minutos += minutosPorBloque) {
      if (consultorio.ocupaciones.some(ocupacion=> {
        return ocupacion.dia === this.diaSeleccionado && this.verificarRangoOcupado(ocupacion.franjaHoraria, {inicio: inicioSeleccionado, fin: minutos})
      })){
        break;
      }
      listaFin.push(minutos);
    }

    return listaFin;
  }


  verificarRangoOcupado(nuevoBloque: FranjaHoraria, ocupacion: FranjaHoraria): boolean {

    const ocupacionInicio = ocupacion.inicio;
    const ocupacionFin =  ocupacion.fin;
    return (
      (nuevoBloque.inicio >= ocupacionInicio && nuevoBloque.inicio < ocupacionFin) ||
      (nuevoBloque.fin > ocupacionInicio && nuevoBloque.fin <= ocupacionFin)
    );
  }

  formatearHora(hora: number, minuto: number): string {
    const horas = Math.floor(hora);
    const minutos = Math.floor(minuto % 60);
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }

  obtenerDiasDisponibles() {
    for (const key in this.horario) {
      if (Object.prototype.hasOwnProperty.call(this.horario, key)) {
        const clave = key as ClaveDia;
        if (this.horario[clave]){
          this.diasDisponibles.push(clave);
        }
      }
    }

    if (this.diasDisponibles.length > 0){
      this.diaSeleccionado = this.diasDisponibles[0];
      this.onDiaSelected(this.diaSeleccionado);
    }
  }

  asignarDisponibilidad() {
    if (!this.currentUser){
      return;
    }

    if (!this.horarioInicioSeleccionado || !this.horarioHastaSeleccionada){
      return;
    }

    if (!this.diaSeleccionado){
      return;
    }

    if (!this.consultorioSeleccionado){
      return;
    }

    const franjaHorariaSeleccionada: FranjaHoraria = {
      inicio: this.horarioInicioSeleccionado,
      fin: this.horarioHastaSeleccionada,
    }

    const nuevaOcupacion: Ocupacion = {
      especialistaId: this.currentUser.id,
      franjaHoraria: franjaHorariaSeleccionada,
      dia: this.diaSeleccionado,
    }
    this.clinicaTurnosService.ocuparConsultorio(this.consultorioSeleccionado.numero, nuevaOcupacion);
  }
}
