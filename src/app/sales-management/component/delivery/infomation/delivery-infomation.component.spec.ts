import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInfomationComponent } from './delivery-infomation.component';

describe('DeliveryInfomationComponent', () => {
  let component: DeliveryInfomationComponent;
  let fixture: ComponentFixture<DeliveryInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryInfomationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeliveryInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
