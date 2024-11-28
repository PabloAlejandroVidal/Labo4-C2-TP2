import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaLayoutComponent } from './especialista-layout.component';

describe('EspecialistaLayoutComponent', () => {
  let component: EspecialistaLayoutComponent;
  let fixture: ComponentFixture<EspecialistaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistaLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecialistaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
