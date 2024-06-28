import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleAffiliateComponent } from './sale-affiliate.component';

describe('SaleAffiliateComponent', () => {
  let component: SaleAffiliateComponent;
  let fixture: ComponentFixture<SaleAffiliateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleAffiliateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
