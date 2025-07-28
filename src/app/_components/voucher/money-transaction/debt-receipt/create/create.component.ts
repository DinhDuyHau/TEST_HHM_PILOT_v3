import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Receipt, ReceiptDetail } from '../debt-receipt.model';
import { Button, Grid, GridType } from '@app/_components/gridV2/grid.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService, StatusVoucher } from '@app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '@app/_components/lookup/customer/customer.service';
import { CustomerService as CustomerDebtService } from '@app/_services';
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

import { DebtReceiptDetailService } from './debt-receipt-detail.service';
import { DebtReceiptService } from '../debt-receipt.service';
import { lastValueFrom } from 'rxjs';
import { BankingService } from '@app/_components/lookup/banking/banking.service';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { PaymentService as PaymentServiceShop } from '@app/sales-management/page/common/payment.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { CustomerCreateDialogComponent } from '@app/sales-management/component/customer/customer-create-dialog/customer-create-dialog.component';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { DebtListComponent } from './debt-list/debt-list.component';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class DebtReceiptDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Phiếu thu công nợ';

  buttonsInput = [button.DebtButton];
  buttonsAfterPayment = [button.AllotmentButton];

  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';

  ghi_chu = '';
  tien = '';

  data!: Receipt;
  statusList: StatusTicket[] = [];
  voucherCode = 'PTN';
  submitted = false;
  loading = false;
  disabled = false;
  isDisabled = false;
  readonly = false;
  invalid = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';
  payment: Payment = new Payment;
  [key: string]: any;
  entity = VOUCHER_TYPE.DEBT_RECEIPT.sysid;

  action = '';
  shop = '';

  override gridType = GridType.GridDetail;
  actionButtons = [button.EditPriceButton, button.DeleteGridButton];
  constructor(
    private formBuilder: FormBuilder,
    public DebtReceiptDetailService: DebtReceiptDetailService,
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
    private DebtReceipt: DebtReceiptService,
    private statusVoucher: StatusVoucher,
    private ticketApiService: TicketApiService,
    private customerServiceDebt: CustomerDebtService,
    private paymentServiceShop: PaymentServiceShop,
    private el: ElementRef,
    private renderer: Renderer2,
    private customerApiService: CustomerApiService
  ) {
    localStorage.setItem('useGridCached', '1');
    super(DebtReceiptDetailService);
    const user = authenticateService.userValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
    }
  }
  onHandleActionButton(event: { buttonId: string; data?: any; index: number }) {
    switch (event.buttonId) {
      case button.DeleteGridButton.id:
        this.data.details[0].data.splice(event.index, 1);
        this.data.details[0].data = this.data.details[0].data.map((item, index) => {
          return { ...item, line_nbr: index + 1 };
        });
        this.calcTotal();
        this.dataSource.data = this.data.details[0].data;
        break;
      case button.EditPriceButton.id:
        this.DebtReceiptDetailService.openDialogEditPrice({
          label: this.commonService.getMessage('lbl_tien'), value: event.data.tien_nt
        }).subscribe((res) => {
          if (res) {
            const item = this.data.details[0].data[event.index];
            const tien_nt_old = item.tien_nt == undefined ? 0 : item.tien_nt;
            const tien_nt_new = res;
            if ((item.tien_cl == undefined ? 0 : item.tien_cl) < tien_nt_new) {
              this.commonService.showMessageByName('lblWarningMoneyNotEnough');
              return;
            }

            item.tien_nt = tien_nt_new;
            item.tt_nt = tien_nt_new;
            item.con_lai = (item.tien_cl == undefined ? 0 : item.tien_cl) - (item.tt_nt == undefined ? 0 : item.tt_nt);
            this.data.masterInfo.s4 = (this.data.masterInfo.s4 == undefined ? 0 : this.data.masterInfo.s4) - tien_nt_old + tien_nt_new;
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
      case button.DebtButton.id:
        if (!this.data.masterInfo.ma_kh) {
          this.commonService.showMessageByName('lblWarningNotValidCustomer');
          return;
        }
        const ngay_ct = this.data.masterInfo.ngay_ct ? new Date(this.data.masterInfo.ngay_ct) : new Date();
        this.customerServiceDebt.getPaymentDebit(this.data.masterInfo.ma_kh || '', this.data.masterInfo.ma_dvcs, ngay_ct).subscribe((res: any) => {
          if (res.success) {
            if (res.result && res.result.length == 0) {
              this.commonService.showMessageByName('lblWarningNotDept');
              return;
            }
            let index = 0;
            this.data.details[0].data = [];
            res.result.forEach((item: any) => {
              index += 1;
              this.data.details[0].data.push({
                stt_rec0: '',
                ma_cuahang: item.ma_cuahang,
                line_nbr: index,
                stt_rec_tt: item.stt_rec,
                so_hd_tt: item.so_ct,
                // ngay_hd_tt: formatDate(item.ngay_ct, 'yyyy/MM/dd', 'en_US'),
                ngay_hd_tt: item.ngay_ct,
                tien_hd: item.t_tt_nt,
                da_tt: item.da_tt_nt,
                tien_cl: item.cl_nt,
                tien_nt: 0,
                tt_nt: 0,
                con_lai: item.cl_nt,
                dien_giai: item.dien_giai,
                ma_td3: item.ma_cuahang
              });
            });
            console.log(this.data.details[0].data)
            this.openDialogDebtList(this.data.details[0].data);

          } else {
            this.commonService.showMessageByName('lblWarningNotGetDept');
          }
        });
        break;
      case button.AllotmentButton.id:
        this.AllotmentPrice();
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
    this.DebtReceipt.getItem(stt_rec).subscribe((item => {
      // set cửa hàng để truyền sang payment tab
      this.shop = item.masterInfo.ma_cuahang ?? '';

      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
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
      this.getStatusList();
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
        s4: 0,
        s5: 0
      },
      details: [
        {
          id: 1,
          name: 'd542',
          data: []
        },
        {
          id: 2,
          name: 'd542tt',
          data: []
        }
      ]
    };
    if (this.mode == MODE.CREATE) {
      this.statusVoucher.getStatus(this.voucherCode).subscribe(result => {
        // Loại bỏ trạng thái '1' khỏi list
        this.statusList = result?.filter(x => x?.status !== '1');
        if (!this.data.masterInfo.status) {
          this.data.masterInfo.status = this.statusList[0]?.status;
          if (this.f) {
            this.f['status'].setValue(this.data.masterInfo.status);
          }
        }
      });
      this.ticketApiService.getVoucherNumber('DRTran').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
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
      dia_chi: [this.data.masterInfo.dia_chi],
      dien_giai: [this.data.masterInfo.dien_giai],
      ong_ba: [this.data.masterInfo.ong_ba],
      t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
      t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
      detail: [this.data.details || [], Validators.required],
    });
  }

  getStatusList = () => {
    this.statusVoucher.getStatus(this.voucherCode).subscribe(result => {
      this.statusList = result;

      const currentStatus = this.data.masterInfo.status;

      if (currentStatus === '1') {
        // Nếu đang là "Chờ thanh toán" thì không cho người dùng chọn lại "Lập chứng từ"
        this.statusList = this.statusList.filter(x => x.status !== '0');
      } else if (currentStatus === '0') {
        // Nếu đang là "Lập chứng từ" thì không cho người dùng chọn "Chờ thanh toán"
        this.statusList = this.statusList.filter(x => x.status !== '1');
      }

      // Nếu chưa có trạng thái thì set trạng thái đầu tiên
      if (!currentStatus && this.statusList.length > 0) {
        this.data.masterInfo.status = this.statusList[0].status;
        if (this.f?.['status']) {
          this.f['status'].setValue(this.data.masterInfo.status);
        }
      }
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

    //Kiếm tra phân bổ
    let sum_tien_nt = 0;
    this.data.details[0].data.forEach((item) => {
      sum_tien_nt += item.tien_nt;
    });
    if (sum_tien_nt == 0) {
      this.commonService.showMessage("Cần thực hiện phân bổ tiền thanh toán trước khi lưu phiếu");
      return;
    }
    if (this.data.masterInfo.t_da_tra == 0 && this.data.masterInfo.status == "2") {
      this.commonService.showMessage("Cần chọn hình thức thanh toán trước khi lưu phiếu");
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
      this.DebtReceipt.update(this.data).subscribe((item: any) => {
        this.loading = false;
        this.isDisabled = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'edit_success');
        }
        else {
          this.commonService.handleResponseErrorVoucher(item, 'voucher/debt-receipt');
        }
      });
    }
    else if (this.mode == MODE.CREATE) {
      this.isDisabled = true;
      this.data.details[1].data = this.paymentServiceShop.convertPaymentToRequest(this.payment, this.data.masterInfo);
      this.DebtReceipt.create(this.data).subscribe((item: any) => {
        this.loading = false;
        this.isDisabled = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'add_success');
        }
        else {
          this.commonService.handleResponseErrorVoucher(item, 'voucher/debt-receipt');
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
  resetDebt() {
    this.data.details[0].data = [];
    this.dataSource.data = [];
  }
  onDelete() {
    console.log('onDelete');
  }

  onCancel() {
    this.router.navigate(['voucher/debt-receipt']);
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
    this.AllotmentPrice();
  }
  calcTotal() {
    let t_tien_nt = 0;
    let t_con_no = 0;
    this.data.details[0].data.forEach((item) => {
      t_tien_nt += item.tien_nt || 0;
      t_con_no += item.con_lai || 0;
    });
    this.data.masterInfo = { ...this.data.masterInfo, t_tien_nt: t_tien_nt, t_tt_nt: t_tien_nt, s5: (this.data.masterInfo.s4 == undefined ? 0 : this.data.masterInfo.s4) - t_tien_nt, t_con_no: t_con_no };
  }
  AllotmentPrice() {
    let temp = 0;
    if (this.tien == '' || this.tien == '0') {
      this.commonService.showMessageByName('lblWarningNotValidMoney');
      return;
    }
    temp = Number.parseInt(this.tien);
    this.data.details[0].data.map((item: any) => {
      item.tien_nt = 0;
      item.tt_nt = 0;
      item.con_lai = item.tien_cl - 0;
      if (item.con_lai > 0) {
        if (temp >= item.tien_cl) {
          temp -= item.tien_cl;
          item.tien_nt = item.tien_cl;
          item.tt_nt = item.tien_cl;
          item.con_lai = 0;
        }
        else {
          item.tien_nt = temp;
          item.tt_nt = temp;
          item.con_lai = item.tien_cl - temp;
          temp = 0;
        }
      }
      return item;
    });
    if (temp >= 0) {
      this.data.masterInfo.s5 = temp;
    }
    this.data.masterInfo.s4 = Number.parseInt(this.tien) == undefined ? 0 : Number.parseInt(this.tien);
    this.tien = '';
    this.calcTotal();
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
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

  openDialogDebtList(dataSource: any[]): void {
    const openDialog = (dataSource: any[]) => {
      this.commonService.openDialog(DebtListComponent, { dataSource: dataSource, currentItem: this.dataSource.data }, 'fullscreen-dialog')
        .afterClosed()
        .subscribe((item) => {
          let t_tien = 0;
          let index = 1;
          item.forEach((item: any) => {
            item.line_nbr = index++;
            t_tien += item.tien_cl;
          })
          this.dataSource.data = item;
          console.log('this.dataSource1', this.dataSource.data)
          this.data.details[0].data = item;
          this.data.masterInfo.t_tien_nt = 0;
          this.data.masterInfo.t_tt_nt = 0;
          this.data.masterInfo.s4 = t_tien;
          this.data.masterInfo.t_con_no = t_tien;
          this.data.masterInfo.s5 = 0;
          this.calcTotal();
        });
    };
    openDialog(dataSource);
  }



  //#endregion

  onPaymentChange($event: any) {
    this.data.masterInfo.t_con_no = $event.t_con_no;
    this.data.masterInfo.t_da_tra = $event.t_da_tra;
    this.tien = $event.t_da_tra + ''
    this.data.masterInfo.status = $event.status;
    this.getStatusList();
  }

  isInputDisabled() {
    return this.disabled || Object.values(this.payment).some(p => p?.selected === true);
  }
}
