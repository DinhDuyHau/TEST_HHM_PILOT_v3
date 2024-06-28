import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { Customer, CustomerModel } from '@app/_components/category/customer/customer.model';
import { CustomerService } from '@app/_components/category/customer/customer.service';
import { Grid } from '@app/_components/grid/grid.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { Language } from '@app/sales-management/page/common/language';
@Component({
  selector: 'delivery-employee-search',
  templateUrl: './customer-create-dialog.component.html',
  styleUrls: ['./customer-create-dialog.component.scss'],
})
export class CustomerCreateDialogComponent implements OnInit {
  title = 'Thêm khách hàng';
  dataFormat = dataFormat;
  invalid = false;
  customerName = '';
  customer: Customer = {
    ma_kh: '',
    ten_kh: '',
    ten_kh2: '',
    dia_chi: '',
    ma_so_thue: '',
    email_cn: '',
  };

  constructor(
    public dialogRef: MatDialogRef<CustomerCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ma_kh: string },
    public customerService: CustomerService,
    public customerApiService: CustomerApiService,
    private commonService: CommonService,
  ) {
    this.customerName = data.ma_kh;
  }

  ngOnInit(): void {
    //
  }

  onSave() {
    this.invalid = !(this.customer.ma_kh && this.customer.ten_kh);
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (!this.invalid) {
      this.customerApiService.create(this.customer).subscribe(result => {
        if (result && result.success && result.result) {
          this.dialogRef.close(result.result);
        } else {
          this.commonService.showMessageByName(result.message);
        }
      });
    }
  }
  onCreateSuccess(customer: CustomerModel) {
    this.dialogRef.close(customer);
    //
  }

  onCancel() {
    this.dialogRef.close();
  }
}

