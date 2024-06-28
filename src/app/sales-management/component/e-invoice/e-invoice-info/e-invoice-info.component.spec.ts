import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceInfoComponent } from './e-invoice-info.component';

describe('EInvoiceInfoComponent', () => {
  let component: EInvoiceInfoComponent;
  let fixture: ComponentFixture<EInvoiceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EInvoiceInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EInvoiceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
