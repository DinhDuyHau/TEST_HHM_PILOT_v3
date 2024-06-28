import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import dataFormat from '@app/_common/dataFormat';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import button from '@app/_common/button';
import { DirComponent } from '@app/_components/dir/dir.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent extends Grid<Customer> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  title = 'Danh mục khách hàng';
  constructor(private customerService: CustomerService) {
    super(customerService);
    this.buttonsCustom = [...this.buttons, button.PrintButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}