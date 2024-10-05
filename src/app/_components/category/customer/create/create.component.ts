import { Component, OnInit, Inject, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Button, Field, Grid, GridType } from '@app/_components/grid/grid.model';
import button from '@app/_common/button';
import { Customer, CustomerModel } from '../customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import dataFormat from '@app/_common/dataFormat';
import { MODE } from '@app/_components/voucher/enum/voucher_enum';
import { Location } from '@angular/common';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getResource } from '@app/_common/commonFunction';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { Language } from '@app/sales-management/page/common/language';

@Component({
  selector: 'app-customer-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateCustomerComponent extends Grid<Customer> implements OnInit {

  @Input() isComponent!: boolean;
  @Input() customerName!: string;
  @Output() handleCreateSucess = new EventEmitter<CustomerModel>();
  @ViewChild('form') form!: ElementRef;

  buttonsCustom!: Button[];
  override gridType = GridType.GridDetail;
  selectedDate: Date = new Date();
  value = '';
  title = 'Danh mục khách hàng';
  submitted = false;
  loading = false;
  disabled = false;
  invalid = false;
  disabled_ma_kh = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';

  dataFormat = dataFormat;
  customer: CustomerModel;
  optionGender = [
    {
      'gender': 'Nam'
    },
    {
      'gender': 'Nữ'
    },
    {
      'gender': 'Khác'
    }
  ];
  [key: string]: any;
  constructor(public customerService: CustomerService, private route: ActivatedRoute, private location: Location, private router: Router, private matSnackBar: MatSnackBar, private commonService: CommonService) {
    super(customerService);
    this.customer = new CustomerModel();
  }
  ngOnInit() {
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    this.route.url.subscribe(urlSegment => {
      let path = urlSegment[0].path;
      if (this.isComponent) { path = 'create'; this.customer.ma_kh = this.customerName || ''; }
      if (path) {
        switch (path) {
          case 'create':
            this.title = 'Tạo mới';
            this.mode = MODE.CREATE;
            this.submitButtonTitle = 'Thêm mới';
            this.cancelButtonTitle = 'Hủy bỏ';
            break;
          case 'update':
            this.title = 'Sửa';
            this.mode = MODE.UPDATE;
            this.submitButtonTitle = 'Sửa';
            this.cancelButtonTitle = 'Hủy bỏ';
            this.disabled_ma_kh = true;
            break;
          case 'view':
            this.disabled = true;
            this.title = 'Xem';
            this.mode = MODE.VIEW;
            this.cancelButtonTitle = 'Thoát';
            break;
        }
      }
    });
    this.route.queryParams.subscribe((params: any) => {
      if (params['ma_kh']) {
        this.initData(params['ma_kh']);
      }
      // console.log(Object.keys(params).map(key => ({ key, value: params[key] })));
    });
  }
  initData(ma_kh: string) {
    this.customerService.getItem(ma_kh).subscribe((item) => {
      if (item && item.success) {
        this.customer = item.result;
      }
      else {
        this.matSnackBar.open(getResource(item.message), 'Đóng', {
          duration: 2000,
        });
      }
    });
  }
  onEnter(event: any) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly]):not([disabled]):not([type="date"])');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === event.target) {
        if (i < inputs.length - 1) {
          inputs[i + 1].focus(); // Focus vào phần tử tiếp theo
          break;
        }
      }
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.containsSpecialCharacters(this.customer.ma_kh)) {
      this.commonService.showMessage(Language.content.invalid_ma_kh);
      return;
    }
    if (this.checkInvalidForm(this.customer))
      return;
    this.loading = true;
    if (this.mode == MODE.UPDATE) {
      this.customerService.update(this.customer).subscribe((item) => {
        this.loading = false;
        let mess = 'Sửa danh mục thất bại';
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          mess = item.message === '' ? 'Sửa danh mục thành công' : item.message;
        }
        else {
          mess = item.message === '' ? 'Lỗi không xác định' : item.message;
        }
        this.matSnackBar.open(getResource(mess), 'Đóng', {
          duration: 2000,
        });
      });
    }
    else if (this.mode == MODE.CREATE) {
      this.customerService.create(this.customer).subscribe((item) => {
        this.loading = false;
        let mess = 'Thêm danh mục thất bại';
        if (item.success) {
          if (!this.isComponent) {
            this.router.navigate(['..'], { relativeTo: this.route });
          }
          else {
            this.handleCreateSucess.emit(this.customer);
          }
          mess = item.message === '' ? 'Thêm danh mục thành công' : item.message;
        }
        else {
          mess = item.message === '' ? 'Lỗi không xác định' : item.message;
        }
        this.matSnackBar.open(getResource(mess), 'Đóng', {
          duration: 2000,
        });
      });
    }


  }
  onCancel() {
    if (!this.isComponent) {
      this.location.back();
    }
    else {
      this.handleCreateSucess.emit();
    }
  }
  onChangeLookupValue($event: any) {
    $event.forEach((item: any) => {

      if (item.control == 'ma_tinh' && this.customer[item.control] != item.value) {
        this.customer.ma_quan = '';
        this['ma_quan'] = '';
        this.customer['ten_quan'] = '';
        this['ten_quan'] = '';
        this.customer.ma_phuong = '';
        this['ma_phuong'] = '';
        this.customer['ten_phuong'] = '';
        this['ten_phuong'] = '';
      }
      if (item.control == 'ma_quan' && this.customer[item.control] != item.value) {
        this.customer.ma_phuong = '';
        this['ma_phuong'] = '';
        this.customer['ten_phuong'] = '';
        this['ten_phuong'] = '';
      }
      this.customer[item.control] = item.value;
      this[item.control] = item.value;
    });
  }
  handleChangeTaxCode() {
    this.commonService.getCustomerInfoByTax(this.customer.ma_so_thue || '').subscribe((result: any) => {
      if (result.success) {
        this.customer.dia_chi = result.result.dia_chi;
        this.customer.ten_kh = result.result.ten_kh;
        this.customer.dien_thoai = result.result.dien_thoai;
      }
      else {
        this.commonService.showMessageByName(result.message);
      }
    });
  }
  handleChangeTaxCodeInvoice() {
    this.commonService.getCustomerInfoByTax(this.customer.hoadon_mst || '').subscribe((result: any) => {
      if (result.success) {
        this.customer.hoadon_diachi = result.result.dia_chi;
        this.customer.hoadon_tenkh = result.result.ten_kh;
      }
      else {
        this.commonService.showMessageByName(result.message);
      }
    });
  }
  checkInvalid(control: string) {
    if (control == 'ma_kh') {
      if (this.customer.ma_kh == '') {
        return true;
      }
    }
    if (control == 'ten_kh') {
      if (this.customer.ten_kh == '') {
        return true;
      }
    }
    return false;
  }
  checkInvalidForm(myObject: any) {
    for (const key in myObject) {
      if (this.checkInvalid(key)) {
        return true;
      }
    }
    return false;
  }
  containsSpecialCharacters(input: string): boolean {
    return /[\s_!@#$%^&*(),.?":{}|<>]/.test(input);
  }
}
