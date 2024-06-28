import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOnlineEcommerceComponent } from './sale-online-ecommerce.component';

describe('SaleOnlineEcommerceComponent', () => {
  let component: SaleOnlineEcommerceComponent;
  let fixture: ComponentFixture<SaleOnlineEcommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleOnlineEcommerceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleOnlineEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
