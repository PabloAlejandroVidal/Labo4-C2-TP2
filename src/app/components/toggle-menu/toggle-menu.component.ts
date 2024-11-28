import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-menu',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toggle-menu.component.html',
  styleUrl: './toggle-menu.component.scss'
})
export class ToggleMenuComponent {
  @Output() toggle = new EventEmitter<void>();
  @Input({required: true}) isToggleActive = false;

  onToggle() {
    this.toggle.emit();
  }
}
