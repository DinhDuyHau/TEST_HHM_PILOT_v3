import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherInfoDialogComponent } from './voucher-info-dialog.component';

describe('VoucherInfoDialogComponent', () => {
  let component: VoucherInfoDialogComponent;
  let fixture: ComponentFixture<VoucherInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
