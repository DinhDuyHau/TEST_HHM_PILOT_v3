import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Receipt, ReceiptDetail } from '../deposist-receipt.model';
import { Button, Grid, GridType } from '@app/_components/gridV2/grid.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService, StatusVoucher } from '@app/_services';
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

import { DeposistReceiptDetailService } from './deposist-receipt-detail.service';
import { DeposistReceiptService } from '../deposist-receipt.service';
import { lastValueFrom } from 'rxjs';
import { BankingService } from '@app/_components/lookup/banking/banking.service';
import { OpenSaleProgramService } from '@app/_components/lookup/open_sale_program/open_sale_program.service';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { PaymentService as PaymentServiceShop } from '@app/sales-management/page/common/payment.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { CustomerCreateDialogComponent } from '@app/sales-management/component/customer/customer-create-dialog/customer-create-dialog.component';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class DeposistReceiptDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;

  voucherForm!: FormGroup;
  title = 'Phiếu thu tiền cọc';
  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';

  ghi_chu = '';
  tien = '';

  data!: Receipt;
  statusList: StatusTicket[] = [];
  voucherCode = 'PTC';
  submitted = false;
  loading = false;
  disabled = false;
  invalid = false;
  isDisabled = false;
  readonly = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';
  payment: Payment = new Payment;
  entity = VOUCHER_TYPE.DEPOSIST_RECEIPT.sysid;
  [key: string]: any;

  override gridType = GridType.GridDetail;
  actionButtons = [button.EditQuantityButton, button.DeleteButton];
  buttonsInput = [button.ProgramerButton];

  tran_type: any[] = [
    { ma_loai: '1', ten_loai: '1 - Đặt cọc theo chương trình' },
    { ma_loai: '2', ten_loai: '2 - Khách hàng ứng trước tiền' }
  ];
  ma_vt_coc = '';
  ten_vt_coc = '';
  tien_dat_coc = 0;

  action = '';
  shop = '';

  constructor(
    private formBuilder: FormBuilder,
    public DeposistReceiptDetailService: DeposistReceiptDetailService,
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
    private DeposistReceipt: DeposistReceiptService,
    private statusVoucher: StatusVoucher,
    private ticketApiService: TicketApiService,
    private openSaleService: OpenSaleProgramService,
    private paymentServiceShop: PaymentServiceShop,
    private el: ElementRef,
    private renderer: Renderer2,
    private customerApiService: CustomerApiService
  ) {
    localStorage.setItem('useGridCached', '1');
    super(DeposistReceiptDetailService);
    const user = authenticateService.userValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
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
        this.DeposistReceiptDetailService.openDialogEditPrice({
          label: this.commonService.showMessageByName('lbl_so_luong'), value: event.data.so_luong
        }).subscribe((res) => {
          if (res) {
            if (res < 1) {
              this.commonService.showMessageByName('lblWarningInvalidDeposit');
              return;
            }
            const item = this.data.details[0].data[event.index];
            item.so_luong = res;
            item.tien_nt = item.so_luong * item.tien_coc;
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
      // case button.ProgramerButton.id:
      //   this.getDeposistProduct();
      //   break;
      default:
        break;
    }
  }

  getDeposistProduct() {
    this.DeposistReceiptDetailService.openLookup(this.openSaleService, true).subscribe((res) => {
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
            tien_nt: item.tien_coc,
            tt_nt: item.tien_coc,
            ngay_tra: item.ngay_tra,
            ma_ctr: item.ma_ctr,
            ten_ctr: item.ten_ctr
          };
        }));
        this.dataSource.data = this.data.details[0].data;
        this.calcTotal();
      }
    });
  }

  ngAfterViewInit(): void {
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly])');
    inputs[0].focus();
  }
  initData(stt_rec: string) {
    this.DeposistReceipt.getItem(stt_rec).subscribe((item => {
      // set cửa hàng để truyền sang payment tab
      this.shop = item.masterInfo.ma_cuahang ?? '';

      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        fnote3: [this.data.masterInfo.fnote3, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
        ten_cuahang: [this.ten_cuahang],
        ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
        dia_chi: [this.data.masterInfo.dia_chi],
        dien_giai: [this.data.masterInfo.dien_giai],
        ong_ba: [this.data.masterInfo.ong_ba],
        t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
        t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
        detail: [this.data.details || [], Validators.required],
      });
      this.stockService.setItemFilter([{ name: 'ma_cuahang', value: this.data.masterInfo.ma_cuahang }, { name: 'ma_loai', value: 'HM' }]);
      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
      this.paymentServiceShop.convertPaymentFromVoucher(this.data.details[1].data, this.payment);
    }));
  }
  ngOnInit() {
    // check quyền truy cập
    this.commonService.processAuthorization();

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
            this.action = 'create';
            break;
          case 'update':
            this.title = this.commonService.getMessage('titleEdit');
            this.mode = MODE.UPDATE;
            this.submitButtonTitle = this.commonService.getMessage('btnSubmitEdit');
            this.cancelButtonTitle = this.commonService.getMessage('btnCancelEdit');
            this.action = 'update';
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
        ma_dvcs: userObj['unit'],
        ma_ca: userObj['shift'],
        ma_cuahang: userObj['shop'],
        status: '0',
        t_tien_nt: 0,
        t_tt_nt: 0,
        //set loại giao dịch mặc định
        fnote3: '1'
      },
      details: [
        {
          id: 1,
          name: 'd545',
          data: []
        },
        {
          id: 2,
          name: 'd545tt',
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

      this.ticketApiService.getVoucherNumber('PTCTran').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
          fnote3: [this.data.masterInfo.fnote3, Validators.required],
          ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
          ten_cuahang: [this.ten_cuahang],
          ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
          dia_chi: [this.data.masterInfo.dia_chi],
          dien_giai: [this.data.masterInfo.dien_giai],
          ong_ba: [this.data.masterInfo.ong_ba],
          t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
          t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
          detail: [this.data.details || [], Validators.required],
        });
      });
      this.ticketApiService.getVoucherDate().subscribe(result => {
        this.data.masterInfo.ngay_ct = result?.result as any || Date();
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
        }
      });
    }
    this.voucherForm = this.formBuilder.group({
      so_ct: [this.data.masterInfo.so_ct, Validators.required],
      ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
      status: [this.data.masterInfo.status, Validators.required],
      fnote3: [this.data.masterInfo.fnote3, Validators.required],
      ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
      ten_cuahang: [this.ten_cuahang],
      ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
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
    // Check âm tiền nợ
    if (this.data.masterInfo.t_con_no !== undefined && this.data.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

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
    if (this.data.masterInfo.t_da_tra == 0) {
      this.commonService.showMessage("Cần chọn hình thức thanh toán trước khi lưu phiếu");
      return;
    }
    if (this.data.masterInfo.t_con_no != 0) {
      this.commonService.showMessageByName('lblWarningInvalidMoneyOwed');
      return;
    }
    this.loading = true;
    this.isDisabled = true;
    if (this.mode == MODE.UPDATE) {
      if (this.data.details.length > 1) {
        this.data.details[1].data = this.paymentServiceShop.convertPaymentToRequest(this.payment, this.data.masterInfo);
      }
      else {
        this.data.details.push({ id: 2, name: 'd545tt', data: this.paymentServiceShop.convertPaymentToRequest(this.payment, this.data.masterInfo) });
      }
      this.DeposistReceipt.update(this.data).subscribe((item: any) => {
        this.loading = false;
        this.isDisabled = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'edit_success');
        }
        else {
          this.commonService.handleResponseErrorVoucher(item, 'voucher/deposist-receipt');
        }
      });
    }
    else if (this.mode == MODE.CREATE) {
      this.isDisabled = true;
      this.data.details[1].data = this.paymentServiceShop.convertPaymentToRequest(this.payment, this.data.masterInfo);
      this.DeposistReceipt.create(this.data).subscribe((item: any) => {
        this.loading = false;
        this.isDisabled = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'add_success');
        }
        else {
          this.commonService.handleResponseErrorVoucher(item, 'voucher/deposist-receipt');
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
    });
  }
  onDelete() {
    console.log('onDelete');
  }

  onCancel() {
    this.router.navigate(['voucher/deposist-receipt']);
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
    this.data.masterInfo = { ...this.data.masterInfo, t_tien_nt: t_tien_nt, t_tt_nt: t_tien_nt, t_tien: t_tien_nt, t_tt: t_tien_nt };
    this.data.masterInfo.t_con_no = this.data.masterInfo.t_tt_nt! - this.data.masterInfo.t_da_tra!;
  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  addDeposistType02(ma_vt: string, ten_vt: string, tien_coc: number) {
    const line = this.dataSource.data.length + 1;
    const new_data: any = {
      stt_rec0: '',
      line_nbr: line,
      ma_vt: ma_vt,
      ten_vt: ten_vt,
      tien_coc: tien_coc,
      so_luong: 1,
      tien_nt: tien_coc,
      tt_nt: tien_coc,
      ngay_tra: null,
      ma_ctr: '',
      ten_ctr: ''
    };
    if (this.data.masterInfo.fnote3 == "2" && line < 2) {
      this.data.details[0].data.push(new_data);
    } else {
      this.commonService.showMessageByName('item_exceeds_limit')
    }

    this.dataSource.data = this.data.details[0].data;
    this.calcTotal();

    //reset
    this.ma_vt_coc = '';
    this.ten_vt_coc = '';
    this.tien_dat_coc = 0;
  }

  onEnterCustomerCode(event: any, ma_kh: string) {
    event.preventDefault();

    //kiểm tra nếu không tồn tại khách hàng theo value input => hiên thị popup thêm khách hàng
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (!(result.success && result.result)) {
        this.openAddCustomerDialog(ma_kh);
      }
    });
  }

  // click button thêm khách hàng
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && ((customer: Customer) => {
          this.f['ma_kh'].setValue(customer.ma_kh);
          this.f['ten_kh'].setValue(customer.ten_kh);
          this.f['dia_chi'].setValue(customer.dia_chi);

        });
      });
  }
  //#endregion

}
