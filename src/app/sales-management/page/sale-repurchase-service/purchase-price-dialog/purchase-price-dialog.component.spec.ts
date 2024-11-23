import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceDialogComponent } from './purchase-price-dialog.component';

describe('PurchasePriceDialogComponent', () => {
  let component: PurchasePriceDialogComponent;
  let fixture: ComponentFixture<PurchasePriceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasePriceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasePriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
