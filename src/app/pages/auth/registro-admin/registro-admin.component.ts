import { Component, inject } from '@angular/core';
import { AuthMessage, UserService } from '../../../shared/services/user.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { lettersOnlyValidator } from '../../../validators/lettersOnlyValidator';
import { numbersOnlyValidator } from '../../../validators/numbersOnlyValidator';
import { Administrador, ClinicaUsuariosService } from '../../../shared/services/clinica-usuarios.service';
import { showError, showSuccess } from '../../../shared/Utils/swalAlert';
import { catchError, first, from, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrl: './registro-admin.component.scss'
})
export class RegistroAdminComponent {

  userService: UserService = inject(UserService);
  clinicaService: ClinicaUsuariosService = inject(ClinicaUsuariosService);
  subscriptions: Subscription[] = [];

  especialidadesOpciones: Array<{name: string, value: string, checked: boolean, isAdded: boolean}> = [];

  msgResult: string = '';
  form!: FormGroup;

  async ngOnInit(){

    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.minLength(2), lettersOnlyValidator(), Validators.required]),
      apellido: new FormControl("", [Validators.minLength(2), lettersOnlyValidator(), Validators.required]),
      edad: new FormControl("", [numbersOnlyValidator(), Validators.min(18), Validators.max(99), Validators.required]),
      dni: new FormControl("", [numbersOnlyValidator(), Validators.minLength(8), Validators.maxLength(8), Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      clave: new FormControl("", [Validators.minLength(6), Validators.required]),
      imagen: new FormControl(null, [Validators.required]),
    });

  }


  selectOpcion(opcion: { name: string; value: string; checked: boolean; isAdded: boolean;}) {
    const formOptionSelected = new FormControl(opcion.value);
    if (opcion.checked){
      opcion.checked = false;
      if (opcion.isAdded) {
        this.eliminarOpcion(opcion);
      }
      this.eliminarControl(formOptionSelected);

    }else{
      opcion.checked = true;
      this.especialidades.push(formOptionSelected);
    }
    this.especialidades.markAsTouched();
  }

  eliminarOpcion(opcion: { name: string; value: string; checked: boolean; isAdded: boolean;}) {
    const index = this.especialidadesOpciones.indexOf(opcion);
    if (index !== -1) {
      this.especialidadesOpciones.splice(index, 1);
    }
  }

  eliminarControl(formControl: FormControl<string | null>) {
    const index = this.especialidades.controls.indexOf(formControl);
    this.especialidades.removeAt(index);
  }

  onEspecialidadSeleccionada(event: any) {
    this.agregarEspecialidadControl(event.target.value)
  }

  eliminarAcentos(texto: string) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  get especialidades(): FormArray {
    return this.form.get('especialidades') as FormArray;
  }

  agregarEspecialidadControl(newName: string) {
    const normalizedOpcion = this.eliminarAcentos(newName.toLowerCase());
    const opcion = this.especialidadesOpciones.find((e)=>e.value === normalizedOpcion) || null;
    if(!opcion){
      const newOpcion = {
        name: newName,
        value: normalizedOpcion,
        checked: false,
        isAdded: true,
      }
      this.especialidadesOpciones.push(newOpcion)
      this.selectOpcion(newOpcion);
    }
    else{
      this.selectOpcion(opcion);
    }
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
      const admin: Administrador = this.form.value;
      const {email = '', clave = ''} = {...this.form.value};

      // Llamada al servicio de registro, usando from para convertirlo en un Observable
      const subscription =  this.userService.registrarUsuario(admin, email, clave, 'admin').pipe(
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
      ).pipe(
        first(),
      ).subscribe({
        next: (authResult) => {
          // Manejo de resultados cuando el registro es exitoso
          if (authResult && authResult.success) {
            // Aquí, puedes comprobar si el register fue exitoso o redirigir a otra página
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


  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription)=>{
      subscription.unsubscribe();
    });
  }
}
