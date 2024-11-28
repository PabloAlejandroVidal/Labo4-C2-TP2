import { Component } from '@angular/core';
import { ClinicaTurnosService } from '../../../shared/services/clinica-turnos.service';
import { Turno } from '../../../shared/interfaces/clinica';
import { UserService } from '../../../shared/services/user.service';
import { Usuario } from '../../../shared/services/clinica-usuarios.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-especialista-turnos',
  templateUrl: './especialista-turnos.component.html',
  styleUrl: './especialista-turnos.component.scss'
})
export class EspecialistaTurnosComponent {

  currentUser: Usuario | null = null;
  misTurnos: Turno[] = [];

  constructor(
    private userService: UserService,
    private clinicaTurnosService: ClinicaTurnosService,
  )
  {

  }
  ngOnInit(): void {

    this.userService.observeCurrentUser().pipe(
      filter((user)=>{return user !== null})).subscribe((user)=>{
      this.currentUser = user;

      this.clinicaTurnosService.getTurnosEspecialista(this.currentUser.id).subscribe((turnos)=>{
        this.misTurnos = turnos;
      })
    });

  }
}
