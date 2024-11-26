import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-price-dialog',
  templateUrl: './purchase-price-dialog.component.html',
  styleUrls: ['./purchase-price-dialog.component.scss']
})
export class PurchasePriceDialogComponent implements OnInit {
  @ViewChild('form') form!: ElementRef;
  sold_price: any;
  purchase_price: any;
  temp_purchase_price: any;

  constructor(
    public dialogRef: MatDialogRef<PurchasePriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sold_price: any, purchase_price: any },
  ) {
  }
  ngOnInit(): void {
    this.sold_price = this.data.sold_price;
    this.purchase_price = this.data.purchase_price || 0;
  }

  onCancel() {
    this.dialogRef.close(this.purchase_price);
  }

  onSave() {
    this.purchase_price = this.temp_purchase_price;
    this.dialogRef.close(this.purchase_price);
  }

  onchangeValue($event: any) {
    this.temp_purchase_price = $event;
  }
}
