import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiwichButtonComponent } from './siwich-button.component';

describe('SiwichButtonComponent', () => {
  let component: SiwichButtonComponent;
  let fixture: ComponentFixture<SiwichButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiwichButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiwichButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
