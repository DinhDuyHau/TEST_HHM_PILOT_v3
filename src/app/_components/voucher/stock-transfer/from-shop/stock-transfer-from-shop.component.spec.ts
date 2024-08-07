import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockTransferFromShopComponent } from './stock-transfer-from-shop.component';


describe('StockTransferFromShopComponent', () => {
  let component: StockTransferFromShopComponent;
  let fixture: ComponentFixture<StockTransferFromShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockTransferFromShopComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StockTransferFromShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
