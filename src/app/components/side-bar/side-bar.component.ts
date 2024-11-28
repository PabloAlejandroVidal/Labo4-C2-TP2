import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToggleMenuComponent } from "../toggle-menu/toggle-menu.component";
import { CommonModule } from '@angular/common';
import { RoutesForNav } from '../nav-bar/nav-bar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClickInOutDirective } from '../../directives/click-in-out.directive';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, ToggleMenuComponent, ClickInOutDirective],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  @Input({required: true}) routes: RoutesForNav[] = [];
  @Input() menuBtnActive: boolean = false;
  @Input() btnVisible: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ){}

  onToggle() {
    this.toggle.emit();
  }

  closeWhenIsOpen() {
    if (this.menuBtnActive){
      this.onToggle();
    }
  }

  onNavigate = (path: string) => this.router.navigate([path], {relativeTo: this.route});
}

