import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '@app/sales-management/model/ticket/sale-service/model';
import { CommonService } from '../../common/common.service';
import { Item } from '@app/sales-management/model/common/mobifone.model';

@Component({
  selector: 'app-sale-service-dialog',
  templateUrl: './sale-service-dialog.component.html',
  styleUrls: ['./sale-service-dialog.component.scss']
})
export class SaleServiceDialogComponent {
  @ViewChild('form') form!: ElementRef;
  disabled = false;
  quantity: any;
  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<SaleServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Service },
  ) {
  }
  ngOnInit(): void {
    console.log(this.data.item)
    this.quantity = this.data.item.so_luong;
  }
  handleQuantity(quantity: any) {
    this.quantity = quantity;
  }
  onCancel() {
    this.dialogRef.close(0);
  }
  onSelect(): void {
    this.data.item.so_luong = this.quantity;
    this.data.item.thanh_tien = Math.round(this.data.item.gia_ban * this.data.item.so_luong);
    this.data.item.tong_tien = this.data.item.gia_vat * this.data.item.so_luong;
    this.data.item.tien_thue = this.data.item.tong_tien - this.data.item.thanh_tien;
    this.dialogRef.close(1);
  }

}
