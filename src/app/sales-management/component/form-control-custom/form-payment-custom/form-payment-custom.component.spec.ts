import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPaymentCustomComponent } from './form-payment-custom.component';

describe('FormInputCustomComponent', () => {
  let component: FormPaymentCustomComponent;
  let fixture: ComponentFixture<FormPaymentCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormPaymentCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormPaymentCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
