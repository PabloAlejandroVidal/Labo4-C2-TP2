import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickInOut]',
  standalone: true
})
export class ClickInOutDirective {
  @Output() clickInside = new EventEmitter<void>();
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (clickedInside) {
      this.clickInside.emit();
    }else{
      this.clickOutside.emit();
    }
  }

}
