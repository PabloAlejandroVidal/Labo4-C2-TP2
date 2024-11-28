import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUploadOverlay]',
  standalone: true
})
export class UploadOverlayDirective {

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

// Crear el elemento SVG
const svg = this.renderer.createElement('svg', 'svg');
this.renderer.setAttribute(svg, 'width', '100%');
this.renderer.setAttribute(svg, 'height', '100%');
this.renderer.setAttribute(svg, 'viewBox', '0 0 100 100');
this.renderer.setStyle(svg, 'background', 'rgba(155, 255, 155, 1)');

// Crear un marcador para la punta de la flecha
const marker = this.renderer.createElement('marker', 'svg');
this.renderer.setAttribute(marker, 'id', 'arrow');
this.renderer.setAttribute(marker, 'markerWidth', '5');
this.renderer.setAttribute(marker, 'markerHeight', '5');
this.renderer.setAttribute(marker, 'refX', '0');
this.renderer.setAttribute(marker, 'refY', '0');

// Dibujar la punta de la flecha en el marcador
const arrowPath = this.renderer.createElement('path', 'svg');
this.renderer.setAttribute(arrowPath, 'd', 'M20,45 L50,15 L80,45 Z');
this.renderer.setAttribute(arrowPath, 'fill', 'green');
this.renderer.appendChild(svg, marker);

// Crear la línea que usará el gradiente y el marcador
const line = this.renderer.createElement('line', 'svg');
this.renderer.setAttribute(line, 'x1', '50');
this.renderer.setAttribute(line, 'y1', '30');
this.renderer.setAttribute(line, 'x2', '50');
this.renderer.setAttribute(line, 'y2', '85');
this.renderer.setAttribute(line, 'stroke-width', '24');
this.renderer.setAttribute(line, 'stroke', 'green');


const line2 = this.renderer.createElement('line', 'svg');
this.renderer.setAttribute(line2, 'x1', "50%");
this.renderer.setAttribute(line2, 'y1', "20%");
this.renderer.setAttribute(line2, 'x2', "50%");
this.renderer.setAttribute(line2, 'y2', "90%");
this.renderer.setAttribute(line2, 'stroke', "green");
this.renderer.setAttribute(line2, 'stroke-width', "24");
// Añadir la línea al elemento SVG
this.renderer.appendChild(svg, line);
this.renderer.appendChild(svg, arrowPath);

// Añadir el SVG al contenedor principal del componente

    this.renderer.appendChild(this.overlay, svg);
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, this.overlay);
  }

  // Escuchamos el evento click por defecto y reemplazamos con el evento personalizado si existe
  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    this.renderer.setStyle(this.overlay, 'visibility', 'hidden');
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

