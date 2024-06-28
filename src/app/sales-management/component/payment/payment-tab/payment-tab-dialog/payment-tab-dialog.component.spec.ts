import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTabDialogComponent } from './payment-tab-dialog.component';

describe('PaymentTabDialogComponent', () => {
  let component: PaymentTabDialogComponent;
  let fixture: ComponentFixture<PaymentTabDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTabDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTabDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
