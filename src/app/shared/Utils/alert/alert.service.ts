import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertComponent } from './alert.component';


export interface message {
  title: string,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  showAlert(title: string, message: string) {
    // Crear el componente CustomAlert dinámicamente
    const factory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const componentRef = factory.create(this.injector);

    // Configurar los inputs
    componentRef.instance.title = title;
    componentRef.instance.message = message;

    // Adjuntar el componente al DOM
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Opción para eliminar el componente después de un tiempo o al cerrar
    componentRef.instance.close = () => {
      this.appRef.detachView(componentRef.hostView);
      domElem.remove();
    };
  }
}
