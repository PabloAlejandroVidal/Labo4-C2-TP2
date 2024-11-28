import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authInstance$, user, User, UserCredential } from '@angular/fire/auth';
import { filter, map, Observable } from 'rxjs';


export interface UserAuthResult {
  result: {
    code: string,
    message: string,
  };
  success: boolean;
  user: User | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth: Auth = inject(Auth);
  public user$: Observable<User | null> = user(this.auth);

  async register(email: string, password: string): Promise<UserAuthResult> {

    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return {
        user: userCredential.user,
        success: true,
        result: {
          code: 'Cuenta creada exitosamente',
          message: 'Su cuenta fue creada exitosamente',
        },
      };

    } catch (error: any) {
      const userAuthResult: UserAuthResult = {
        user: null,
        success: false,
        result: {
          code: 'Error inesperado',
          message: 'Ocurrió un error inesperado al intentar registrar usuario'
        }
      }
      switch (error.code) {
        case 'auth/operation-not-allowed':
          userAuthResult.result.code = 'Operacion no permitida',
          userAuthResult.result.message = 'Verifica los datos ingresados e intenta nuevamente'
        break;
        case 'auth/missing-password':
          userAuthResult.result.code = 'No se proporcionó una contraseña',
          userAuthResult.result.message = 'Verifica los datos ingresados e intenta nuevamente'
        break;
        case 'auth/invalid-credential':
          userAuthResult.result.code = 'Credencial inválida';
          userAuthResult.result.message = 'Verifica los datos ingresados e intenta nuevamente';
        break;
        case 'auth/too-many-requests':
          userAuthResult.result.code = 'Demasiadas peticiones';
          userAuthResult.result.message = 'Has intentado acceder demasiadas veces';
        break;
        case 'auth/user-not-found':
          userAuthResult.result.code = 'Usuario no encontrado';
          userAuthResult.result.message = 'El usuario no ha podido ser encontrado';
        break;
        case 'auth/wrong-password':
          userAuthResult.result.code = 'Contraseña incorrecta';
          userAuthResult.result.message = 'La contraseña es incorrecta. Por favor, intenta nuevamente';
        break;
        case 'auth/email-already-in-use':
          userAuthResult.result.code = 'Correo Electrónico no válido';
          userAuthResult.result.message = 'El correo electrónico ingresado ya se encuentra en uso';
        break;
        case 'auth/invalid-email':
          userAuthResult.result.code = 'Correo Electrónico no válido';
          userAuthResult.result.message = 'El correo electrónico ingresado no es válido';
        break;
        case 'auth/user-disabled':
          userAuthResult.result.code = 'Cuenta deshabilitada';
          userAuthResult.result.message = 'La cuenta no se encuentra habilitada';
        break;
      }
      return userAuthResult;
    }
  }

  async login(email: string, password: string): Promise<UserAuthResult> {

    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        user: userCredential.user,
        success: true,
        result: {
          code: 'Inicio de seción exitoso',
          message: 'Has iniciado sesión exitosamente',
        },
      };

    } catch (error: any) {
      const userAuthResult: UserAuthResult = {
        user: null,
        success: false,
        result: {
          code: 'Error inesperado',
          message: 'Ocurrió un error inesperado al intentar iniciar sesión'
        }
      }
      switch (error.code) {
        case 'auth/operation-not-allowed':
          userAuthResult.result.code = 'Operacion no permitida',
          userAuthResult.result.message = 'Verifica los datos ingresados e intenta nuevamente'
        break;
        case 'auth/missing-password':
          userAuthResult.result.code = 'No se proporcionó una contraseña',
          userAuthResult.result.message = 'Verifica los datos ingresados e intenta nuevamente'
        break;
        case 'auth/invalid-credential':
          userAuthResult.result.code = 'Credencial inválida',
          userAuthResult.result.message = 'Verifica los datos ingresados e intenta nuevamente'
        break;
        case 'auth/too-many-requests':
          userAuthResult.result.code = 'Demasiadas peticiones',
          userAuthResult.result.message = 'Has intentado acceder demasiadas veces'
        break;
        case 'auth/user-not-found':
          userAuthResult.result.code = 'Usuario no encontrado',
          userAuthResult.result.message = 'El usuario no ha podido ser encontrado'
        break;
        case 'auth/wrong-password':
          userAuthResult.result.code = 'Contraseña incorrecta',
          userAuthResult.result.message = 'La contraseña es incorrecta. Por favor, intenta nuevamente'
        break;
        case 'auth/invalid-email':
          userAuthResult.result.code = 'Correo electrónico no válido',
          userAuthResult.result.message = 'El correo electrónico ya está en uso o no es válido'
        break;
        case 'auth/user-disabled':
          userAuthResult.result.code = 'Cuenta deshabilitada',
          userAuthResult.result.message = 'La cuenta no se encuentra habilitada'
        break;
      }
      return userAuthResult;
    }
  }


  async logout(): Promise<UserAuthResult> {
    try {
      await signOut(this.auth);
      return {
        user: this.auth.currentUser,
        success: true,
        result: {
          code: 'Cierre de sesión exitoso',
          message: 'Has cerrado sesión exitosamente',
      },
    };
    }
    catch (error: any){
      return {
        user: null,
        success: false,
        result: {
          code: 'Error inesperado',
          message: 'Ocurrió un error inesperado al intentar iniciar sesión',
      },
    };
    }
  }

  observeCurrentUser(): Observable<any> {
    return user(this.auth);
  }

}
