import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Merchandise, SaleOnlineEcommerceTicket } from '@app/sales-management/model/ticket/sale-online-ecommerce/model';
import { CommonService } from '../../../common/common.service';


@Component({
  selector: 'app-ecommerce-dialog',
  templateUrl: './ecommerce-dialog.component.html',
  styleUrls: ['./ecommerce-dialog.component.scss']
})
export class EcommerceDialogComponent implements OnInit {
  @ViewChild('form') form!: ElementRef;
  disabled = false;
  dataItem: any;
  tong_phi: any;
  phi_dc_khac: any;

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<EcommerceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Merchandise },
  ) {
  }
  ngOnInit(): void {
    this.tong_phi = this.data.item.tong_phi;
    this.phi_dc_khac = this.data.item.phi_dc_khac;
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }
  handleTotal(phi_dc_khac: any) {
    this.phi_dc_khac = phi_dc_khac;
    this.tong_phi = this.data.item.phi_san_01 + this.data.item.phi_san_02 + this.data.item.phi_san_03 + this.data.item.phi_san_04 +
      this.data.item.phi_san_05 + this.data.item.phi_san_06 + this.data.item.phi_san_07 + phi_dc_khac;
    this.tong_phi = Math.round(this.tong_phi);
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSelect(): void {
    this.data.item.tong_phi = this.tong_phi;
    this.data.item.phi_dc_khac = this.phi_dc_khac;
    this.dialogRef.close();
  }

}
