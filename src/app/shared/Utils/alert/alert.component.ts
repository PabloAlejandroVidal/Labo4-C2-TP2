import { Component, inject, Input, OnInit } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent  implements OnInit {

  splashActive: boolean = false;
  @Input() title: string = 'Alert';
  @Input() message: string = 'This is an alert message';
  alertService: AlertService = inject(AlertService);

  constructor() {
  }

  close() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.close()
    }, 8000);
  }
}
