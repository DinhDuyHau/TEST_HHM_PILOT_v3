import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleServiceComponent } from './sale-service.component';

describe('RetailComponent', () => {
  let component: SaleServiceComponent;
  let fixture: ComponentFixture<SaleServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleServiceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
