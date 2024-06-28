import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRenewComponent } from './sale-renew.component';

describe('SaleRenewComponent', () => {
  let component: SaleRenewComponent;
  let fixture: ComponentFixture<SaleRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleRenewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
