import { Component, Input } from '@angular/core';
import { Usuario } from '../../../../shared/services/clinica-usuarios.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  @Input({required: true}) usuario!: Usuario;
}
