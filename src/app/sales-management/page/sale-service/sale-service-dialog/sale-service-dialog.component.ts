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
    this.quantity = this.data.item.so_luong;
    this.data.item.gia_vat = this.data.item.tong_tien / this.data.item.so_luong
  }
  handleQuantity(quantity: any) {
    this.quantity = quantity;
  }
  //Kiểm tra và loại bỏ số '0' ở đầu
  handleInput(event: any): void {
    let newValue = event.target.value;
    if (newValue && newValue[0] === '0' && newValue.length > 1) {
      newValue = newValue.replace(/^0+/, '');
    }
    this.quantity = newValue;
  }
  onCancel() {
    this.dialogRef.close(0);
  }
  onSelect(): void {
    if (this.quantity == 0) {
      this.commonService.showMessage('Số lượng phải lớn hơn 0');
      return;
    }
    this.data.item.so_luong = this.quantity;
    this.data.item.thanh_tien = Math.round(this.data.item.gia_ban * this.data.item.so_luong);
    this.data.item.tong_tien = this.data.item.gia_vat * this.data.item.so_luong;
    this.data.item.tien_thue = this.data.item.tong_tien - this.data.item.thanh_tien;
    this.dialogRef.close(1);
  }

}
