import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { CRMSelectComponent } from '../crm-select/crm-select.component';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';

@Component({
  selector: 'app-crm-dialog',
  templateUrl: './crm-dialog.component.html',
  styleUrls: ['./crm-dialog.component.scss']
})
export class CrmDialogComponent implements OnInit {
  @ViewChild('form') form!: ElementRef;
  currentItem!: any;
  voucherCode!: any;
  dataResponse = {
    crmCode: '',
    ma_ctr: '',
    ten_ctr: '',
    tien_ck: 0,
    ma_ck: '',
    ten_ck: '',
    ten_loai_ck: '',
    ngay_hl: null,
    ngay_hl2: null
  };

  constructor(
    private commonService: CommonService,
    private discountApiService: DiscountApiService,
    public dialogRef: MatDialogRef<CrmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentItem: any, voucherCode: any, ngay_ct: any },
  ) {
    this.currentItem = data.currentItem;
    this.voucherCode = data.voucherCode;

    this.dataResponse.ma_ctr = this.voucherCode?.ma_td1 || '';
    this.dataResponse.tien_ck = this.voucherCode?.tien_ck || 0;
    this.dataResponse.crmCode = this.voucherCode?.ma_voucher || '';
  }

  ngOnInit(): void {
    if (this.dataResponse.ma_ctr) {
      this.discountApiService.getProgramCRM(this.dataResponse.ma_ctr, this.currentItem.ma_vt, this.data.ngay_ct).subscribe(res => {
        if(res && res.success && res.result) {
          this.dataResponse.ma_ctr = res.result[0].ma_ctr;
          this.dataResponse.ten_ctr = res.result[0].ten_ctr;
          this.dataResponse.tien_ck = res.result[0].tien_giam;
          this.dataResponse.ma_ck = res.result[0].ma_ck;
          this.dataResponse.ten_ck = res.result[0].ten_ck;
          this.dataResponse.ngay_hl = res.result[0].ngay_hl;
          this.dataResponse.ngay_hl2 = res.result[0].ngay_hl2;
          this.dataResponse.ten_loai_ck = res.result[0].ten_loai_ck;
        }
      });
    }
  }

  changeCRMCode(event: any) {
    if (event && event.length > 16) {
      this.commonService.showMessage('Mã CRM không được vượt quá 16 ký tự');
    } else {
      this.dataResponse.crmCode = event;
    }
  }

  openCRMSelectDialog() {
    this.commonService.openDialog(CRMSelectComponent, { ma_vt: this.currentItem.ma_vt, ngay_ct: this.data.ngay_ct, ma_ctr: this.dataResponse.ma_ctr })
      .afterClosed().subscribe(discountSelected => {
        if (discountSelected) {
          this.dataResponse.ma_ctr = discountSelected[0].ma_ctr;
          this.dataResponse.ten_ctr = discountSelected[0].ten_ctr;
          this.dataResponse.tien_ck = discountSelected[0].tien_giam;
          this.dataResponse.ma_ck = discountSelected[0].ma_ck;
          this.dataResponse.ten_ck = discountSelected[0].ten_ck;
          this.dataResponse.ngay_hl = discountSelected[0].ngay_hl;
          this.dataResponse.ngay_hl2 = discountSelected[0].ngay_hl2;
          this.dataResponse.ten_loai_ck = discountSelected[0].ten_loai_ck;
        } else {
          this.dataResponse.ma_ctr = '';
          this.dataResponse.ten_ctr = '';
          this.dataResponse.tien_ck = 0;
          this.dataResponse.ma_ck = '';
          this.dataResponse.ten_ck = '';
          this.dataResponse.ngay_hl = null;
          this.dataResponse.ngay_hl2 = null;
          this.dataResponse.ten_loai_ck = '';
          this.dataResponse.crmCode = '';
        }
      });
  }

  onSave(): void {
    if (!this.dataResponse.crmCode) {
      this.commonService.showMessage('Vui lòng nhập mã CRM');
      return;
    }
    this.dialogRef.close(this.dataResponse);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
