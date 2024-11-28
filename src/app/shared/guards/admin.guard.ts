import { CanActivateFn } from '@angular/router';
import { filter, map, of, switchMap, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService: AuthService = inject(AuthService);
  const userService: UserService = inject(UserService);

  return authService.user$.pipe(
    take(1),
    switchMap((user)=>{
      if (user) {
        return userService.usuario$.pipe(
          filter((usuario)=>{
            return usuario !== null;
          }),
          take(1),
          map((usuario)=>{
            if (usuario.rol === 'admin') {
              return true;
            }
            else{
              //Solo el admin tiene permisos para acceder a esta seccion!
              return false
            }
          })
        )
      }
      else{
        //no hay usuario autenticado
        return of(false);
      }
    })
  )
};
