import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { delay, filter, finalize, map, of, switchMap, take } from 'rxjs';
import { NavigationService } from '../services/navigation.service';
import { LoadingService } from '../services/loading.service';

export const emailVerificadoGuard: CanActivateFn = (childRoute, state) => {

  const authService: AuthService = inject(AuthService);
  const userService: UserService = inject(UserService);
  const navigationService: NavigationService = inject(NavigationService);
  const loadingService: LoadingService = inject(LoadingService);

  loadingService.show();

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
            if (!usuario.emailVerificado){
              navigationService.navigateToEmailVerifier(usuario.rol);
              loadingService.hide();
              return false;
            }
            else{
              loadingService.hide();
              return true
            }
          })
        )
      }
      else{
        navigationService.navigateHome();
        loadingService.hide();
        return of(false);
      }
    })
  )
};
