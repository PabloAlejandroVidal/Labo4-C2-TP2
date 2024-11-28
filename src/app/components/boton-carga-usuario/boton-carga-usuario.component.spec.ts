import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonCargaUsuarioComponent } from './boton-carga-usuario.component';

describe('BotonCargaUsuarioComponent', () => {
  let component: BotonCargaUsuarioComponent;
  let fixture: ComponentFixture<BotonCargaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonCargaUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonCargaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
