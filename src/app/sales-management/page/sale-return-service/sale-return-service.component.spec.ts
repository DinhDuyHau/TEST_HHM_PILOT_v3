import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnServiceComponent } from './sale-return-service.component';

describe('RetailComponent', () => {
  let component: SaleReturnServiceComponent;
  let fixture: ComponentFixture<SaleReturnServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleReturnServiceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleReturnServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
