import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Receipt, ReceiptDetail } from '../recomment-to-use.model';
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

import { RecommentToUseDetailService } from './recomment-to-use-detail.service';
import { RecommentToUseService } from '../recomment-to-use.service';
import { lastValueFrom } from 'rxjs';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class RecommentToUseDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Phiếu đề nghị xuất dùng';
  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';
  item_code = '';
  site_code = '';
  t_so_luong = 0;
  imei = '';
  data!: Receipt;
  statusList: StatusTicket[] = [];
  voucherCode = 'PR5';
  submitted = false;
  loading = false;
  disabled = false;
  isDisabled = false;
  readonly = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';
  entity = VOUCHER_TYPE.RECOMMENT_TO_USE.sysid;


  override gridType = GridType.GridDetail;
  actionButtons = [button.DeleteButton];
  constructor(
    private formBuilder: FormBuilder,
    public returnSupplierDetailService: RecommentToUseDetailService,
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
    private authenticateService: AuthenticationService,
    private imeiService: IMEIService,
    private location: Location,
    private matSnackBar: MatSnackBar,
    private returnSupplier: RecommentToUseService,
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
    }
    // this.initData();
  }
  onHandleActionButton(event: { buttonId: string; data?: any; }) {
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
        this.imeiService.setUpSaleOrder([event.data[0].value], false, 2).subscribe((res) => {
          //
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
        ma_ho_so: [this.data.masterInfo.ma_ho_so, Validators.required],
        ngay_ho_so: [this.data.masterInfo.ngay_ho_so, Validators.required],
        dien_giai: [this.data.masterInfo.dien_giai], ong_ba: [this.data.masterInfo.ong_ba],
        t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
        t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
        t_thue: [this.data.masterInfo.t_thue_nt, Validators.required],
        t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
        item_code: [this.item_code],
        site_code: [this.site_code],
        imei: [this.imei],
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
          name: 'd567',
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
      this.ticketApiService.getVoucherNumber('RUTran').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
          ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
          ten_cuahang: [this.ten_cuahang],
          ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
          dien_giai: [this.data.masterInfo.dien_giai], ong_ba: [this.data.masterInfo.ong_ba],
          t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
          t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
          t_thue: [this.data.masterInfo.t_thue_nt, Validators.required],
          t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
          ma_ho_so: [this.data.masterInfo.ma_ho_so, Validators.required],
          ngay_ho_so: [this.data.masterInfo.ngay_ho_so, Validators.required],
          item_code: [this.item_code],
          site_code: [this.site_code],
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
      dien_giai: [this.data.masterInfo.dien_giai], ong_ba: [this.data.masterInfo.ong_ba],
      t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
      t_tien_nt: [this.data.masterInfo.t_tien_nt, Validators.required],
      t_thue: [this.data.masterInfo.t_thue_nt, Validators.required],
      t_tt_nt: [this.data.masterInfo.t_tt_nt, Validators.required],
      ma_ho_so: [this.data.masterInfo.ma_ho_so, Validators.required],
      ngay_ho_so: [this.data.masterInfo.ngay_ho_so, Validators.required],
      item_code: [this.item_code],
      site_code: [this.site_code],
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
    this.f[controlName].setValue($event);
  }
  onDelete() {
    console.log('onDelete');
  }

  onCancel() {
    this.location.back();
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
  async addItem(imei: string) {
    if (this.data.details[0].data.find(x => x.ma_imei.trim() === imei.trim())) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei });
      return;
    }
    const res = await lastValueFrom(this.imeiService.getListImeiInfo([imei]));
    if (res.success && res.result) {
      const map = new Map();
      map.set('exists_yn', true);
      map.set('in_store_yn', true);
      map.set('xuat_yn', false);
      map.set('dieu_chuyen_yn', false);
      map.set('dat_hang_yn', false);
      const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
      if (message) {
        this.commonService.showMessage(message);
        return false;
      }
    }
    const result = await lastValueFrom(this.imeiService.getImeiInfo(imei, this.ma_cuahang, this.voucherCode));
    if (result.success && result.result) {
      const response = result.result[0];
      this.data.details[0].data.push({
        stt_rec_pn: response.stt_rec_pn,
        stt_rec0pn: response.stt_rec0pn,
        pn_so: response.so_ct,
        ma_imei: response.ma_imei,
        stt_rec0: '',
        line_nbr: this.data.details[0].data.length + 1,
        ma_vt: response.ma_vt,
        ten_vt: response.ten_vt,
        dvt: response.dvt,
        ma_kho: response.ma_kho,
        ma_thue: response.ma_thue,
        thue_suat: response.thue_suat,
        so_luong: response.so_luong,
        gia_nt: response.gia_ban,
        tien_nt: response.thanh_tien,
        thue_nt: response.tien_thue,
        tt_nt: response.thanh_toan
      });
      this.calcTotal();
      this.dataSource.data = this.data.details[0].data;
      return true;
    }
    return false;
  }
  calcTotal() {
    let t_so_luong = 0;
    let t_tien_nt = 0;
    let t_thue_nt = 0;
    let t_tt_nt = 0;
    this.data.details[0].data.forEach((item) => {
      t_so_luong += item.so_luong;
      t_tien_nt += item.tien_nt || 0;
      t_thue_nt += item.thue_nt || 0;
      t_tt_nt += item.tt_nt || 0;
    });
    this.data.masterInfo = { ...this.data.masterInfo, t_so_luong: t_so_luong, t_tien_nt: t_tien_nt, t_thue_nt: t_thue_nt, t_tt_nt: t_tt_nt };
  }
  addIMEI(imei: string) {
    const ma_vt = this.f['item_code'].value.trim();
    const ma_kho = this.f['site_code'].value.trim();
    const item = this.data.details[0].data.find((item) => { return item.ma_vt.trim() == ma_vt.trim() && item.ma_kho.trim() == ma_kho.trim(); });
    let all_imei: string[] = [];
    this.data.details[0].data.forEach((detail) => {
      if (detail.ma_imei) {
        all_imei = [...all_imei, ...detail.ma_imei.split(',').map((item: string) => item.trim())];
      }
    });
    let list_imei: string[] = [];
    if (ma_vt && item) {
      if (item.ma_imei) {
        list_imei = item.ma_imei.split(',');
        list_imei = list_imei.map((item: any) => {
          return item.trim();
        });
        if (list_imei.length >= item.so_luong) {
          this.commonService.getMessageAdvance('lblWarningEnoughImei', { name: '%ma_vt', value: item.ma_vt });
          return false;
        }
      }

      this.imeiService.getListImeiInfo([imei]).subscribe((res) => {
        if (res.success && res.result) {
          const map = new Map();
          map.set('exists_yn', false);
          map.set('in_store_yn', false);
          map.set('xuat_yn', false);
          map.set('dieu_chuyen_yn', false);
          map.set('dat_hang_yn', false);
          const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
          if (message) {
            this.commonService.showMessage(this.imeiService.GetMessageStatusImei(map, res.result[0]));
            return false;
          }
        }
        if (all_imei.length !== 0) {
          if (all_imei.find((item: any) => { return item === imei; })) {
            this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei });
            return false;
          }
          else {
            list_imei = [...list_imei, imei];
            this.imei = '';
            this.f['imei'].setValue('');
          }
        } else {
          list_imei = [imei];
          this.imei = '';
          this.f['imei'].setValue('');
        }
        item.ma_imei = list_imei.join(', ');
        return true;
      });
      return false;
    }
    else {
      this.commonService.showMessageByName('lblWarningInvalidSiteandItem');
      return false;
    }
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
}
