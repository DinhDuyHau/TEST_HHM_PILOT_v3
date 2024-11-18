import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '@app/sales-management/model/ticket/sale-service/model';
import { CommonService } from '../../common/common.service';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../../component/search/serach-dialog.component';


@Component({
  selector: 'app-sale-service-dialog',
  templateUrl: './sale-service-dialog.component.html',
  styleUrls: ['./sale-service-dialog.component.scss']
})
export class SaleServiceDialogComponent {
  @ViewChild('form') form!: ElementRef;
  disabled = false;
  quantity: any;
  gia_vat: number = 0;
  ma_lydo: string = '';
  noi_dung: string = '';

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<SaleServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Service },
  ) {
  }
  ngOnInit(): void {
    this.quantity = this.data.item.so_luong;
    this.gia_vat = this.data.item.gia_vat;
    this.ma_lydo = this.data.item.ma_td1;
    this.noi_dung = this.data.item.noi_dung;
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
    if (this.gia_vat != this.data.item.gia_vat && this.ma_lydo == '') {
      this.commonService.showMessage('Bạn chưa chọn lý do sửa giá');
      return;
    }
    if (this.quantity != this.data.item.so_luong || this.gia_vat != this.data.item.gia_vat) {
      this.data.item.so_luong = this.quantity;
      this.data.item.gia_vat = this.gia_vat;
      this.data.item.gia_ban = Math.round(this.data.item.gia_vat / (1 + this.data.item.thue_suat / 100));
      this.data.item.thanh_tien = this.data.item.gia_ban * this.data.item.so_luong;
      this.data.item.tong_tien = this.data.item.gia_vat * this.data.item.so_luong;
      this.data.item.tien_thue = this.data.item.tong_tien - this.data.item.thanh_tien;
    }
    this.data.item.ma_td1 = this.ma_lydo;
    this.data.item.noi_dung = this.noi_dung;
    this.dialogRef.close(1);
  }

  openSearchReasonDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.REASON })
      .afterClosed()
      .subscribe((result: any) => {
        this.ma_lydo = result.ma_lydo;
        this.noi_dung = result.noi_dung;
      });
  }

}
