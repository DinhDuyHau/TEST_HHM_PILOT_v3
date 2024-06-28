import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnComponent } from './sale-return-online.component';

describe('RetailComponent', () => {
  let component: SaleReturnComponent;
  let fixture: ComponentFixture<SaleReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleReturnComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
