import { Component } from '@angular/core';
import { ClinicaUsuariosService, Especialidad, Especialista, Usuario } from '../../../shared/services/clinica-usuarios.service';
import { PosibleTurno, Turno } from '../../../shared/interfaces/clinica';
import { UserService } from '../../../shared/services/user.service';
import { ClinicaTurnosService } from '../../../shared/services/clinica-turnos.service';

@Component({
  selector: 'app-paciente-turnos',
  templateUrl: './paciente-turnos.component.html',
  styleUrl: './paciente-turnos.component.scss'
})
export class PacienteTurnosComponent {
  currentUser: Usuario | null = null;
  misTurnos: Turno[] = [];
  turnosDisponibles: PosibleTurno[] = [];
  especialidadesDisponibles: Especialidad[] = [];
  especialidadSeleccionada: Especialidad | null = null;
  especialistasDisponibles: {especialistaNombre: string, especialistaId: string}[] = [];

  constructor(
    private userService: UserService,
    private clinicaUsuariosService: ClinicaUsuariosService,
    private clinicaTurnosService: ClinicaTurnosService
  ) {
    clinicaUsuariosService.getEspecialidades().subscribe((especialidades) => {
      this.especialidadesDisponibles = especialidades;
    });
  }

  buscarTurnosDisponibles() {
    if (this.especialidadSeleccionada) {
      this.clinicaTurnosService
        .getTurnosDisponibles(this.especialidadSeleccionada.clave)
        .subscribe((turnos) => {
          this.turnosDisponibles = turnos;
        });
    }
  }



}
