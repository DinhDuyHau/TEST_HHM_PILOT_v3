import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Receipt, ReceiptDetail } from '../collection-receipt.model';
import { Button, Grid, GridType } from '@app/_components/gridV2/grid.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService, CommissionPrice, StatusVoucher } from '@app/_services';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '@app/_components/lookup/customer/customer.service';
import { CustomerThuHoService } from '@app/_components/lookup/customer/customer_thuho.service';
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
import { IMEIService } from '@app/_services/imei.service';
import button from '@app/_common/button';
import { StockService } from '@app/_components/lookup/stock/stock.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { MODE, VOUCHER_TYPE } from '../../../enum/voucher_enum';

import { CollectionReceiptDetailService } from './collection-receipt-detail.service';
import { CollectionReceiptService } from '../collection-receipt.service';
import { BankingService } from '@app/_components/lookup/banking/banking.service';
import { CommisstionCollectionService } from '@app/_components/lookup/commission-collection/commission-collection.service';
import { Free2Service } from '@app/_components/lookup/free2/free2';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { PaymentService as PaymentServiceShop } from '@app/sales-management/page/common/payment.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { lastValueFrom } from 'rxjs';
import { getDateFormat } from '@app/_common/commonFunction';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DvThuHoService } from '@app/_components/lookup/dv_thuho/dvthuho.service';
import { CustomerCreateDialogComponent } from '@app/sales-management/component/customer/customer-create-dialog/customer-create-dialog.component';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CollectionReceiptDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Phiếu thu hộ';
  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';

  imei = '';
  ghi_chu = '';
  tien = '';
  // MÃ Loại thu hộ
  ma_td = '';
  ten_td = '';
  sd_imei_yn = false;

  // Mã dịch vụ thu hộ
  ma_dvth = '';
  ten_dvth = '';
  dvthuhoService: DvThuHoService;
  ma_kh_thuho = '';
  ma_td2_thuho = '';      //mã giao dịch của khách hàng
  ten_kh_thuho = '';      //tên giao dịch của khách hàng
  customer_dvth_service: CustomerThuHoService;

  data!: Receipt;
  statusList: StatusTicket[] = [];
  voucherCode = 'PTH';
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
  entity = VOUCHER_TYPE.COLLECTION_RECEIPT.sysid;

  action = '';
  shop = '';

  override gridType = GridType.GridDetail;
  actionButtons = [button.DeleteButton];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    public CollectionReceiptDetailService: CollectionReceiptDetailService,
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
    public commissionService: CommisstionCollectionService,
    public free2Service: Free2Service,
    private authenticateService: AuthenticationService,
    private imeiService: IMEIService,
    private location: Location,
    private commonService: CommonService,
    private CollectionReceipt: CollectionReceiptService,
    private statusVoucher: StatusVoucher,
    private ticketApiService: TicketApiService,
    private commissionPriceService: CommissionPrice,
    private paymentServiceShop: PaymentServiceShop,
    private el: ElementRef,
    private renderer: Renderer2,
    private customerApiService: CustomerApiService
  ) {
    localStorage.setItem('useGridCached', '1');
    super(CollectionReceiptDetailService);
    const user = authenticateService.userValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
    }

    this.dvthuhoService = new DvThuHoService(http, dialog);
    this.customer_dvth_service = new CustomerThuHoService(http, dialog);
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
    this.CollectionReceipt.getItem(stt_rec).subscribe((item => {
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

      this.dvthuhoService.setItemFilter([{ name: 'ma_loai', operator: '=', value: this.ma_td }]);
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
        t_tt_nt: 0
      },
      details: [
        {
          id: 1,
          name: 'd546',
          data: []
        },
        {
          id: 2,
          name: 'd546tt',
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
      this.ticketApiService.getVoucherNumber('PTHTran').subscribe(result => {
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
    // console.log(this.voucherForm);
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
    this.loading = true;
    this.isDisabled = true;
    if (this.mode == MODE.UPDATE) {
      if (this.data.details.length > 1) {
        this.data.details[1].data = this.paymentServiceShop.convertPaymentToRequest(this.payment, this.data.masterInfo);
      }
      else {
        this.data.details.push({ id: 2, name: 'd545tt', data: this.paymentServiceShop.convertPaymentToRequest(this.payment, this.data.masterInfo) });
      }
      this.CollectionReceipt.update(this.data).subscribe((item: any) => {
        this.loading = false;
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
      this.data.details[1].data = this.paymentServiceShop.convertPaymentToRequest(this.payment, this.data.masterInfo);
      this.CollectionReceipt.create(this.data).subscribe((item: any) => {
        this.loading = false;
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
      this[item.control] = item.value;
      this.data.masterInfo[item.control] = item.value;
      if (this.f[item.control]) {
        this.f[item.control].setValue(item.value);
      }
      if (item.control == 'ma_td') {
        this.dvthuhoService.setItemFilter([{ name: 'ma_loai', operator: '=', value: item.value }]);
      }
    });
  }

  handleInputChange_Ma_kh_thuho($event: any): void {
    // if ($event && $event.length >= 2) {
    //   this.ma_kh_thuho = $event[0].value;
    //   this.ten_kh_thuho = $event[1].value;
    // }
  }

  onChangeResponse($event: any) {
    if (!$event) return;
    if (!$event.is_popup_filter) {
      if ($event && $event.result && $event.result.items && $event.result.items.length > 0) {
        //mã khách của đối tác thu hộ
        this.ma_kh_thuho = $event.result.items[0].ma_kh;
        //mã giao dịch của đối tác thu hộ
        this.ma_td2_thuho = $event.result.items[0].ma_td2;
        //tên giao dịch của đối tác thu hộ
        this.ten_kh_thuho = $event.result.items[0].ten_cty;
      }
    }
    else {
      if ($event.result) {
        //mã khách của đối tác thu hộ
        this.ma_kh_thuho = $event.result.ma_kh;
        //mã giao dịch của đối tác thu hộ
        this.ma_td2_thuho = $event.result.ma_td2;
        //tên giao dịch của đối tác thu hộ
        this.ten_kh_thuho = $event.result.ten_cty;
      }
    }


  }

  onDelete() {
    // console.log('onDelete');
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
  scanORCode(imei: string) {
    if (imei)
      this.addItem(imei);
  }
  async addItem(imei: string) {
    const res = await lastValueFrom(this.imeiService.getListImeiInfo([imei]));
    if (res.success && res.result) {
      const map = new Map();
      map.set('exists_yn', true);
      // map.set('in_store_yn', true);
      // map.set('xuat_yn', false);
      // map.set('dieu_chuyen_yn', false);
      // map.set('dat_hang_yn', false);
      const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
      if (message) {
        this.commonService.showMessage(this.imeiService.GetMessageStatusImei(map, res.result[0]));
        return false;
      }
    }
    const result = await lastValueFrom(this.imeiService.getImeiInfo(imei, this.ma_cuahang, this.voucherCode));
    if (result.success && result.result) {
      const response = result.result[0];
      // this.data.details[0].data.push({
      //   ma_imei: response.ma_imei,
      //   stt_rec0: '',
      //   line_nbr: this.data.details[0].data.length + 1,
      //   ma_vt: response.ma_vt,
      //   ten_vt: response.ten_vt,
      //   dvt: response.dvt,
      //   ma_kho: response.ma_kho,
      //   so_luong: response.so_luong,
      //   ma_sukien: this.ma_sukien,
      //   ten_sukien: this.ten_sukien,
      // });
      // this.calcTotal();
      // this.dataSource.data = this.data.details[0].data;
      // this.imeiService.setUpSaleOrder([imei], true, 2, this.voucherCode).subscribe((res) => {
      //   //
      // });
      return true;
    }
    return false;
  }
  onEnterIMEI($event: any) {
    $event.preventDefault();
    const imei = $event.target.value;
    if (imei) {
      this.addItem(imei).then((flag) => {
        if (flag)
          this.imei = '';
      });
    }
    else {
      this.commonService.showMessageByName('lblWarningLackIMEI');
    }
  }

  onEnterItem() {
    //warning mã loại thu hộ
    if (this.ma_td === '') {
      this.commonService.showMessageByName('lblWarningLackCollectionCode');
      return;
    }
    //warning mã dịch vụ thu hộ
    if (this.ma_dvth === '') {
      this.commonService.showMessageByName('lblWarningEmpty_PTH_MaDvth');
      return;
    }
    //warning mã đối tượng thu hộ
    if (this.ma_kh_thuho === '') {
      this.commonService.showMessageByName('lblWarningEmpty_PTH_MaKhThuHo');
      return;
    }

    //warning mã giao dịch của đối tượng thu hộ
    if (this.ma_td2_thuho === '') {
      this.commonService.showMessageByName('lblWarningEmpty_PTH_MaGDThuHo');
      return;
    }

    if (this.tien === '' || this.tien === '0') {
      this.commonService.showMessageByName('lblWarningNotValidMoney');
      return;
    }
    this.commissionPriceService.getCommissionPrice(this.ma_td, this.data.masterInfo.ngay_ct || new Date().toString())
      .subscribe((res: any) => {
        if (res && res.success) {
          const item: ReceiptDetail = {
            stt_rec0: '',
            line_nbr: this.data.details[0].data.length + 1,
            tien_nt: Number.parseInt(this.tien),
            tt_nt: Number.parseInt(this.tien),
            dien_giai: this.ghi_chu,
            ma_loai_thu_ho: this.ma_td,
            ten_loai_thu_ho: this.ten_td,
            tien_hoa_hong: 0,
            ma_imei: this.imei,
            ma_td2: this.ma_td2_thuho,
            ma_kh_thuho: this.ma_kh_thuho,
            ten_kh_thuho: this.ten_kh_thuho,
            ma_dvth: this.ma_dvth,
            ten_dvth: this.ten_dvth
          };
          if (res.result && res.result.items && res.result.items.length) {
            const hoa_hong = res.result.items[0];
            if (hoa_hong.tien) {
              item.tien_hoa_hong_nt = hoa_hong.tien;
            }
            else {
              item.tien_hoa_hong_nt = (item.tien_nt == undefined ? 0 : item.tien_nt) * hoa_hong.ti_le / 100;
            }
          }

          this.data.details[0].data.push(item);
          this.calcTotal();
          this.dataSource.data = this.data.details[0].data;
          this.ma_td = '';
          this.ten_td = '';
          this.tien = '';
          this.ghi_chu = '';
          this.imei = '';
          this.sd_imei_yn = false;
          this.ma_td2_thuho = '';
          this.ma_kh_thuho = '';
          this.ten_kh_thuho = '';
          this.ma_dvth = '';
          this.ten_dvth = '';
        }
        else {
          this.commonService.showMessage(this.commonService.getMessage(res.message) || 'Có lỗi xảy ra');
          return;
        }

      });

  }
  calcTotal() {
    let t_tien_nt = 0;
    let t_tien_hoa_hong_nt = 0;
    this.data.details[0].data.forEach((item) => {
      t_tien_nt += item.tien_nt || 0;
      t_tien_hoa_hong_nt += item.tien_hoa_hong_nt || 0;
    });

    this.data.masterInfo.t_con_no = t_tien_nt - this.data.masterInfo.t_da_tra!;

    this.data.masterInfo = { ...this.data.masterInfo, t_tien_nt: t_tien_nt, t_tt_nt: t_tien_nt, t_tien_hoa_hong_nt: t_tien_hoa_hong_nt };
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
  //#endregion

}
