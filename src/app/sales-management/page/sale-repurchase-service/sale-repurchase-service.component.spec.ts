import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRepurchaseServiceComponent } from './sale-repurchase-service.component';

describe('SaleRepurchaseComponent', () => {
  let component: SaleRepurchaseServiceComponent;
  let fixture: ComponentFixture<SaleRepurchaseServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleRepurchaseServiceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleRepurchaseServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
