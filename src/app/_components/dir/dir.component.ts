import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Grid } from '../grid/grid.model';
import { CustomerService } from '../category/customer/customer.service';
import { Customer } from '../category/customer/customer.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dir',
  templateUrl: './dir.component.html',
  styleUrls: ['./dir.component.scss']
})
export class DirComponent extends Grid<Customer> {
  title = 'Danh mục khách hàng';
  constructor(
    public dialogRef: MatDialogRef<DirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private customerService: CustomerService,
  ) {
    super(customerService);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}