import { Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { RoutesForNav } from '../../../components/nav-bar/nav-bar.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-paciente-layout',
  templateUrl: './paciente-layout.component.html',
  styleUrl: './paciente-layout.component.scss'
})
export class PacienteLayoutComponent {

  constructor(
    private userService: UserService,
    private navigationService: NavigationService,
  ) { }
  routesForNav: RoutesForNav[] = [
    {name:'Turnos', path: 'turnos'},
    {name:'Mis Turnos', path: 'mis-turnos'},
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
