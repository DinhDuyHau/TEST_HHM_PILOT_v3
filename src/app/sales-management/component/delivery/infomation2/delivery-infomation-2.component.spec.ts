import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInfomationComponent2 } from './delivery-infomation-2.component';

describe('DeliveryInfomationComponent2', () => {
  let component: DeliveryInfomationComponent2;
  let fixture: ComponentFixture<DeliveryInfomationComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryInfomationComponent2]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeliveryInfomationComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
