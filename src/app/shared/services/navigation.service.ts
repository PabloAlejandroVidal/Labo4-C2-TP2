import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Rol } from './clinica-usuarios.service';


export const moduleRoutes = {
  HOME: 'home',
  AUTH: 'auth',
  USUARIO: 'usuario',
  PACIENTE: 'paciente',
  ADMIN: 'admin',
  ESPECIALISTA: 'especialista',
  UNVERIFIED_EMAIL: 'email-no-verificado',
  VERIFY_EMAIL: 'verificar-email',
};


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router: Router = inject(Router);

  navigateByRole(role: Rol): void {
    switch(role){
      case 'admin':
        this.router.navigate([`/${moduleRoutes.ADMIN}`]);
        break;
      case 'especialista':
        this.router.navigate([`/${moduleRoutes.ESPECIALISTA}`]);
        break;
      case 'paciente':
        this.router.navigate([`/${moduleRoutes.PACIENTE}`]);
        break;
    }
  }
  navigateHome(): void {
    this.router.navigate([`/${moduleRoutes.HOME}`]);
  }
  navigateToEmailVerifier(rol: Rol): void {
    this.router.navigate([`/${rol}/${moduleRoutes.UNVERIFIED_EMAIL}`]);
  }
}
