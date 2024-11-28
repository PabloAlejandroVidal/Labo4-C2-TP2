import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthMessage, UserService } from '../../../shared/services/user.service';
import { showError, showSuccess } from '../../../shared/Utils/swalAlert';
import { catchError, of, Subscription, take } from 'rxjs';
import { Usuario } from '../../../shared/services/clinica-usuarios.service';
import { Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { moduleRoutes } from '../../../shared/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private userService: UserService = inject(UserService)
  private router: Router = inject(Router);

  subscriptions: Subscription[] = [];

  msgResult: string = '';
  form!: FormGroup;

  async ngOnInit(){
    this.form = new FormGroup({
      email: new FormControl("", [Validators.minLength(8), Validators.email, Validators.required]),
      clave: new FormControl("", [Validators.minLength(6), Validators.required]),
    });
  }

  setMessage(message: string) {
    this.msgResult = message;
  }

  onSubmit() {
    this.login();
    this.form.reset();
  }

  login() {
    // Verificación de si el formulario es válido
    if (!this.form.valid) {
      const authMessage = {
        code: '¡Error en el formulario!',
        message: 'Verifica los datos ingresados e intenta nuevamente',
      };

      this.setMessage(authMessage.message);
      showError(authMessage);
      return;
    }

    // Intentamos realizar el registro
    try {
      const {email = '', clave = ''} = {...this.form.value};
      // Llamada al servicio de registro, usando from para convertirlo en un Observable
      const subscription = this.userService.loginUser(email, clave).pipe(
        take(1),
        catchError((error) => {
          // Manejo de error si la llamada al servicio falla
          const authMessage: AuthMessage = {
            code: 'Error inesperado',
            message: 'Un error inesperado ha ocurrido, intentalo nuevamente o comunicate con el proveedor de servicios',
          };
          this.setMessage(authMessage.code);
          showError(authMessage);
          // Retorna un observable vacío para evitar que el flujo continúe con errores
          return of(null);
        })
      ).subscribe({
        next: (authResult) => {
          // Manejo de resultados cuando el registro es exitoso
          if (authResult && authResult.success) {
            // Aquí, puedes comprobar si el register fue exitoso o redirigir a otra página
            showSuccess({
              code: 'Inicio de sesión exitoso',
              message: 'Has iniciado sesión exitosamente',
            });
            if ( authResult.user?.rol ) {
              const rol = authResult.user.rol;
              switch(rol) {
                case 'admin':
                  this.router.navigateByUrl(moduleRoutes.ADMIN)
                  break;
                case 'especialista':
                  this.router.navigateByUrl(moduleRoutes.ESPECIALISTA)
                  break;
                case 'paciente':
                  this.router.navigateByUrl(moduleRoutes.PACIENTE)
                  break;

              }
            }
          } else {
            // En caso de error, muestra el mensaje correspondiente
            const authMessage = authResult?.result || {
              code: '¡Error en el inicio de sesión!',
              message: 'Hubo un problema al iniciar sesión, intenta nuevamente más tarde.',
            };
            this.setMessage(authMessage.message);
            showError(authMessage);
          }
        },
        error: (err) => {
          // Manejo de errores globales que podrían surgir en la suscripción
          const authMessage = {
            code: 'Error inesperado',
            message: 'Un error inesperado ha ocurrido. Intenta nuevamente más tarde.',
          };
          this.setMessage(authMessage.message);
          showError(authMessage);
        },
      });
      this.subscriptions.push(subscription);
    } catch (error) {
      // Manejo de errores inesperados fuera de la llamada al servicio
      const authMessage: AuthMessage = {
        code: 'Error inesperado',
        message: 'Un error inesperado ha ocurrido, intentalo nuevamente o comunicate con el proveedor de servicios',
      };
      this.setMessage(authMessage.message);
      showError(authMessage);
    }
  }

  loadUser(usuario: Usuario) {
    this.form.patchValue({email: usuario.email, clave: usuario.clave});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription)=>{
      subscription.unsubscribe();
    })
  }
}
