import { animate, query, style, transition, trigger } from "@angular/animations";

export const animacionesRuta = [
  trigger('routeAnimations', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(100%)' }),
      animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
    ]),
    transition(':leave', [
      animate('0.5s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
    ]),
    transition('listar-usuarios => *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', [style({ opacity: 0, transform: 'translateX(100%)' })]),
      query(':leave', [animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-100%)' }))]),
      query(':enter', [animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))]),
    ]),
    transition('* => listar-usuarios', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', [style({ opacity: 0, transform: 'translateX(-100%)' })]),
      query(':leave', [animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))]),
      query(':enter', [animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))]),
    ]),
    transition('* <=> *', [
      style({ opacity: 1, transform: 'translateY(20px)' }),
      animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
    ]),
  ]),
]
