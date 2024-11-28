import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-siwich-button',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './siwich-button.component.html',
  styleUrl: './siwich-button.component.scss',
  animations: [
    trigger('toggleState', [
      state('on', style({marginLeft: '100%', transform: 'translateX(-100%)', backgroundColor: 'green' })),
      state('off', style({marginLeft: '0', transform: 'translateX(0)', backgroundColor: 'red' })),
      transition('on <=> off', animate('0.8s cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ])
  ]
})
export class SiwichButtonComponent {
  @Input({required: true}) checkedName!: string;
  @Input({required: true}) uncheckedName!: string;
  @Input({required: true}) id!: string;

  @Input() model: boolean = false;
  @Output() modelChange = new EventEmitter<boolean>();

  get animationState() {
    return this.model ? 'on' : 'off';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['model']) {
      this.model = changes['model'].currentValue;
    }
  }
  onChange(event: Event) {
    this.model = (event.target as HTMLInputElement).checked;
    this.modelChange.emit(this.model);
  }
}
