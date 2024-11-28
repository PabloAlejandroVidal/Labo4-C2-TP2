import { Component, inject } from '@angular/core';
import { ClinicaUsuariosService, Especialista, Usuario } from '../../../shared/services/clinica-usuarios.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.scss'
})
export class ListarUsuariosComponent {

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
