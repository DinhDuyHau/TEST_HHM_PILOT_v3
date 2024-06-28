import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VNPayComponent } from './vnpay.component';

describe('EWalletComponent', () => {
  let component: VNPayComponent;
  let fixture: ComponentFixture<VNPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VNPayComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VNPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
