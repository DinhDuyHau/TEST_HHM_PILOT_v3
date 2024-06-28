import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getDateTimeFormat } from '@app/_common/commonFunction';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-voucher-info-dialog',
  templateUrl: './voucher-info-dialog.component.html',
  styleUrls: ['./voucher-info-dialog.component.scss']
})
export class VoucherInfoDialogComponent {
  info: any;
  constructor(public dialogRef: MatDialogRef<VoucherInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: any },
    private commonService: CommonService
  ) {
    this.info = data.data;
    this.info.updateAt = getDateTimeFormat(new Date(this.info.updateAt));
    this.info.createAt = getDateTimeFormat(new Date(this.info.createAt));
  }

  onCancel() {
    this.dialogRef.close();
    //
  }
  getLabel(name: string) {
    return this.commonService.getMessage(name);
  }

  getInfomation() {
    let information: string = this.getLabel('text_info_voucher');
    information = information.replaceAll('%c1', this.info.createBy);
    information = information.replaceAll('%c2', this.info.updateBy);
    information = information.replaceAll('%d1', this.info.createAt);
    information = information.replaceAll('%d2', this.info.updateAt);
    return information;
  }
}
