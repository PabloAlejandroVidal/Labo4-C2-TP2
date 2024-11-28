import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { AdministracionDeUsuariosComponent } from '../administracion-de-usuarios/administracion-de-usuarios.component';
import { RegistroEspecialistaComponent } from '../../auth/registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from '../../auth/registro-paciente/registro-paciente.component';
import { RegistroAdminComponent } from '../../auth/registro-admin/registro-admin.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { ListarUsuariosComponent } from '../listar-usuarios/listar-usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full'},
      { path: 'usuarios', children: [
        { path: '', redirectTo: 'listar-usuarios', pathMatch: 'full'},
        { path: 'listar-usuarios', component: ListarUsuariosComponent, data: {animation: 'listar-usuarios'} },
        { path: 'alta-paciente', component: RegistroPacienteComponent, data: {animation: 'alta-paciente'}},
        { path: 'alta-especialista', component: RegistroEspecialistaComponent, data: {animation: 'alta-especialista'}},
        { path: 'alta-admin', component: RegistroAdminComponent, data: {animation: 'alta-admin'}},
      ]},
      { path: '**', redirectTo: 'usuarios', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
