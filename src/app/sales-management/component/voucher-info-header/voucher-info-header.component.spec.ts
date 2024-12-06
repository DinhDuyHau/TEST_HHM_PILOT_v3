import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherInfoHeaderComponent } from './voucher-info-header.component';

describe('VoucherInfoHeaderComponent', () => {
  let component: VoucherInfoHeaderComponent;
  let fixture: ComponentFixture<VoucherInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherInfoHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
