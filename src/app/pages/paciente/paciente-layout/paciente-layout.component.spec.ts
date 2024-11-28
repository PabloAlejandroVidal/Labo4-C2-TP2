import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteLayoutComponent } from './paciente-layout.component';

describe('PacienteLayoutComponent', () => {
  let component: PacienteLayoutComponent;
  let fixture: ComponentFixture<PacienteLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
