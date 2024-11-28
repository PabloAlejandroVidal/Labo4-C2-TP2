import { Component, inject } from '@angular/core';
import { AuthData, AuthMessage, UserService } from '../../../shared/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lettersOnlyValidator } from '../../../validators/lettersOnlyValidator';
import { numbersOnlyValidator } from '../../../validators/numbersOnlyValidator';
import { ClinicaUsuariosService, Paciente, valoresAdmitidos } from '../../../shared/services/clinica-usuarios.service';
import { showError, showSuccess } from '../../../shared/Utils/swalAlert';
import { catchError, first, of } from 'rxjs';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.scss'
})
export class RegistroPacienteComponent {


  userService: UserService = inject(UserService);

  msgResult: string = '';
  form!: FormGroup;

  async ngOnInit(){
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.minLength(valoresAdmitidos.minNamesLength), lettersOnlyValidator(), Validators.required]),
      apellido: new FormControl("", [Validators.minLength(valoresAdmitidos.minNamesLength), lettersOnlyValidator(), Validators.required]),
      edad: new FormControl("", [numbersOnlyValidator(), Validators.min(valoresAdmitidos.minAge), Validators.max(valoresAdmitidos.maxAge), Validators.required]),
      dni: new FormControl("", [numbersOnlyValidator(), Validators.minLength(valoresAdmitidos.dniLength), Validators.maxLength(valoresAdmitidos.dniLength), Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      obraSocial: new FormControl("", [Validators.required]),
      clave: new FormControl("", [Validators.minLength(valoresAdmitidos.minPassLength), Validators.required]),
      imagen: new FormControl(null, [Validators.required]),
      imagen2: new FormControl(null, [Validators.required]),
    });
  }


  setMessage(message: string) {
    this.msgResult = message;

  }

  onSubmit() {
    this.register();
    this.form.reset();
  }

  register() {
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
      const especialista: Paciente = this.form.value;
      const {email = '', clave = ''} = {...this.form.value};

      // Llamada al servicio de registro, usando from para convertirlo en un Observable
      this.userService.registrarUsuario(especialista, email, clave, 'paciente').pipe(
        catchError((error) => {
          console.log('error')
          console.log(error)
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
      ).pipe(
        first(),
      ).subscribe({
        next: (authResult) => {
          // Manejo de resultados cuando el registro es exitoso
          if (authResult && authResult.success) {
            // Aquí, puedes comprobar si el login fue exitoso o redirigir a otra página
            showSuccess({
              code: 'Cuenta creada exitosamente',
              message: 'Has creado tu cuenta exitosamente',
            });
          } else {
            // En caso de error, muestra el mensaje correspondiente
            const authMessage = authResult?.result || {
              code: '¡Error en el registro!',
              message: 'Hubo un problema con el registro, intenta nuevamente más tarde.',
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

}
