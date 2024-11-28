import { inject, Injectable } from '@angular/core';
import emailjs from 'emailjs-com';
import { ClinicaUsuariosService, Rol, Usuario } from './clinica-usuarios.service';
import { showError, showSuccess } from '../Utils/swalAlert';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';

export interface VerifyToken {
  userId: string;
  token: string;
  validado: boolean;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailVerifierService {
  // location: Location = inject(Location);

  constructor(
    private firestore: Firestore,
    // private location: Location
  ) {

    // console.log(location.hostname)

    emailjs.init('kPgSBoExlu-Dm4h0j');
  }

  async enviarCorreoConfirmacion(usuario: Usuario): Promise<void> {
    const verifyToken = this.crearToken(usuario);
    await this.guardarToken(verifyToken).catch(()=>{

      showError({
        code: 'Error al guardar el token',
        message: 'No se pudo guardar el token en la database',
      });

    });
    const verification_link = `${window.location.origin}/verificar-email?token=${verifyToken.token}`;

    const templateParams = {
      to_email: usuario.email,
      to_name: usuario.nombre,
      verification_link,
      message: '¡Muchas gracias!',
      from_name: 'La Clinica',
    };

    return emailjs.send('service_tcq0juo', 'template_ax6c5dh', templateParams)
      .then(response => {
        showSuccess({
          code: 'Correo enviado exitosamente',
          message: 'Correo de verificación enviado con éxito'
        });

      })
      .catch(error => {
        showError({
        code: 'Imposible validar el correo',
        message: 'Error al enviar el correo de verificación'
      });
      });
  }

  private async guardarToken(verificacion: any) {
    // Guardar en la colección "verificaciones"
    const verificacionesColl = collection(this.firestore, 'verificaciones');
    return await addDoc(verificacionesColl, verificacion);
  }

  private crearToken (usuario: Usuario): VerifyToken {
    const token = uuidv4();
    const verificacion = {
      userId: usuario.id,
      token: token,
      validado: false,
      fechaCreacion: new Date().toISOString(), // Guardar la fecha
    };
    return verificacion;
  }

  async verificarToken(token: string): Promise<boolean> {
    const verificacionesColl = collection(this.firestore, 'verificaciones');
    const consulta = query(verificacionesColl, where('token', '==', token));

    const snapshot = await getDocs(consulta);
    if (snapshot.empty) {
      console.error('Token inválido o no encontrado');
      showError({
      code: 'Token inválido',
      message: 'El token es inválido o ya fue validado anteriormente'
    });
      return false;
    }

    const doc = snapshot.docs[0];
    const verificacion = doc.data() as VerifyToken;

    if (verificacion.validado) {
      showError({
      code: 'Imposible validar el token',
      message: 'El token ya fue validado previamente'
    });
      return false;
    }

    // Marcar el email como validado
    await updateDoc(doc.ref, { validado: true });
    showSuccess({
      code: 'Email validado con éxito',
      message: 'El correo electrónico fue validado con éxito'
    });
    return true;
  }

}
