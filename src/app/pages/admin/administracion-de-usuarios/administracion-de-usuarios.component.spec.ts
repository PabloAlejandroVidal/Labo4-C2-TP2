import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionDeUsuariosComponent } from './administracion-de-usuarios.component';

describe('AdministracionDeUsuariosComponent', () => {
  let component: AdministracionDeUsuariosComponent;
  let fixture: ComponentFixture<AdministracionDeUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionDeUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionDeUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
