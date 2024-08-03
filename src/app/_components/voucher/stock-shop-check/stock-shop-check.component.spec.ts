import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockShopCheckComponent } from './stock-shop-check.component';

describe('StockShopCheckComponent', () => {
  let component: StockShopCheckComponent;
  let fixture: ComponentFixture<StockShopCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockShopCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockShopCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
