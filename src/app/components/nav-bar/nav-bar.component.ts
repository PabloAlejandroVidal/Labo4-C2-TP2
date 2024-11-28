import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToggleMenuComponent } from '../toggle-menu/toggle-menu.component';
import { UserService } from '../../shared/services/user.service';

export interface RoutesForNav {
  name: string,
  path: string,
}
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, ToggleMenuComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  @Input() showMenu!: boolean;
  @Input() menuBtnActive!: boolean;
  @Input() showLogout!: boolean;
  @Input({required: true}) routes: RoutesForNav[] = [];

  @Output() logout = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ){
  }

  onNavigate = (path: string) => this.router.navigate([path], {relativeTo: this.route});

  onLogout () {
    this.logout.emit();
  }

  onToggle() {
    if (!this.menuBtnActive) {
      this.toggle.emit();
    }
  }
}
