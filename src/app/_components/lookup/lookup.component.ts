import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Grid } from '../gridV2/grid.model';
import { CustomerService } from '../category/customer/customer.service';
import { Customer } from '../category/customer/customer.model';
import { Router } from '@angular/router';
import { LookupData } from './lookup.model';
@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent extends Grid<any> {
  title = '';
  isChoose = false;
  multipleChoose = false;
  highlightColumns: string[] = [];
  disableByShop = false;

  constructor(
    public dialogRef: MatDialogRef<LookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LookupData,
  ) {
    super(data.service);
    this.title = data.service.getTitle();
    this.multipleChoose = data.multipleChoose;
    this.highlightColumns = data.highlightColumns || [];
    this.disableByShop = data.disableByShop;
  }
  onClickItemLookup(event: { item: any }) {
    this.dialogRef.close(event.item);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onClickChoose() {
    if (this.data.service.handleService) {
      // check trước khi nhận nút chọn của filter
      const check = this.data.service.handleService(event, this.dataSource.data.filter(item => item.choose), 'submit');
      if (check) {
        this.dialogRef.close(this.dataSource.data.filter(item => item.choose));
      }
    }
    else {
      this.dialogRef.close(this.dataSource.data.filter(item => item.choose));
    }
  }
  onHanleCheckboxListChanged(event: {
    item: any;
    indexColumn: number;
    indexRow: number;
  }): void {
    if (this.data.service.handleService) {
      this.data.service.handleService(event, this.dataSource.data, 'checkboxChange');
    }
  }
}
