import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opciones-registro',
  standalone: true,
  imports: [],
  templateUrl: './opciones-registro.component.html',
  styleUrl: './opciones-registro.component.scss'
})
export class OpcionesRegistroComponent {
  route: Router = inject(Router);

  goRegistro (rol: string) {
    this.route.navigateByUrl(`auth/registro-${rol}`)
  }
}
