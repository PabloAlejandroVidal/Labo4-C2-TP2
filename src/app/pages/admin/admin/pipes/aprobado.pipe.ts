import { Pipe, PipeTransform } from '@angular/core';
import { Administrador, Especialista, Paciente, Usuario } from '../../../../shared/services/clinica-usuarios.service';

@Pipe({
  name: 'aprobado',
  standalone: true
})
export class AprobadoPipe implements PipeTransform {

  transform(usuario: Usuario): string {
    if (usuario.rol === 'especialista'){
      if ((usuario as Especialista).aprobado) {
        return 'Si';
      }else{
        return 'No';
      }
    }else{
      return 'No corresponde'
    }
  }

}
