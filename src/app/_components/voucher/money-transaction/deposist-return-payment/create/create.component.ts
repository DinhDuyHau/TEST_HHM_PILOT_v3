import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Receipt, ReceiptDetail } from '../deposist-return-payment.model';
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

import { DeposistReturnReceiptDetailService } from './deposist-return-payment-detail.service';
import { DeposistReturnReceiptService } from '../deposist-return-payment.service';
import { lastValueFrom } from 'rxjs';
import { BankingService } from '@app/_components/lookup/banking/banking.service';
import { OpenSaleProgramService } from '@app/_components/lookup/open_sale_program/open_sale_program.service';
import { DepositReturnPaymentService } from '@app/_components/lookup/deposit_return_payment/deposit_return_payment.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class DeposistReturnReceiptDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;

  voucherForm!: FormGroup;
  title = 'Phiếu chi hoàn cọc';
  userName = '';

  ma_dvcs = '';

  ma_cuahang = '';
  ten_cuahang = '';

  ghi_chu = '';
  tien = '';

  data!: Receipt;
  statusList: StatusTicket[] = [];
  paymentList: any = [];
  voucherCode = 'PCH';
  submitted = false;
  loading = false;
  disabled = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';
  entity = VOUCHER_TYPE.DEPOSIST_RETURN_PAYMENT.sysid;
  [key: string]: any

  override gridType = GridType.GridDetail;
  actionButtons = [button.EditQuantityButton, button.DeleteButton];
  buttonsInput = [{ ...button.ProgramerButton, name: 'Lấy tiền đặt cọc' }];
  constructor(
    private formBuilder: FormBuilder,
    public DeposistReturnReceiptDetailService: DeposistReturnReceiptDetailService,
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
    private authenticateService: AuthenticationService,
    private location: Location,
    private commonService: CommonService,
    private DeposistReturnReceipt: DeposistReturnReceiptService,
    private statusVoucher: StatusVoucher,
    private ticketApiService: TicketApiService,
    private payment: Payment,
    private openSaleService: OpenSaleProgramService,
    private depositReturnPaymentService: DepositReturnPaymentService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    localStorage.setItem('useGridCached', '1');
    super(DeposistReturnReceiptDetailService);
    const user = authenticateService.userValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
      this.ma_dvcs = user.unit || '';
    }
  }
  onHandleActionButton(event: { buttonId: string; data?: any; index: number }) {
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
      case button.EditPriceButton.id:
        this.DeposistReturnReceiptDetailService.openDialogEditPrice({
          label: this.commonService.getMessage('lbl_tien_hoan_coc'), value: event.data.tien_nt
        }).subscribe((res) => {
          if (res) {
            if (res > event.data.tien_nt) {
              this.commonService.showMessageByName('lblWarningInvalidDepositReturn');
              return;
            }
            const item = this.data.details[0].data[event.index];
            item.tien_nt = res;
            item.tt_nt = item.tien_nt;
            this.calcTotal();
          }
        });
        break;
      default:
        break;
    }
  }
  onClickButtonInput(id: string) {
    const temp = 0;
    switch (id) {
      case button.ProgramerButton.id:
        if (!this.data.masterInfo.ma_kh) {
          this.commonService.showMessageByName('lblWarningNotValidCustomer');
          return;
        }
        this.DeposistReturnReceiptDetailService.openLookup(this.depositReturnPaymentService, true).subscribe((res) => {
          if (res && res.length > 0) {
            const temp = res.filter((item: any) => {
              return !this.data.details[0].data.find((detail: any) => item.ma_vt == detail.ma_vt && item.ma_ctr == detail.ma_ctr);
            });
            let index = this.data.details[0].data.length;
            this.data.details[0].data = this.data.details[0].data.concat(temp.map((item: any) => {
              index++;
              return {
                stt_rec0: '',
                line_nbr: index,
                ma_vt: item.ma_vt,
                ten_vt: item.ten_vt,
                tien_coc: item.tien_coc,
                so_luong: 1,
                stt_rec_tt: item.stt_rec,
                tien_nt: item.tien_nt,
                t_tt_nt: item.t_tt_nt,
                da_tt_nt: item.da_tt_nt,
                cl_nt: item.cl_nt,
                tt_nt: item.tien_nt,
                ngay_tra: item.ngay_tra,
                ma_ctr: item.ma_ctr,
                ten_ctr: item.ten_ctr
              };
            }));
            this.dataSource.data = this.data.details[0].data;
            this.calcTotal();
          }
        });
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
    this.DeposistReturnReceipt.getItem(stt_rec).subscribe((item => {
      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
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
      this.stockService.setItemFilter([{ name: 'ma_cuahang', value: this.data.masterInfo.ma_cuahang }, { name: 'ma_loai', value: 'HM' }]);
      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
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
        ma_dvcs: userObj['unit'],
        ma_ca: userObj['shift'],
        ma_cuahang: userObj['shop'],
        status: '0',
        t_tien_nt: 0,
        t_tt_nt: 0
      },
      details: [
        {
          id: 1,
          name: 'd555',
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
      this.ticketApiService.getVoucherNumber('CDTran_PCH').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
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
    console.log(this.voucherForm);
    this.submitted = true;
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
      this.commonService.showMessage("Tiền hoàn cọc không hợp lệ");
      return;
    }
    this.loading = true;
    if (this.mode == MODE.UPDATE) {
      this.DeposistReturnReceipt.update(this.data).subscribe((item: any) => {
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
      this.DeposistReturnReceipt.create(this.data).subscribe((item: any) => {
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
    this.f[controlName].setValue($event);
  }
  handleInputLookupChange($event: any): void {
    $event.forEach((item: any) => {
      this[item.control] = item.value;
      this.data.masterInfo[item.control] = item.value;
      if (this.f[item.control]) {
        this.f[item.control].setValue(item.value);
      }
      if (item.control == 'ma_kh') {
        this.depositReturnPaymentService.setItemFilter([{ name: item.control, operator: '=', value: item.value }, { name: 'ma_dvcs', operator: '=', value: this.ma_dvcs }, { name: 'ngay_ct', operator: '=', value: this.data.masterInfo.ngay_ct }]);
      }
    });
  }

  handleChangePayment($event: any) {
    this.data.masterInfo.ma_thanhtoan = $event;
    if ($event != 'TM') {
      // this.shopService.getItem(this.ma_cuahang).subscribe((item) => {
      //   this.data.masterInfo.tknh = item.tk_nh_chotca;
      // });
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
}