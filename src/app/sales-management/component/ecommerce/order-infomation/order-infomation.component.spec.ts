import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInfomationComponent } from './order-infomation.component';

describe('OrderInfomationComponent', () => {
  let component: OrderInfomationComponent;
  let fixture: ComponentFixture<OrderInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderInfomationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
