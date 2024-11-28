import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteRoutingModule } from './paciente-routing.module';
import { RouterModule } from '@angular/router';
import { PacienteLayoutComponent } from '../paciente-layout/paciente-layout.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { UnverifiedEmailComponent } from '../../../components/unverified-email/unverified-email.component';
import { FormsModule } from '@angular/forms';
import { PacienteTurnosComponent } from '../paciente-turnos/paciente-turnos.component';
import { PacienteMisTurnosComponent } from '../paciente-mis-turnos/paciente-mis-turnos.component';



@NgModule({
  declarations: [
    PacienteLayoutComponent,
    UnverifiedEmailComponent,
    PacienteTurnosComponent,
    PacienteMisTurnosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PacienteRoutingModule,
    NavBarComponent,
    FormsModule
  ],
})
export class PacienteModule { }
