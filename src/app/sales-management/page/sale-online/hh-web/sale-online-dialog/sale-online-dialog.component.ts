import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Merchandise } from '@app/sales-management/model/ticket/sale-online/model';
import { CommonService } from '../../../common/common.service';

@Component({
  selector: 'app-sale-online-dialog',
  templateUrl: './sale-online-dialog.component.html',
  styleUrls: ['./sale-online-dialog.component.scss']
})
export class SaleOnlineDialogComponent {
  @ViewChild('form') form!: ElementRef;
  disabled = false;
  dataItem: any;
  tong_tien: any;
  gia_dc: any;

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<SaleOnlineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Merchandise },
  ) {
  }
  ngOnInit(): void {
    console.log(this.data.item)
    this.tong_tien = this.data.item.thanh_toan;
    this.gia_dc = this.data.item.s5;
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }
  handleTotal(gia_dc: any) {
    this.gia_dc = gia_dc;
    this.tong_tien = this.data.item.thanh_toan + gia_dc;
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSelect(): void {
    this.data.item.thanh_toan = this.tong_tien;
    this.data.item.s5 = this.gia_dc;
    this.dialogRef.close();
  }

}
