import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleGiftRepayComponent } from './sale-gift-repay.component';

describe('SaleGiftRepayComponent', () => {
  let component: SaleGiftRepayComponent;
  let fixture: ComponentFixture<SaleGiftRepayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleGiftRepayComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleGiftRepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
