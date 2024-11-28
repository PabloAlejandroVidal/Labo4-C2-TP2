import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorImagenComponent } from './selector-imagen.component';

describe('SelectorImagenComponent', () => {
  let component: SelectorImagenComponent;
  let fixture: ComponentFixture<SelectorImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorImagenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
