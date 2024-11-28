import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteMisTurnosComponent } from './paciente-mis-turnos.component';

describe('PacienteMisTurnosComponent', () => {
  let component: PacienteMisTurnosComponent;
  let fixture: ComponentFixture<PacienteMisTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteMisTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteMisTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
