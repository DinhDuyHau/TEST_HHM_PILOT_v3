import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterInfo, Receipt, ReceiptDetail } from '../loan-recovery.model';
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

import { LoanRecoveryDetailService } from './loan-recovery-detail.service';
import { LoanRecoveryService } from '../loan-recovery.service';
import { lastValueFrom } from 'rxjs';
import { EventService } from '@app/_components/lookup/event/event.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '@app/sales-management/component/search/serach-dialog.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class LoanRecoveryDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Xuất cho mượn';
  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';
  list_item_event: any[] = [];
  t_so_luong = 0;
  imei = '';
  data!: Receipt;
  statusList: StatusTicket[] = [];
  voucherCode = 'PNM';
  submitted = false;
  loading = false;
  disabled = false;
  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';

  site_code = '';
  [key: string]: any;
  entity = VOUCHER_TYPE.LOAN_RECOVERY.sysid;
  isDisabled = false;
  readonly = false;

  override gridType = GridType.GridDetail;
  actionButtons = [button.EditQuantityButton, button.DeleteButton];
  constructor(
    private formBuilder: FormBuilder,
    public returnSupplierDetailService: LoanRecoveryDetailService,
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
    public eventService: EventService,
    private authenticateService: AuthenticationService,
    private imeiService: IMEIService,
    private location: Location,
    private matSnackBar: MatSnackBar,
    private returnSupplier: LoanRecoveryService,
    private statusVoucher: StatusVoucher,
    private commonService: CommonService,
    private ticketApiService: TicketApiService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    localStorage.setItem('useGridCached', '1');
    super(returnSupplierDetailService);
    const user = authenticateService.userValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
      // this.ma_cuahang = user.shop;
      // this.shopService.getItemByLocal(this.ma_cuahang).subscribe((res) => {
      //   this.ten_cuahang = res.ten_cuahang;
      // });
      eventService.setItemFilter([{ name: 'ma_dvcs', operator: 'like', value: user.unit }, { name: 'ma_cuahang', operator: 'like', value: user.shop }]);
      this.stockService.setItemFilter([{ name: 'ma_cuahang', value: user.shop }]);
    }
    // this.initData();
  }
  onHandleActionButton(event: { buttonId: string; data?: any; index: number }) {
    switch (event.buttonId) {
      case button.DeleteButton.id:
        this.data.details[0].data = this.data.details[0].data.filter((item) => {
          return item.ma_imei.trim() !== event.data[0].value.trim();
        });
        this.data.details[0].data = this.data.details[0].data.map((item, index) => {
          return { ...item, line_nbr: index + 1 };
        });
        this.calcTotal();
        this.dataSource.data = this.data.details[0].data;
        break;
      case button.EditPriceButton.id:
        this.returnSupplierDetailService.openDialogEditPrice({
          label: 'Tiền nhập lại hàng', value: event.data.gia_nt
        }).subscribe((res) => {
          if (res) {
            const item = this.data.details[0].data[event.index];
            item.gia_nt = res;
            item.tien_nt = item.gia_nt;
            this.calcTotal();
          }
        });
        break;
      default:
        break;
    }
  }
  clickButton(event: { buttonId: string; data?: any; }): void {
    this.onClickButton(event);
    if (event.buttonId == button.EditIMEIButton.id) {
      if (!event.data) {
        this.commonService.showMessageByName('lblWarningEditRowIMEI');
      }
      else {
        const data = { ...event.data };
        let list_imei: string[] = [];
        if (data) {
          if (data.ma_imei) {
            list_imei = event.data.ma_imei.split(',');
            list_imei = list_imei.map((item: any) => {
              return item.trim();
            });
            data.ma_imei = list_imei;
          }
        }
        this.returnSupplierDetailService.openDialogIMEI(data).subscribe((value) => {
          if (value) {
            event.data.ma_imei = value.join(', ');
          }
        });
      }
    }
    else if (event.buttonId == button.EditSiteButton.id) {
      if (!event.data) {
        this.commonService.showMessageByName('lblWarningEditRowSite');
      }
      else {
        this.returnSupplierDetailService.openLookup(this.stockService).subscribe((res) => {
          if (res.ma_kho)
            event.data.ma_kho = res.ma_kho;
        });
      }
    }
  }
  ngAfterViewInit(): void {
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly])');
    inputs[0].focus();
  }
  initData(stt_rec: string) {
    this.returnSupplier.getItem(stt_rec).subscribe((item => {
      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
        ten_cuahang: [this.ten_cuahang],
        ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
        dien_giai: [this.data.masterInfo.dien_giai], ong_ba: [this.data.masterInfo.ong_ba, Validators.required],
        t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
        t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
        imei: [this.imei],
        detail: [this.data.details || [], Validators.required],
      });
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
            this.readonly = true;
            break;
        }
      }
    });
    this.data = {
      masterInfo: {
        dien_giai: '',
        stt_rec: '',
        ma_ct: this.voucherCode,
        so_ct: '',
        ngay_ct: getDateFormat(new Date()),
        ma_dvcs: userObj['unit'],
        ma_ca: userObj['shift'],
        ma_cuahang: userObj['shop'],
        status: '0',
        t_so_luong: 0,
        t_tien_nt: 0,
        t_thue_nt: 0,
        t_tt_nt: 0
      },
      details: [
        {
          id: 1,
          name: 'd588',
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
      this.ticketApiService.getVoucherNumber('IRTran_PNM').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
          ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
          ten_cuahang: [this.ten_cuahang],
          ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
          dien_giai: [this.data.masterInfo.dien_giai], ong_ba: [this.data.masterInfo.ong_ba, Validators.required],
          t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
          t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
          imei: [this.imei],
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
        // console.log(Object.keys(params).map(key => ({ key, value: params[key] })));
      });
    }
    this.voucherForm = this.formBuilder.group({
      so_ct: [this.data.masterInfo.so_ct, Validators.required],
      ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
      status: [this.data.masterInfo.status, Validators.required],
      ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
      ten_cuahang: [this.ten_cuahang],
      ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
      dien_giai: [this.data.masterInfo.dien_giai], ong_ba: [this.data.masterInfo.ong_ba, Validators.required],
      t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
      t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
      imei: [this.imei],
      detail: [this.data.details || [], Validators.required],
    });
  }

  get f() {
    return this.voucherForm.controls;
  }

  onSubmit() {
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
      this.commonService.showMessageByName('lblWarningLackInfomation');
      return;
    }
    if (this.data.details.length == 0 || this.data.details[0].data.length == 0) {
      this.commonService.showMessageByName('lblWarningLackDetail');
      return;
    }
    this.loading = true;
    this.isDisabled = true;
    if (this.mode == MODE.UPDATE) {
      this.returnSupplier.update(this.data).subscribe((item: any) => {
        this.loading = false;
        this.isDisabled = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'edit_success');
        }
        else {
          if (item.result && item.result.length > 0) {
            this.commonService.showMessageByNameAdvance(item.message, ...item.result);
          }
          else {
            this.commonService.showMessageByName(item.message);
          }
        }
      });
    }
    else if (this.mode == MODE.CREATE) {
      this.isDisabled = true;
      this.returnSupplier.create(this.data).subscribe((item: any) => {
        this.loading = false;
        this.isDisabled = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'add_success');
        }
        else {
          if (item.result && item.result.length > 0) {
            this.commonService.showMessageByNameAdvance(item.message, ...item.result);
          }
          else {
            this.commonService.showMessageByName(item.message);
          }
        }
      });
    }
  }
  handleInputChange(controlName: string, $event: any): void {
    if (typeof $event !== 'string') {
      $event = $event.target.value;
    }
    this.data.masterInfo[controlName] = $event;
    if (this.f[controlName])
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
    this.router.navigate(['voucher/loan-recovery']);
  }

  scanORCode(imei: string) {
    if (imei)
      this.addItem(imei);
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
  onEnterIMEI($event: any) {
    $event.preventDefault();
    const imei = $event.target.value;

    if (!this.data.masterInfo.ma_kh || this.data.masterInfo.ma_kh === '') {
      this.commonService.showMessage('Cần nhập mã khách trước khi nhập imei');
      return;
    }

    if (!imei || imei.length < 5) {
      this.commonService.showMessage('Imei cần ít nhất 5 ký tự để tìm kiếm');
      return;
    }

    if (imei) {
      this.addItem(imei).then((flag) => {
        if (flag) {
          this.imei = '';
          this.site_code = '';
        }
      });
    }
    else {
      this.commonService.showMessageByName('lblWarningLackIMEI');
    }
  }
  async addItem(imei: string) {
    // if (this.site_code == '') {
    //   this.commonService.showMessageByName('lblWarningInvalidSite');
    //   return;
    // }
    if (this.data.details[0].data.find(x => x.ma_imei.trim() === imei.trim())) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei });
      return;
    }
    const res = await lastValueFrom(this.imeiService.getListImeiInfo([imei]));
    if (res.success && res.result) {
      const map = new Map();
      map.set('exists_yn', true);
      map.set('in_store_yn', false);
      map.set('xuat_yn', true);
      map.set('dieu_chuyen_yn', false);
      map.set('dat_hang_yn', false);
      map.set('ban_hang_yn', false);
      map.set('tra_ncc_yn', false);
      const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
      if (message) {
        /*
        * Ko đúng imei sẽ mở dialog tìm kiếm
        */
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.commonService.openDialog(SearchDialogComponent, {
          keyword: imei,
          shop: user.shop,
          componentName: SEARCH_COMPONENT_NAME.IMEI_SEARCH_SALES,
          title: 'Danh sách kết quả tìm kiếm imei',
          isFilter: false
        }, 'search-style-dialog')
          .afterClosed().subscribe(async (result) => {
            if (result && result.ma_imei) {
              const ma_imei = result.ma_imei;
              await this.processImeiInfo(ma_imei);
              this.imei = '';
            }
          });

        return false;
      }
    }

    //encode imei trước khi request để tránh các ký tự đặc biệt (=, &, ?, /)
    const imei_encoded = encodeURIComponent(imei);

    const result = await lastValueFrom(this.imeiService.getSoldInfo(imei_encoded, this.ma_cuahang));
    if (result.success && result.result) {
      console.log(result.result);

      const master: MasterInfo = result.result.masterInfo;
      const response = result.result.details[0].data[0];
      if (master.ma_ct != 'PXM') {
        this.commonService.showMessageByName('lblWarningInvalidImei');
      }
      this.data.masterInfo.ong_ba = master.ong_ba;
      this.data.masterInfo.ma_kh = master.ma_kh;
      this.data.masterInfo.ten_ongba = master.ten_ongba;
      this.data.masterInfo['ten_kh'] = master['ten_kh'];
      this.f['ma_kh'].setValue(master.ma_kh);
      this.f['ong_ba'].setValue(master.ong_ba);

      console.log(response);

      this.data.details[0].data.push({
        ma_imei: response.ma_imei,
        stt_rec0: '',
        line_nbr: this.data.details[0].data.length + 1,
        ma_vt: response.ma_vt,
        ten_vt: response.ten_vt,
        dvt: response.dvt,
        ma_kho: this.site_code !== '' ? this.site_code : response.ma_khon,
        so_luong: response.so_luong,
        sl_td1: response.gia_nt,
        gia_nt: response.gia_nt,
        tien_nt: response.tien_nt,
        stt_rec_px: response.stt_rec,
        stt_rec0px: response.stt_rec0,
        so_ct_px: response.so_ct,
        ngay_ct_px: response.ngay_ct,
        ma_td3: response.ma_cuahang,
      });
      this.calcTotal();
      this.dataSource.data = this.data.details[0].data;
      return true;
    }
    this.commonService.showMessageByName('lblWarningInvalidImei');
    return false;
  }
  calcTotal() {
    let t_so_luong = 0;
    let t_tien_nt = 0;
    this.data.details[0].data.forEach((item) => {
      t_so_luong += item.so_luong;
      t_tien_nt += item.tien_nt;
    });
    this.data.masterInfo = { ...this.data.masterInfo, t_so_luong: t_so_luong, t_tien_nt: t_tien_nt };
  }
  checkDuplicateIMEI(all_imei: string[]) {
    const map = new Map();
    all_imei.forEach((item) => {
      if (map.has(item)) {
        map.set(item, map.get(item) + 1);
      }
      else {
        map.set(item, 1);
      }
    });
    let err = '';
    map.forEach((value, key) => {
      if (value != 1) {
        err += this.commonService.getMessageAdvance('lblDuplicateIMEI', { name: '%imei', value: key }, { name: '%count', value: value });
      }
    });
    return err;
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  async processImeiInfo(imei: string): Promise<boolean> {
    if (this.data.details[0].data.find(x => x.ma_imei.trim() === imei.trim())) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei });
      return false;
    }
    const res = await lastValueFrom(this.imeiService.getListImeiInfo([imei]));
    if (res.success && res.result) {
      const map = new Map();
      map.set('exists_yn', true);
      map.set('in_store_yn', false);
      map.set('xuat_yn', true);
      map.set('dieu_chuyen_yn', false);
      map.set('dat_hang_yn', false);
      map.set('ban_hang_yn', false);
      map.set('tra_ncc_yn', false);
      const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
      if (message) {
        this.commonService.showMessage(this.imeiService.GetMessageStatusImei(map, res.result[0]));
        return false;
      }
    }
    const result = await lastValueFrom(this.imeiService.getSoldInfo(imei, this.ma_cuahang));
    if (result.success && result.result) {
      const master: MasterInfo = result.result.masterInfo;
      const response = result.result.details[0].data[0];
      if (master.ma_ct != 'PXM') {
        this.commonService.showMessageByName('lblWarningInvalidImei');
      }
      this.data.masterInfo.ong_ba = master.ong_ba;
      this.data.masterInfo.ma_kh = master.ma_kh;
      this.data.masterInfo.ten_ongba = master.ten_ongba;
      this.data.masterInfo['ten_kh'] = master['ten_kh'];
      this.f['ma_kh'].setValue(master.ma_kh);
      this.f['ong_ba'].setValue(master.ong_ba);

      this.data.details[0].data.push({
        ma_imei: response.ma_imei,
        stt_rec0: '',
        line_nbr: this.data.details[0].data.length + 1,
        ma_vt: response.ma_vt,
        ten_vt: response.ten_vt,
        dvt: response.dvt,
        ma_kho: this.site_code !== '' ? this.site_code : response.ma_kho,
        so_luong: response.so_luong,
        sl_td1: response.gia_nt,
        gia_nt: response.gia_nt,
        tien_nt: response.tien_nt,
        stt_rec_px: response.stt_rec,
        stt_rec0px: response.stt_rec0,
        so_ct_px: response.so_ct,
        ngay_ct_px: response.ngay_ct,
        ma_td3: response.ma_cuahang,
      });
      this.calcTotal();
      this.dataSource.data = this.data.details[0].data;
      return true;
    }
    this.commonService.showMessageByName('lblWarningInvalidImei');
    return false;
  }
}
