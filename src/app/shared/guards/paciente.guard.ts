import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { filter, map, of, switchMap, take } from 'rxjs';
import { moduleRoutes, NavigationService } from '../services/navigation.service';
import { LoadingService } from '../services/loading.service';

export const pacienteGuard: CanActivateFn = (route, state) => {

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
            if (usuario.rol !== 'paciente'){
              loadingService.hide();
              return false;
            }
            else{
              loadingService.hide();
              return true;
            }
          })
        )
      }
      else{
        loadingService.hide();
        return of(false);
      }
    })
  )
};
