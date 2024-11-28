import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { LoginComponent } from '../login/login.component';
import { RegistroEspecialistaComponent } from '../registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from '../registro-paciente/registro-paciente.component';
import { OpcionesRegistroComponent } from '../opciones-registro/opciones-registro.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: OpcionesRegistroComponent },
      { path: 'registro-especialista', component: RegistroEspecialistaComponent },
      { path: 'registro-paciente', component: RegistroPacienteComponent },
      ]
  },
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
