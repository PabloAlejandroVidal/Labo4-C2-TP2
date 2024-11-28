import { Component, inject } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Usuario, Especialista, ClinicaUsuariosService } from '../../../shared/services/clinica-usuarios.service';

@Component({
  selector: 'app-administracion-de-usuarios',
  templateUrl: './administracion-de-usuarios.component.html',
  styleUrl: './administracion-de-usuarios.component.scss'
})
export class AdministracionDeUsuariosComponent {

  adminService: AdminService = inject(AdminService);
  clinicaService: ClinicaUsuariosService = inject(ClinicaUsuariosService);
  usuarios: Usuario[] = [];

  constructor(){
  }
  ngOnInit(): void {
    this.adminService.usuarios$.subscribe(users=>{
      this.usuarios = users;
    })
  }
  getEspecialista(usuario: Usuario): Especialista {
    return usuario as Especialista;
  }

  trackById(index: number, usuario: Usuario): string {
    return usuario.id; // o cualquier propiedad única del usuario
  }

  async updateEmailVerificacion(especialista: Especialista, valor: boolean) {
    await this.clinicaService.setAprobacionDeUsuario(especialista, valor).then(()=>{
    }).catch(()=>{

    })
  }
}
