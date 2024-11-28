import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarTokenEmailComponent } from './verificar-token-email.component';

describe('VerificarTokenEmailComponent', () => {
  let component: VerificarTokenEmailComponent;
  let fixture: ComponentFixture<VerificarTokenEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarTokenEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarTokenEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
