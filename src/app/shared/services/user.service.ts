import { Injectable, inject } from '@angular/core';
import { UserAuthResult, AuthService } from './auth.service';
import { User } from 'firebase/auth';
import { BehaviorSubject, catchError, concatMap, filter, first, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Administrador, ClinicaUsuariosService, Especialista, Paciente, Rol, Usuario, UsuarioResult, usuariosDePrueba } from './clinica-usuarios.service';

export interface AuthData {
  email: string;
  password: string;
};

export interface AuthError {
  code: string,
  message: string,
}

export interface AuthMessage {
  code: string,
  message: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private authService: AuthService,
    private clinicaService: ClinicaUsuariosService,
  ) {
    this.authService.user$.pipe(
      switchMap((user) => {
        if (user && user.email) {
          return this.clinicaService.obtenerUsuarioPorEmail(user.email);
        } else {
          return of(null);
        }
      }),
      tap((usuario) => this.usuarioSubject.next(usuario))
    )
    .subscribe();
  }

  getUsuarioDeEjemplo (numberUser: 0 | 1 | 2, typeUser: 'especialistas' | 'pacientes') {
    return usuariosDePrueba[typeUser][numberUser];
  }

  loginUser(email: string, password: string): Observable<UsuarioResult> {
    return from(this.authService.login(email, password)).pipe(
      concatMap((authLoginResult) => {
        if (authLoginResult.success) {
          // Verificar el rol y autorización en otro servicio
          return from(this.clinicaService.obtenerUsuarioPorEmail(email)).pipe(
            concatMap((user) => {
              if (user) {
                return this.checkUserAuthorization(user);
              } else {
                return of({
                  success: false,
                  user: null,
                  result: {
                    code: 'Usuario no encontrado',
                    message: 'El usuario no se encuentra registrado en la base de datos',
                  },
                });
              }
            })
          );
        } else {
          return of(authLoginResult as UsuarioResult);
        }
      })
    );
  }

  private checkUserAuthorization(user: any): Observable<UsuarioResult> {
    switch (user.rol) {
      case 'admin':
        return of({ success: true, user, result: {
          code:'Inicio de sesión exitoso',
          message: 'Has iniciado sesión como administrador'
        } });

      case 'especialista':
        return of({ success: true, user, result: {
          code:'Inicio de sesión exitoso',
          message: 'Has iniciado sesión como especialista'
        } });

      case 'paciente':
        return of({ success: true, user, result: {
          code:'Inicio de sesión exitoso',
          message: 'Has iniciado sesión como paciente'
        } });

      default:
        return of({
          success: false,
          user: null,
          result: {
            code: 'Rol no autorizado',
            message: 'El rol del usuario no tiene acceso.',
          },
        });
    }
  }


  logOutUser(): Observable<UsuarioResult> {
    return from (this.authService.logout()) as Observable<UsuarioResult>;
  }

  observeCurrentUser(): Observable<Usuario | null> {
    return this.usuario$;
  }

  registrarUsuario(userData: any, email: string, password: string, rol: Rol): Observable<UsuarioResult> {
    return from(this.authService.register(email, password)).pipe(
      concatMap((authResult) => {
        if (authResult.success) {
          // Si el registro es exitoso, se continua con el registro del usuario en la base de datos
          const { pass = '', password = '', clave = '', ...userWithoutPass } = { ...userData, email};

          return this.clinicaService.registerUser(userWithoutPass, email, rol).pipe(
            map(() => authResult as UsuarioResult), // Devuelve authResult si el registro en DB es exitoso
            catchError(() => of({
              success: false,
              user: null,
              result: {
                code: 'Error al añadir el documento',
                message: 'No se pudo añadir el documento con la información del usuario. Intenta nuevamente más tarde.'
              }}))
          );
        } else {
          // Si el registro falla porque la cuenta ya está en uso, intenta hacer un login
          return from(this.authService.login(email, password)).pipe(
            concatMap((loginResult) => {
              if (loginResult.success) {
                // Verificar si los datos del usuario existen en la base de datos
                return from(this.clinicaService.obtenerUsuarioPorEmail(email)).pipe(
                  first(),
                  concatMap((user) => {
                    if (user) {
                    return from(this.authService.logout()).pipe(
                      map(() => {
                        return {
                          success: false,
                          user: null,
                          result: {
                            code: 'Usuario ya registrado',
                            message: 'La cuenta de usuario ya se encuentra registrada. Dirígete a la sección de Login',
                          }
                        }
                      })
                    );
                    } else {
                      // Si los datos no están completos, actualízalos
                      const { pass = '', password = '', clave = '', ...userWithoutPass } = { ...userData, email };

                      return from(this.clinicaService.registerUser(userWithoutPass, email, rol)).pipe(
                        // Devuelve el loginResult luego de completar los datos
                        map(() => loginResult as UsuarioResult),
                        catchError((error) => of({
                          success: false,
                          user: null,
                          result: {
                            code: 'Error al actualizar los datos',
                            message: 'No se pudo actualizar la información del usuario. Intenta nuevamente más tarde o comunicate con el proveedor de servicios'
                          }
                        }))
                      );
                    }
                  })
                );
              } else {
                return of(loginResult as UsuarioResult); // Si el login también falla, devuelve el resultado
              }
            })
          );
        }
      })
    );
  }

}
