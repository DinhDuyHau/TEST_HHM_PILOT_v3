import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Receipt, ReceiptDetail } from '../other-money-transfer.model';
import { Button, Grid, GridType } from '@app/_components/gridV2/grid.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService, Payment, StatusVoucher } from '@app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '@app/_components/lookup/customer/customer.service';
import { ShopService } from '@app/_components/lookup/shop/shop.service';
import { DepartmentService } from '@app/_components/lookup/department/department.service';
import { TransactionService } from '@app/_components/lookup/transaction/transaction.service';
import { LevelService } from '@app/_components/lookup/level/level.service';
import { ExchangeRateService } from '@app/_components/lookup/exchange_rate/exchange_rate.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { PaymentService } from '@app/_components/lookup/payment/payment.service';
import { ItemService } from '@app/_components/lookup/item/item.service';
import button from '@app/_common/button';
import { StockService } from '@app/_components/lookup/stock/stock.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { MODE, VOUCHER_TYPE } from '../../../enum/voucher_enum';

import { OtherMoneyTransferDetailService } from './other-money-transfer-detail.service';
import { OtherMoneyTransferService } from '../other-money-transfer.service';
import { BankingService } from '@app/_components/lookup/banking/banking.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { getDateFormat } from '@app/_common/commonFunction';
import { EmployeeService } from '@app/_components/lookup/employee/employee.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class OtherMoneyTransferDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Phiếu chốt ca';
  userName = '';

  ma_ca = '';
  ten_ca = '';

  ma_ca_nhan = '02';
  ten_ca_nhan = 'Ca tối';

  ma_cuahang = '';
  ten_cuahang = '';

  ghi_chu = '';
  tien = '';

  shift = ''

  data!: Receipt;
  statusList: StatusTicket[] = [];

  shiftList: any = [];
  paymentList: any = [];
  bankAccountList: any = [];

  voucherCode = 'PCF';
  submitted = false;
  loading = false;
  disabled = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';

  [key: string]: any;
  entity = VOUCHER_TYPE.OTHER_MONEY_TRANSFER.sysid;

  override gridType = GridType.GridDetail;
  actionButtons = [button.DeleteButton];
  constructor(
    private formBuilder: FormBuilder,
    public OtherMoneyTransferDetailService: OtherMoneyTransferDetailService,
    private route: ActivatedRoute,
    private router: Router,
    // public customerService: CustomerService,
    public employeeService: EmployeeService,
    public departmentService: DepartmentService,
    public transactionService: TransactionService,
    public levelService: LevelService,
    public shopService: ShopService,
    public exchangeRateService: ExchangeRateService,
    public paymentService: PaymentService,
    public stockService: StockService,
    public itemService: ItemService,
    public bankingService: BankingService,
    private authenticateService: AuthenticationService,
    private location: Location,
    private commonService: CommonService,
    private OtherMoneyTransfer: OtherMoneyTransferService,
    private statusVoucher: StatusVoucher,
    private payment: Payment,
    private ticketApiService: TicketApiService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    localStorage.setItem('useGridCached', '1');
    super(OtherMoneyTransferDetailService);
    const user = this.authenticateService.userValue;
    const shiftList = this.authenticateService.shiftValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
      if (shiftList !== null) {
        const shift = shiftList.find(x => x.ma_ca == user.shift);
        this.ma_ca = shift?.ma_ca || '';
        this.ten_ca = shift?.ten_ca || '';
      }
      this.ma_cuahang = user.shop;
      //this.bankingService.setItemFilter([{ name: 'ma_cuahang', operator: '=', value: this.ma_cuahang }]);
    }
  }
  onHandleActionButton(event: { buttonId: string; data?: any; }) {
    switch (event.buttonId) {
      case button.DeleteButton.id:
        this.data.details[0].data = this.data.details[0].data.filter((item) => {
          return item.line_nbr != event.data[0].value;
        });
        this.data.details[0].data = this.data.details[0].data.map((item, index) => {
          return { ...item, line_nbr: index + 1 };
        });
        this.calcTotal();
        this.dataSource.data = this.data.details[0].data;
        break;
      default:
        break;
    }
  }
  ngAfterViewInit(): void {
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly])');
    inputs[0].focus();
  }
  initData(stt_rec: string) {
    this.OtherMoneyTransfer.getItem(stt_rec).subscribe((item => {
      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      this.tien = item.masterInfo.t_tien_nt + '';
      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        ma_thanhtoan: [this.data.masterInfo.ma_thanhtoan, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
        ten_cuahang: [this.ten_cuahang],
        ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
        dia_chi: [this.data.masterInfo.dia_chi],
        dien_giai: [this.data.masterInfo.dien_giai],
        ong_ba: [this.data.masterInfo.ong_ba],
        tien: [this.tien, Validators.required],
        t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
        t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
        detail: [this.data.details || [], Validators.required],
      });
      this.stockService.setItemFilter([{ name: 'ma_cuahang', value: this.data.masterInfo.ma_cuahang }, { name: 'ma_loai', value: 'HM' }]);
      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
    }));
  }
  ngOnInit() {
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    this.shift = userObj.shift;

    this.route.url.subscribe(urlSegment => {
      const path = urlSegment[0].path;
      if (urlSegment[0].path) {
        switch (path) {
          case 'create':
            this.title = this.commonService.getMessage('titleCreate');
            this.mode = MODE.CREATE;
            this.submitButtonTitle = this.commonService.getMessage('btnSubmitAdd');
            this.cancelButtonTitle = this.commonService.getMessage('btnCancelAdd');
            break;
          case 'update':
            this.title = this.commonService.getMessage('titleEdit');
            this.mode = MODE.UPDATE;
            this.submitButtonTitle = this.commonService.getMessage('btnSubmitEdit');
            this.cancelButtonTitle = this.commonService.getMessage('btnCancelEdit');
            break;
          case 'view':
            this.title = this.commonService.getMessage('titleView');
            this.disabled = true;
            this.mode = MODE.VIEW;
            this.cancelButtonTitle = this.commonService.getMessage('btnCancelView');
            break;
        }
      }
    });
    this.data = {
      masterInfo: {
        dien_giai: `Chốt ca ${this.ma_ca} - ${this.ten_ca} tại cửa hàng ${this.ma_cuahang}`,
        dia_chi: '',
        ong_ba: '',
        stt_rec: '',
        ma_ct: this.voucherCode,
        so_ct: '',
        ma_kh: '',
        ngay_ct: getDateFormat(new Date()),
        ma_dvcs: userObj['unit'],
        ma_ca: userObj['shift'],
        ma_cuahang: userObj['shop'],
        status: '0',
        ma_thanhtoan: '',
        t_tien_nt: 0,
        t_tt_nt: 0
      },
      details: [
        {
          id: 1,
          name: 'd554',
          data: []
        }
      ]
    };
    if (this.mode == MODE.CREATE) {
      this.statusVoucher.getStatus(this.voucherCode).subscribe(result => {
        this.statusList = result;
        if (!this.data.masterInfo.status) {
          this.data.masterInfo.status = this.statusList[0].status;
          if (this.f) {
            this.f['status'].setValue(this.data.masterInfo.status);
          }
        }
      });
      this.payment.getPayment().subscribe(result => {
        this.paymentList = result;
        if (!this.data.masterInfo.ma_thanhtoan) {
          this.data.masterInfo.ma_thanhtoan = this.paymentList[0].ma_thanhtoan;
          if (this.f) {
            this.f['ma_thanhtoan'].setValue(this.data.masterInfo.ma_thanhtoan);
          }
        }
      });
      this.shiftList = this.authenticateService.shiftValue//?.map(item => item.ten_ca)

      // this.employeeService.getEmployeeByUser(this.userName, this.ma_cuahang).subscribe((res: any) => {
      //   this.data.masterInfo.ma_kh = res.ma_nvbh;
      //   this.data.masterInfo['ten_kh'] = res.ten_nvbh;
      //   this.data.masterInfo['dia_chi'] = res.dia_chi;
      //   if (this.f) {
      //     this.f['ma_kh'].setValue(this.data.masterInfo.ma_kh);
      //     this.f['dia_chi'].setValue(this.data.masterInfo.dia_chi);
      //   }
      // });
      this.ticketApiService.getEmployeeByUsername(this.userName, this.ma_cuahang).subscribe((res: any) => {
        if (!res) return;
        if (res.success) {
          const employee = res.result;
          this.data.masterInfo.ma_kh = employee.ma_nvbh;
          this.data.masterInfo['ten_kh'] = employee.ten_nvbh;
          this.data.masterInfo['dia_chi'] = employee.dia_chi;
          if (this.f) {
            this.f['ma_kh'].setValue(this.data.masterInfo.ma_kh);
            this.f['dia_chi'].setValue(this.data.masterInfo.dia_chi);
          }
        }
        else if (res.message && res.message !== '') {
          this.commonService.showMessageByName(res.message);
        }
      });
      this.ticketApiService.getVoucherNumber('CDTran_PCF').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
          ma_thanhtoan: [this.data.masterInfo.ma_thanhtoan, Validators.required],
          ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
          ten_cuahang: [this.ten_cuahang],
          ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
          dia_chi: [this.data.masterInfo.dia_chi],
          dien_giai: [this.data.masterInfo.dien_giai],
          ong_ba: [this.data.masterInfo.ong_ba],
          tien: [this.tien],
          t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
          t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
          detail: [this.data.details || [], Validators.required],
        });
      });
    }
    else {
      this.transactionService.setItemFilter([{ name: 'ma_ct', value: this.voucherCode }]);
      this.levelService.setItemFilter([{ name: 'ma_ct', value: this.voucherCode }]);
      this.route.queryParams.subscribe((params: any) => {
        if (params['key']) {
          this.initData(params['key']);
          this.statusVoucher.getStatus(this.voucherCode).subscribe(result => {
            this.statusList = result;
            if (!this.data.masterInfo.status) {
              this.data.masterInfo.status = this.statusList[0].status;
              if (this.f) {
                this.f['status'].setValue(this.data.masterInfo.status);
              }
            }
          });
          this.payment.getPayment().subscribe(result => {
            this.paymentList = result;
            if (!this.data.masterInfo.ma_thanhtoan) {
              this.data.masterInfo.ma_thanhtoan = this.paymentList[0].ma_thanhtoan;
              if (this.f) {
                this.f['ma_thanhtoan'].setValue(this.data.masterInfo.ma_thanhtoan);
              }
            }
          });
        }
      });
    }
    this.voucherForm = this.formBuilder.group({
      so_ct: [this.data.masterInfo.so_ct, Validators.required],
      ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
      status: [this.data.masterInfo.status, Validators.required],
      ma_thanhtoan: [this.data.masterInfo.ma_thanhtoan, Validators.required],
      ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
      ten_cuahang: [this.ten_cuahang],
      ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
      dia_chi: [this.data.masterInfo.dia_chi],
      dien_giai: [this.data.masterInfo.dien_giai],
      ong_ba: [this.data.masterInfo.ong_ba],
      tien: [this.tien, Validators.required],
      t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
      t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
      detail: [this.data.details || [], Validators.required],
    });
  }

  get f() {
    return this.voucherForm.controls;
  }

  onSubmit() {
    this.data.masterInfo.fcode2 = this.ma_ca_nhan;
    this.data.masterInfo.t_tien_nt = Number.parseInt(this.tien || '0');
    this.data.masterInfo.t_tt_nt = Number.parseInt(this.tien || '0');
    this.data.details[0].data = [{ ...this.data.details[0].data, line_nbr: 1, dien_giai: this.data.masterInfo.dien_giai, tien_nt: Number.parseInt(this.tien || '0'), tt_nt: Number.parseInt(this.tien || '0') }];
    this.f['detail'].setValue(this.data.details[0].data);
    this.submitted = true;
    let input_error: any;

    //Xử lý convert ngày chứng từ từ định dạng dd/MM/yyyy
    if (this.data.masterInfo.ngay_ct!.indexOf('/') >= 0) {
      const arr_date = this.data.masterInfo.ngay_ct!.split('/');
      if (arr_date && arr_date.length === 3) {
        this.data.masterInfo.ngay_ct = arr_date[2] + '-' + arr_date[1] + '-' + arr_date[0];
      }
    }

    if (this.shift == '02') {
      this.commonService.showMessage('Ca đăng nhập không hợp lệ');
      return;
    }
    if (this.voucherForm.invalid) {
      Object.keys(this.voucherForm.controls).forEach(key => {
        const control = this.voucherForm.get(key);
        if (control && control.errors) {
          // Xử lý khi control bị lỗi
          const element = this.form.nativeElement.querySelector(`#${key}`); // hoặc sử dụng CSS selector: document.querySelector(`#${key}`)
          if (element && !input_error) {
            input_error = element;
          }
        }
      });
      // const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly])');
      // inputs[0].focus();
      if (input_error) {
        this.renderer.selectRootElement(input_error).focus();
      }

      this.commonService.showMessageByName('lblWarningLackInformation');
      return;
    }

    if (this.data.details.length == 0 || this.data.details[0].data.length == 0) {
      this.commonService.showMessageByName('lblWarningLackDetail');
      return;
    }
    if (this.data.details.length == 0 || this.data.details[0].data.length == 0) {
      this.commonService.showMessageByName('lblWarningLackDetail');
      return;
    }
    if (this.data.masterInfo.t_tien_nt == 0) {
      this.commonService.showMessage("Tiền không hợp lệ");
      return;
    }

    this.loading = true;
    if (this.mode == MODE.UPDATE) {
      this.OtherMoneyTransfer.update(this.data).subscribe((item: any) => {
        this.loading = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'edit_success');
        }
        else {
          this.commonService.showMessageByName(item.message ? item.message : 'edit_error');
        }
      });
    }
    else if (this.mode == MODE.CREATE) {
      this.OtherMoneyTransfer.create(this.data).subscribe((item: any) => {
        this.loading = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'add_success');
        }
        else {
          this.commonService.showMessageByName(item.message ? item.message : 'add_error');
        }
      });
    }
  }
  handleInputChange(controlName: string, $event: any): void {
    if (typeof $event !== 'string') {
      $event = $event.target.value;
    }
    this.data.masterInfo[controlName] = $event;
    if (this.f && this.f[controlName]) {
      this.f[controlName].setValue($event);
    }
  }
  handleInputLookupChange($event: any): void {
    $event.forEach((item: any) => {
      this[item.control] = item.value;
      this.data.masterInfo[item.control] = item.value;
      if (this.f[item.control]) {
        this.f[item.control].setValue(item.value);
      }
    });
  }

  handleChangePayment($event: any) {
    this.data.masterInfo.ma_thanhtoan = $event;
    if ($event != 'TM') {
      this.shopService.getItem(this.ma_cuahang).subscribe((item) => {
        this.bankingService.getItem(item.tk_nh_chotca).subscribe(item => {
          this.data.masterInfo.tknh = item.tknh;
          this.data.masterInfo.ten_nh = item.ten_nh;
        });
      });
    }
    else {
      this.data.masterInfo.tknh = '';
    }
  }
  onDelete() {
    console.log('onDelete');
  }

  onCancel() {
    this.location.back();
  }
  onEnter(event: any) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    const form = this.el.nativeElement.closest('form');
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly])');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === event.target) {
        if (i < inputs.length - 1) {
          inputs[i + 1].focus(); // Focus vào phần tử tiếp theo
          break;
        }
        else {
          this.btnSubmit.nativeElement.focus();
        }
      }
    }
  }
  onEnterItem() {
    if (this.tien == '' || this.tien == '0') {
      this.commonService.showMessageByName('lblWarningNotValidMoney');
      return;
    }
    this.data.details[0].data.push({
      stt_rec0: '',
      line_nbr: this.data.details[0].data.length + 1,
      tien_nt: Number.parseInt(this.tien),
      tt_nt: Number.parseInt(this.tien),
      dien_giai: this.ghi_chu
    });
    this.calcTotal();
    this.dataSource.data = this.data.details[0].data;
    this.tien = '';
    this.ghi_chu = '';
  }
  calcTotal() {
    let t_tien_nt = 0;
    this.data.details[0].data.forEach((item) => {
      t_tien_nt += item.tien_nt || 0;
    });
    this.data.masterInfo = { ...this.data.masterInfo, t_tien_nt: t_tien_nt, t_tt_nt: t_tien_nt };
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onBlurVoucherDate(event: any, ref: any) {
    this.f['ngay_ct'].setValue(ref.isoDateString.toString());
    this.data.masterInfo.ngay_ct = ref.isoDateString.toString();
  }

  onKeyupEnter(event: any, next_control: any) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      if (next_control)
        if (next_control.input)
          next_control.input.nativeElement.focus();
        else
          next_control.focus();
    }

  }

}