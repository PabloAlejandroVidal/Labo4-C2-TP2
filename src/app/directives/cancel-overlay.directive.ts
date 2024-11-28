import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCancelOverlay]',
  standalone: true
})
export class CancelOverlayDirective {

  private overlay: HTMLElement | null = null;
  private isMouseInElement = false;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.createOverlay();
  }

  private createOverlay(): void {
    // Crear el overlay pero sin mostrarlo aún
    this.overlay = this.renderer.createElement('div');
    this.renderer.setStyle(this.overlay, 'position', 'absolute');
    this.renderer.setStyle(this.overlay, 'top', '0');
    this.renderer.setStyle(this.overlay, 'right', '0');
    this.renderer.setStyle(this.overlay, 'width', '100%');
    this.renderer.setStyle(this.overlay, 'height', '100%');
    this.renderer.setStyle(this.overlay, 'background', 'rgba(155, 155, 155, .6)');
    this.renderer.setStyle(this.overlay, 'display', 'flex');
    this.renderer.setStyle(this.overlay, 'alignItems', 'center');
    this.renderer.setStyle(this.overlay, 'justifyContent', 'center');
    this.renderer.setStyle(this.overlay, 'cursor', 'pointer');
    this.renderer.setStyle(this.overlay, 'zIndex', '10');
    this.renderer.setStyle(this.overlay, 'visibility', 'hidden');

    const icon = this.renderer.createElement('svg', 'svg');
    this.renderer.setStyle(icon, 'width', '100%');
    this.renderer.setStyle(icon, 'height', '100%');
    this.renderer.setStyle(icon, 'background', 'rgba(255, 155, 155, .6)');

    const line = this.renderer.createElement('line', 'svg');
    this.renderer.setAttribute(line, 'x1', "10%");
    this.renderer.setAttribute(line, 'y1', "10%");
    this.renderer.setAttribute(line, 'x2', "90%");
    this.renderer.setAttribute(line, 'y2', "90%");
    this.renderer.setAttribute(line, 'stroke', "red");
    this.renderer.setAttribute(line, 'stroke-width', "4");

    const line2 = this.renderer.createElement('line', 'svg');
    this.renderer.setAttribute(line2, 'x1', "90%");
    this.renderer.setAttribute(line2, 'y1', "10%");
    this.renderer.setAttribute(line2, 'x2', "10%");
    this.renderer.setAttribute(line2, 'y2', "90%");
    this.renderer.setAttribute(line2, 'stroke', "red");
    this.renderer.setAttribute(line2, 'stroke-width', "4");


    this.renderer.appendChild(icon, line);
    this.renderer.appendChild(icon, line2);


    this.renderer.appendChild(this.overlay, icon);
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, this.overlay);
  }

  // Escuchamos el evento click por defecto y reemplazamos con el evento personalizado si existe
  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none'); // Oculta el elemento principal
  }

  @HostListener('mousemove') onMouseMove() {
    if (this.isMouseInElement){
      this.renderer.setStyle(this.overlay, 'visibility', 'visible');
    }
  }

  // Mostrar el overlay al hacer hover
  @HostListener('mouseenter') onMouseEnter() {
    this.isMouseInElement = true;
  }

  // Ocultar el overlay al salir del hover
  @HostListener('mouseleave') onMouseLeave() {
    this.isMouseInElement = false;
    this.renderer.setStyle(this.overlay, 'visibility', 'hidden');
  }

}

