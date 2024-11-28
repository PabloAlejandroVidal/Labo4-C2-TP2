import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesForNav } from '../../../components/nav-bar/nav-bar.component';
import { UserService } from '../../../shared/services/user.service';
import { take } from 'rxjs';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

  constructor(
    private router: Router,
    private userService: UserService,
    private navigationService: NavigationService,
  ) {

  }

  routesForNav: RoutesForNav[] = [
    {name:'Login', path: 'login'},
    {name:'Registro', path: 'registro'},
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
