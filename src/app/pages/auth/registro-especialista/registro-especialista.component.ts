import { Component, inject } from '@angular/core';
import { AuthData, AuthError, AuthMessage, UserService } from '../../../shared/services/user.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { lettersOnlyValidator } from '../../../validators/lettersOnlyValidator';
import { numbersOnlyValidator } from '../../../validators/numbersOnlyValidator';
import { ClinicaUsuariosService, Especialidad, Especialista } from '../../../shared/services/clinica-usuarios.service';
import { showError, showSuccess } from '../../../shared/Utils/swalAlert';
import { catchError, first, from, of, Subscription } from 'rxjs';
import { especialidadesNombres } from '../../../shared/interfaces/clinica';

export interface EspecialidadCheckeable{
  nombre: string,
  clave: string,
  isAdded: boolean
  checked: boolean,
}

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.scss'
})
export class RegistroEspecialistaComponent {

  userService: UserService = inject(UserService);
  clinicaUsuariosService: ClinicaUsuariosService = inject(ClinicaUsuariosService);
  subscriptions: Subscription[] = [];

  especialidadesOpciones: EspecialidadCheckeable[] = [];

  msgResult: string = '';
  form!: FormGroup;

  async ngOnInit(){

    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.minLength(2), lettersOnlyValidator(), Validators.required]),
      apellido: new FormControl("", [Validators.minLength(2), lettersOnlyValidator(), Validators.required]),
      edad: new FormControl("", [numbersOnlyValidator(), Validators.min(18), Validators.max(99), Validators.required]),
      dni: new FormControl("", [numbersOnlyValidator(), Validators.minLength(8), Validators.maxLength(8), Validators.required]),
      especialidades: new FormArray<FormControl>([] ,[Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      clave: new FormControl("", [Validators.minLength(6), Validators.required]),
      imagen: new FormControl(null, [Validators.required]),
    });

    this.setEspecialidadesOpciones();
  }

  setEspecialidadesOpciones() {
    for (const key in especialidadesNombres) {
      if (Object.prototype.hasOwnProperty.call(especialidadesNombres, key)) {
        const element = especialidadesNombres[key];
        this.especialidadesOpciones.push({
          nombre: element,
          clave: key,
          checked: false,
          isAdded: false,
        })
      }
    }
  }

  selectOpcion(opcion: EspecialidadCheckeable) {
    const formOptionSelected = new FormControl(opcion.clave);
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

  eliminarOpcion(opcion: EspecialidadCheckeable) {
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
    const opcion = this.especialidadesOpciones.find((e)=>e.clave === normalizedOpcion) || null;
    if(!opcion){
      const newOpcion: EspecialidadCheckeable = {
        nombre: newName,
        clave: normalizedOpcion,
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
      const especialista: Especialista = this.form.value;
      const {email = '', clave = ''} = {...this.form.value};

      // Llamada al servicio de registro, usando from para convertirlo en un Observable
      const subscription =  this.userService.registrarUsuario(especialista, email, clave, 'especialista').pipe(
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
            const especialidadesParaGuardar = this.especialidadesOpciones
            .filter((especialidad)=>especialidad.isAdded)
            .map((especialidad)=> {return {clave: especialidad.clave, nombre: especialidad.nombre}})

            this.clinicaUsuariosService.agregarEspecialidades(especialidadesParaGuardar);
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
