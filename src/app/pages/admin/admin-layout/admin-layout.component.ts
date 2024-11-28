import { Component, Input } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { animacionesRuta } from '../../../animations/animations';
import { RoutesForNav } from '../../../components/nav-bar/nav-bar.component';
import { UserService } from '../../../shared/services/user.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  animations: [animacionesRuta],
})
export class AdminLayoutComponent {
  menuActive: boolean = false;
  constructor(
    private contexts: ChildrenOutletContexts,
    private userService: UserService,
    private navigationService: NavigationService,
  ){
  }
  routesForNavBar: RoutesForNav[] = [
    {name:'Usuarios', path: 'usuarios'},
    {name:'Turnos', path: 'turnos'},
    {name:'Mi Perfil', path: 'mi-pErfil'},
  ]
  routesForSideBar: RoutesForNav[] = [
    {name:'Listar', path: 'usuarios/listar-usuarios'},
    {name:'Nuevo Paciente', path: 'usuarios/alta-paciente'},
    {name:'Nuevo Especialista', path: 'usuarios/alta-especialista'},
    {name:'Nuevo Admin', path: 'usuarios/alta-admin'},
  ]

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  onMenu() {
    this.menuActive = !this.menuActive;
  }

  onLogOut() {
    this.userService.logOutUser().pipe(
      take(1),
    ).subscribe(()=>{
      this.navigationService.navigateHome();
    }
    );
  }
}
