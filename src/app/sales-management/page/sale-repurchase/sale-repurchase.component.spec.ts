import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRepurchaseComponent } from './sale-repurchase.component';

describe('SaleRepurchaseComponent', () => {
  let component: SaleRepurchaseComponent;
  let fixture: ComponentFixture<SaleRepurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleRepurchaseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleRepurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
