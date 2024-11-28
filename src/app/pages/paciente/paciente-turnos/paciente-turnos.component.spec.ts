import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteTurnosComponent } from './paciente-turnos.component';

describe('PacienteTurnosComponent', () => {
  let component: PacienteTurnosComponent;
  let fixture: ComponentFixture<PacienteTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
