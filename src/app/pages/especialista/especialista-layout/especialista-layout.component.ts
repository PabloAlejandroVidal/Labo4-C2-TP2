import { Component } from '@angular/core';
import { RoutesForNav } from '../../../components/nav-bar/nav-bar.component';
import { ChildrenOutletContexts } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { concatMap, take } from 'rxjs';
import { UsuarioResult } from '../../../shared/services/clinica-usuarios.service';

@Component({
  selector: 'app-especialista-layout',
  templateUrl: './especialista-layout.component.html',
  styleUrl: './especialista-layout.component.scss'
})
export class EspecialistaLayoutComponent {
  constructor(
    private userService: UserService,
    private navigationService: NavigationService,
  ){ }

  routesForNav: RoutesForNav[] = [
    {name:'Turnos', path: 'turnos'},
    {name:'Mi perfil', path: 'mi-perfil'},
    {name:'Mis horarios', path: 'mis-horarios'},
  ]

  onLogOut() {
    this.userService.logOutUser().pipe(
      take(1),
    ).subscribe(()=>{
      this.navigationService.navigateHome();
    }
    );
  }
}
