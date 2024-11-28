import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { LoginComponent } from '../login/login.component';
import { SelectorImagenComponent } from '../../../components/selector-imagen/selector-imagen.component';
import { LoadingComponent } from "../../../shared/Utils/alert/loading/loading.component";
import { RegistroEspecialistaComponent } from '../registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from '../registro-paciente/registro-paciente.component';
import { BotonCargaUsuarioComponent } from '../../../components/boton-carga-usuario/boton-carga-usuario.component';
import { RegistroAdminComponent } from '../registro-admin/registro-admin.component';
import { VerificarTokenEmailComponent } from '../../../components/verificar-token-email/verificar-token-email.component';
import { NavBarComponent } from "../../../components/nav-bar/nav-bar.component";



@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RegistroEspecialistaComponent,
    RegistroPacienteComponent,
    RegistroAdminComponent,
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    SelectorImagenComponent,
    LoadingComponent,
    BotonCargaUsuarioComponent,
    ReactiveFormsModule,
    FormsModule,
    NavBarComponent,
],
  exports: [
    SelectorImagenComponent,
    BotonCargaUsuarioComponent,
    NavBarComponent
  ]

})
export class AuthModule { }
