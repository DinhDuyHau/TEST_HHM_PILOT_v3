import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceTabComponent } from './e-invoice-tab.component';

describe('EInvoiceTabComponent', () => {
  let component: EInvoiceTabComponent;
  let fixture: ComponentFixture<EInvoiceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EInvoiceTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EInvoiceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
