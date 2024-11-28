import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspecialistaRoutingModule } from './especialista-routing.module';
import { EspecialistaLayoutComponent } from '../especialista-layout/especialista-layout.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { EspecialistaTurnosComponent } from '../especialista-turnos/especialista-turnos.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { MiPerfilComponent } from '../mi-perfil/mi-perfil.component';
import { MisHorariosComponent } from '../mis-horarios/mis-horarios.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EspecialistaLayoutComponent,
    EspecialistaTurnosComponent,
    MiPerfilComponent,
    MisHorariosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    EspecialistaRoutingModule,
    NavBarComponent,
    FormsModule
  ]
})
export class EspecialistaModule { }
