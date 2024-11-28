import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { filter, map, of, switchMap, take } from 'rxjs';
import { NavigationService } from '../services/navigation.service';

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService: AuthService = inject(AuthService);
  const userService: UserService = inject(UserService);
  const navigationService: NavigationService = inject(NavigationService);

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
            navigationService.navigateByRole(usuario.rol);
            return false
          })
        )
      }
      else{
        //El usuario no autenticado accede al login
        return of(true);
      }
    })
  )
};
