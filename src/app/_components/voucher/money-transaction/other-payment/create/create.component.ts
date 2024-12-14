import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Extend, Receipt, ReceiptDetail } from '../other-payment.model';
import { Button, Grid, GridType } from '@app/_components/gridV2/grid.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService, Payment, StatusVoucher } from '@app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '@app/_components/lookup/customer/customer.service';
import { ShopService } from '@app/_components/lookup/shop/shop.service';
import { DepartmentService } from '@app/_components/lookup/department/department.service';
import { TransactionService } from '@app/_components/lookup/transaction/transaction.service';
import { LevelService } from '@app/_components/lookup/level/level.service';
import { TaxService } from '@app/_components/lookup/tax/tax.service';
import { ExchangeRateService } from '@app/_components/lookup/exchange_rate/exchange_rate.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { getDateFormat, getResource, isFloat } from '@app/_common/commonFunction';
import { PaymentService } from '@app/_components/lookup/payment/payment.service';
import { ItemService } from '@app/_components/lookup/item/item.service';
import { IMEIService } from '@app/_services/imei.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import button from '@app/_common/button';
import { StockService } from '@app/_components/lookup/stock/stock.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { MODE, VOUCHER_TYPE } from '../../../enum/voucher_enum';

import { OtherPaymentDetailService } from './other-payment-detail.service';
import { OtherPaymentService } from '../other-payment.service';
import { BankingService } from '@app/_components/lookup/banking/banking.service';
import { FeeService } from '@app/_components/lookup/Fee/fee.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class OtherPaymentDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Phiếu chi khác';
  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';

  fee: Fee = new Fee;
  ghi_chu = '';
  tien = '';

  data!: Receipt;
  extend: Extend = {};
  statusList: StatusTicket[] = [];
  paymentList: any = [];
  voucherCode = 'PCK';
  submitted = false;
  loading = false;
  disabled = false;
  isDisabled = false;
  readonly = false;
  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';
  [key: string]: any;
  entity = VOUCHER_TYPE.OTHER_PAYMENT.sysid;

  sale_ma_kh = '';
  sale_so_ct = '';
  sale_ngay_ct?: Date;

  override gridType = GridType.GridDetail;
  actionButtons = [button.DeleteButton];
  constructor(
    private formBuilder: FormBuilder,
    public OtherPaymentDetailService: OtherPaymentDetailService,
    private route: ActivatedRoute,
    private router: Router,
    public customerService: CustomerService,
    public departmentService: DepartmentService,
    public transactionService: TransactionService,
    public levelService: LevelService,
    public shopService: ShopService,
    public exchangeRateService: ExchangeRateService,
    public paymentService: PaymentService,
    public stockService: StockService,
    public itemService: ItemService,
    public bankingService: BankingService,
    public taxService: TaxService,
    public feeService: FeeService,
    private authenticateService: AuthenticationService,
    private location: Location,
    private commonService: CommonService,
    private OtherPayment: OtherPaymentService,
    private statusVoucher: StatusVoucher,
    private ticketApiService: TicketApiService,
    private payment: Payment,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    const filterItem = [
      { name: 'status', operator: '=', value: '1' },
      { name: 'nh_phi3', operator: '=', value: 'CHI' }
    ];
    feeService.setItemFilter(filterItem);
    localStorage.setItem('useGridCached', '1');
    super(OtherPaymentDetailService);
    const user = authenticateService.userValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
      this.bankingService.setItemFilter([{ name: 's1', operator: 'like', value: '1' }]);
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
    this.OtherPayment.getItem(stt_rec).subscribe((item => {
      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      item.masterInfo.ngay_lct = item.masterInfo.ngay_lct?.substring(0, 10);
      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        ngay_lct: [this.data.masterInfo.ngay_lct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
        ten_cuahang: [this.ten_cuahang],
        ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
        ma_thanhtoan: [this.data.masterInfo.ma_thanhtoan, Validators.required],
        dia_chi: [this.data.masterInfo.dia_chi],
        dien_giai: [this.data.masterInfo.dien_giai],
        ong_ba: [this.data.masterInfo.ong_ba],
        t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
        t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
        t_thue_nt: [this.data.masterInfo.t_thue_nt, Validators.required],
        detail: [this.data.details || [], Validators.required],
      });
      this.stockService.setItemFilter([{ name: 'ma_cuahang', value: this.data.masterInfo.ma_cuahang }, { name: 'ma_loai', value: 'HM' }]);
      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
      if (this.data.details.length >= 2 && this.data.details[1].data) {
        this.extend = this.data.details[1].data[0];
      }

      this.sale_so_ct = this.data.masterInfo.fcode1!;
      this.sale_ma_kh = this.data.masterInfo.fcode2!;
      this.sale_ngay_ct = this.data.masterInfo.s7;

    }));
  }
  ngOnInit() {
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);

    this.ma_cuahang = userObj['shop'];
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
            this.readonly = true;
            break;
        }
      }
    });
    this.data = {
      masterInfo: {
        dien_giai: '',
        dia_chi: '',
        ong_ba: '',
        stt_rec: '',
        ma_ct: this.voucherCode,
        so_ct: '',
        ngay_ct: getDateFormat(new Date()),
        ngay_lct: getDateFormat(new Date()),
        ma_dvcs: userObj['unit'],
        ma_ca: userObj['shift'],
        ma_cuahang: userObj['shop'],
        status: '0',
        t_tien_nt: 0,
        t_tt_nt: 0,
        t_thue_nt: 0,
      },
      details: [
        {
          id: 1,
          name: 'd551',
          data: []
        },
        {
          id: 2,
          name: 'm551ext',
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
      this.ticketApiService.getVoucherNumber('OPTran').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          ngay_lct: [this.data.masterInfo.ngay_lct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
          ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
          ten_cuahang: [this.ten_cuahang],
          ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
          ma_thanhtoan: [this.data.masterInfo.ma_thanhtoan, Validators.required],
          dia_chi: [this.data.masterInfo.dia_chi],
          dien_giai: [this.data.masterInfo.dien_giai],
          ong_ba: [this.data.masterInfo.ong_ba],
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
      ngay_lct: [this.data.masterInfo.ngay_lct, Validators.required],
      status: [this.data.masterInfo.status, Validators.required],
      ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
      ten_cuahang: [this.ten_cuahang],
      ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
      ma_thanhtoan: [this.data.masterInfo.ma_thanhtoan, Validators.required],
      dia_chi: [this.data.masterInfo.dia_chi],
      dien_giai: [this.data.masterInfo.dien_giai],
      ong_ba: [this.data.masterInfo.ong_ba],
      t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
      t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
      detail: [this.data.details || [], Validators.required],
    });
  }

  get f() {
    return this.voucherForm.controls;
  }

  onSubmit() {
    this.data.details[1].data = [this.extend];
    this.submitted = true;
    this.disabled = true;
    let input_error: any;
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
    let sum_tien_nt = 0;
    this.data.details[0].data.forEach((item) => {
      if (item && item.tien_nt) {
        sum_tien_nt += item.tien_nt;
      }
    });
    if (sum_tien_nt == 0) {
      this.commonService.showMessage("Tiền không hợp lệ");
      return;
    }
    this.loading = true;
    this.isDisabled = true;
    if (this.mode == MODE.UPDATE) {
      this.OtherPayment.update(this.data).subscribe((item: any) => {
        this.loading = false;
        this.disabled = false;
        this.isDisabled = false;
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
      this.isDisabled = true;
      this.OtherPayment.create(this.data).subscribe((item: any) => {
        this.loading = false;
        this.disabled = false;
        this.isDisabled = false;
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
    this.f[controlName].setValue($event);
  }
  handleInputLookupChange($event: any): void {
    $event.forEach((item: any) => {
      if (this[item.control]) {
        this[item.control] = item.value;
      }
      this.data.masterInfo[item.control] = item.value;
      if (this.f[item.control]) {
        this.f[item.control].setValue(item.value);
      }
    });
  }
  handleInputLookupChangeExtend($event: any): void {
    $event.forEach((item: any) => {
      this.extend[item.control] = item.value;
    });
  }

  handleInputLookupChangeFee($event: any): void {
    $event.forEach((item: any) => {
      this.fee[item.control] = item.value;
    });
  }

  handleChangePayment($event: any) {
    this.data.masterInfo.ma_thanhtoan = $event;
    if ($event != 'TM') {
      // this.shopService.getItem(this.ma_cuahang).subscribe((item) => {
      //   this.data.masterInfo.tknh = item.tk_nh_chotca;
      //   this.data.masterInfo.ten_nh = item.tk_nh_chotca;
      // });
    }
    else {
      this.data.masterInfo.tknh = '';
    }
  }

  changeTax($event: any): void {
    $event.forEach((item: any) => {
      this.extend[item.control] = item.value;
    });
    this.calcTax();
    this.calcTotal();
  }
  changePriceExtend($event: any) {
    this.extend.t_tien_nt = $event;
    this.calcTax();
    this.calcTotal();
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
    if (this.data.masterInfo.fcode3 && this.data.masterInfo.fcode3!.trim().toUpperCase() === 'THUONGNONG') {
      return;
    }

    if (this.tien == '' || this.tien == '0') {
      this.commonService.showMessageByName('lblWarningNotValidMoney');
      return;
    }
    this.data.details[0].data.push({
      stt_rec0: '',
      line_nbr: this.data.details[0].data.length + 1,
      tien_nt: Number.parseInt(this.tien),
      tt_nt: Number.parseInt(this.tien),
      dien_giai: this.ghi_chu,
      ma_phi: this.fee.ma_phi,
      ten_phi: this.fee.ten_phi,
      tk_no: this.fee.tk_cp,
    });
    this.calcTotal();
    this.dataSource.data = this.data.details[0].data;
    this.tien = '';
    this.ghi_chu = '';
    this.fee = new Fee;
  }
  changeTaxCode(event: any) {
    this.commonService.getCustomerInfoByTax(event).subscribe((result: any) => {
      if (result.success) {
        this.extend.dia_chi = result.result.dia_chi;
        this.extend.ten_kh = result.result.ten_kh;
      }
      else {
        this.commonService.showMessageByName(result.message);
      }
    });
  }
  calcTotal() {
    let t_tien_nt = 0;
    let t_thue_nt = 0;
    this.data.details[0].data.forEach((item) => {
      t_tien_nt += item.tien_nt || 0;
    });
    t_thue_nt = this.extend.t_thue_nt || 0;
    this.data.masterInfo = { ...this.data.masterInfo, t_tien_nt: t_tien_nt, t_thue_nt: t_thue_nt, t_tt_nt: t_tien_nt + t_thue_nt };
  }
  calcTax() {
    this.extend.t_thue_nt = (this.extend.t_tien_nt || 0) * (this.extend.thue_suat || 0) / 100;
    console.log(this.extend.t_thue_nt);
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }
}


class Fee {
  ma_phi = '';
  ten_phi = '';
  tk_cp = '';
  [key: string]: any
}
