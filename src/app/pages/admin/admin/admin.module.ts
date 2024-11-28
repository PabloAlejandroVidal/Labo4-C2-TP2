import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { AdministracionDeUsuariosComponent } from '../administracion-de-usuarios/administracion-de-usuarios.component';
import { AdminService } from '../services/admin.service';
import { UsuarioComponent } from "../components/usuario/usuario.component";
import { AprobadoPipe } from './pipes/aprobado.pipe';
import { SiwichButtonComponent } from "../../../components/siwich-button/siwich-button.component";
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { SideBarComponent } from "../../../components/side-bar/side-bar.component";
import { ListarUsuariosComponent } from '../listar-usuarios/listar-usuarios.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdministracionDeUsuariosComponent,
    ListarUsuariosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    UsuarioComponent,
    AprobadoPipe,
    SiwichButtonComponent,
    FormsModule,
    NavBarComponent,
    SideBarComponent,
],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
