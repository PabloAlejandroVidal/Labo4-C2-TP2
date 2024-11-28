import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ClinicaUsuariosService, Rol, Usuario } from '../../shared/services/clinica-usuarios.service';
import { from, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-boton-carga-usuario',
  standalone: true,
  imports: [],
  templateUrl: './boton-carga-usuario.component.html',
  styleUrl: './boton-carga-usuario.component.scss'
})
export class BotonCargaUsuarioComponent {
  @Input({required: true}) email: string = '';
  @Input({required: true}) password: string = '';
  @Output() onSelectUser: EventEmitter<any> = new EventEmitter();

  clinicaService: ClinicaUsuariosService = inject(ClinicaUsuariosService);

  usuario: Usuario | null = null;
  subscriptions: Subscription[] = [];
  defaultImage = 'assets/user-image.png';


  loadUser() {
    if (this.usuario){
      this.usuario.clave = this.password;
      this.onSelectUser.emit(this.usuario);
    }
  }

  ngOnInit(): void {
    if (this.email){
      const subscription = from(this.clinicaService.obtenerUsuarioPorEmail(this.email)).subscribe((usuario)=>{
        this.usuario = usuario;
      })
      this.subscriptions.push(subscription)
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe();
    })
  }


}
