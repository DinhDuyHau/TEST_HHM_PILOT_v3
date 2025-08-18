import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterInfo, Receipt, ReceiptDetail } from '../warranty-in.model';
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

import { WarrantyInDetailService } from './warranty-in-detail.service';
import { WarrantyInService } from '../warranty-in.service';
import { lastValueFrom } from 'rxjs';
import { EventService } from '@app/_components/lookup/event/event.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { SearchImeiWarrantyComponent } from '../search-imei-warranty/search-imei-warranty.component';
import { checkValidImei } from '@app/_common/commonFunction'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class WarrantyInDetailComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Nhập bảo hành';
  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';
  list_item_event: any[] = [];
  t_so_luong = 0;
  imei = '';
  imei_xuat = '';
  so_ct_px = '';
  stt_rec_px = '';
  ngay_ct_px: Date | undefined;

  data!: Receipt;
  statusList: StatusTicket[] = [];
  voucherCode = 'PNW';
  submitted = false;
  loading = false;
  disabled = false;
  isDisabled = false;
  readonly = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';

  site_code = '';
  item_code = '';
  item_name = ' ';
  [key: string]: any;
  entity = VOUCHER_TYPE.WARRANTY_IN.sysid;

  override gridType = GridType.GridDetail;
  actionButtons = [button.DeleteButton];
  constructor(
    private formBuilder: FormBuilder,
    public returnSupplierDetailService: WarrantyInDetailService,
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
    private returnSupplier: WarrantyInService,
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

      // lấy ma_kho, ten_kho trong detail lên master
      const firstDetail = item.details?.[0]?.data?.[0];
      this.site_code = firstDetail?.ma_kho || item.masterInfo.ma_kho;
      item.masterInfo.ten_kho = firstDetail?.ten_kho || item.masterInfo.ten_kho;

      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
        ten_cuahang: [this.ten_cuahang],
        ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
        ten_kho: [this.data.masterInfo.ten_kho],
        dien_giai: [this.data.masterInfo.dien_giai],
        ong_ba: [this.data.masterInfo.ong_ba],
        t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
        t_tien_nt: 0,
        imei: [this.imei],
        detail: [this.data.details || [], Validators.required],
      });

      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
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
      this.ticketApiService.getVoucherNumber('IRTran_PNW').subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
          ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
          ten_cuahang: [this.ten_cuahang],
          ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
          dien_giai: [this.data.masterInfo.dien_giai],
          ong_ba: [this.data.masterInfo.ong_ba],
          t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
          t_tien_nt: 0,
          imei: [this.imei],
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
      dien_giai: [this.data.masterInfo.dien_giai],
      ong_ba: [this.data.masterInfo.ong_ba],
      t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
      t_tien_nt: 0,
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
          this.commonService.handleResponseErrorVoucher(item, 'voucher/warranty-in');
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
          this.commonService.handleResponseErrorVoucher(item, 'voucher/warranty-in');
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
    this.router.navigate(['voucher/warranty-in']);
  }

  scanORCode(imei: string) {
    if (imei)
      this.checkImeiWarrantyIn(imei);
  }

  scanORCode_ImeiOut(imei: string) {
    if (imei)
      this.checkWarrantyImeiOut(imei);
  }

  async checkWarrantyImeiOut(imei: string) {
    const result = await lastValueFrom(this.imeiService.getWarrantyOutInfo(imei, this.ma_cuahang));
    if (result && result.result && result.result.length > 0) {
      this.so_ct_px = result.result[0].so_ct_px;
      this.stt_rec_px = result.result[0].stt_rec_px;
      this.ngay_ct_px = result.result[0].ngay_ct_px;
    }
    else {
      this.commonService.showMessageByName('lblWarningNotFoundWarrantyOut');
      this.imei_xuat = '';
      this.so_ct_px = '';
      this.stt_rec_px = '';
      this.ngay_ct_px = undefined;
    }
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

  onEnter_ImeiOut($event: any) {
    $event.preventDefault();
    const imei = $event.target.value;
    if (imei) this.checkWarrantyImeiOut(imei);
  }

  onEnterIMEI($event: any) {
    $event.preventDefault();
    const imei = $event.target.value;
    if (imei) {
      this.checkImeiWarrantyIn(imei);
    }
    else {
      this.commonService.showMessageByName('lblWarningLackIMEI');
    }
  }

  async checkImeiWarrantyIn(imei: string) {
    // bắt buộc nhập kho và dv bảo hành trước khi nhập imei
    if (this.site_code == '') {
      this.commonService.showMessageByName('lblWarningInvalidSite');
      return;
    }
    if (!this.voucherForm.controls['ma_kh'].value) {
      this.commonService.showMessage('Mã ĐV bảo hành không được để trống');
      return;
    }
    if (!checkValidImei(imei)) {
      this.commonService.showMessage('IMEI không được chứa khoảng trắng hoặc ký tự đặc biệt');
      return;
    }
    // tạm bỏ check vật tư
    // if (this.item_code == '') {
    //   this.commonService.showMessage('Mã vật tư không được để trống');
    //   return;
    // }

    //kiểm tra thông tin xuất bảo hành từ imei nhập input
    let result = await lastValueFrom(this.imeiService.getWarrantyOutInfo(imei, this.ma_cuahang));
    //Nếu tồn tại thông tin xuất bảo hành tương ứng với imei nhập => imei trả bảo hành khớp với imei xuất ra đi bảo hành
    if (result && result.result && result.result.length > 0) {
      this.item_code = result.result[0].ma_vt || '';
      this.item_name = result.result[0].ten_vt || '';

      //add imei vào grid
      this.addItem(imei, imei, this.so_ct_px, this.stt_rec_px, this.ngay_ct_px, result, false, this.item_code, this.item_name, false).then((flag) => {
        if (flag) {
          this.imei = '';
          // this.site_code = '';
          // this.data.masterInfo['ten_kho'] = '';
          this.item_code = '';
          this.item_name = '';
        }
      });
    }
    else {
      if (!result.result) {
        // hiển thị dialog để tìm imei xuất chọn để add vào grid
        // nếu ma_vt trùng với ma_vt xuất => SearchImeiWarrantyComponent
        this.commonService.openDialog(SearchImeiWarrantyComponent,
          { imei_nhap: this.imei }, 'search-style-dialog')
          .afterClosed()
          .subscribe(async (response: any) => {
            // trường hợp trả bảo hành là imei mới không phải là imei xuất đi bảo hành
            // lấy thông tin imei xuất chọn trong dialog và số c.từ px nhập trên form để mapping vào trong grid chi tiết
            if (response && response.item && response.item[0].ma_imei) {
              this.item_code = response.item_code;
              this.item_name = response.item_name;
              this.imei_xuat = response.item[0]?.ma_imei;
              result = await lastValueFrom(this.imeiService.getWarrantyOutInfo(this.imei_xuat, this.ma_cuahang));

              this.addItem(imei, this.imei_xuat, this.so_ct_px, this.stt_rec_px, this.ngay_ct_px, result, true, this.item_code, this.item_name, true).then((flag) => {
                if (flag) {
                  this.imei = '';
                  // this.site_code = '';
                  // this.data.masterInfo['ten_kho'] = '';
                  this.item_code = '';
                  this.item_name = '';
                }
              });
            }
          });
      }
    }
  }

  async addItem(imei: string, imei_px: string, so_ct_px?: string, stt_rec_px?: string, ngay_ct_px?: Date, out_data?: any, doi_bh_yn?: boolean, item_code?: string, item_name?: string, hang_moi_yn?: boolean,) {
    if (!doi_bh_yn && this.data.details[0].data.find(x => x.ma_imei.trim() === imei.trim())) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei });
      return;
    }

    // check trừng lặp trong chi tiết imei nhập
    if (this.data.details[0].data.find(x => x.ma_imei.trim() === imei.trim())) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei });
      return;
    }
    // check trừng lặp trong chi tiết imei xuất
    if (this.data.details[0].data.find(x => x.ma_imei_x.trim() === imei_px.trim())) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei_px });
      return;
    }

    // lấy ds thông tin chi tiết theo imei
    const res = await lastValueFrom(this.imeiService.getListImeiInfo([imei]));
    if (!doi_bh_yn && res.success && res.result) {
      const map = new Map();
      map.set('exists_yn', true);
      map.set('in_store_yn', false);
      map.set('dieu_chuyen_yn', false);
      map.set('dat_hang_yn', false);
      map.set('ban_hang_yn', false);
      map.set('tra_ncc_yn', false);
      map.set('xuat_yn', true);
      map.set('baohanh_yn', true);

      const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
      if (message) {
        this.commonService.showMessage(this.imeiService.GetMessageStatusImei(map, res.result[0]));
        return false;
      }
    }
    // const result = await lastValueFrom(this.imeiService.getSoldInfo(imei, this.ma_cuahang));
    const result = out_data;
    if (result.success && result.result) {
      const master: any = result.result[0];
      const response = result.result[0];

      // this.data.masterInfo.ong_ba = master.ong_ba;
      // this.data.masterInfo.ma_kh = master.ma_kh;
      // this.data.masterInfo.ten_ongba = master.ten_ongba;
      // this.data.masterInfo['ten_kh'] = master['ten_kh'];
      // this.f['ma_kh'].setValue(master.ma_kh);
      // this.f['ong_ba'].setValue(master.ong_ba);

      // đẩy thông tin vào grid
      this.data.details[0].data.push({
        ma_imei: doi_bh_yn ? imei : response.ma_imei,
        stt_rec0: '',
        line_nbr: this.data.details[0].data.length + 1,
        ma_vt: item_code || '',
        ten_vt: item_name || '',
        dvt: response.dvt,
        ma_kho: this.site_code !== '' ? this.site_code : response.ma_kho,
        so_luong: 1,
        sl_td1: response.gia,
        gia_nt: response.gia,
        tien_nt: response.tien_nt,
        ma_imei_x: imei_px,
        so_ct_px: (so_ct_px && so_ct_px !== '' ? so_ct_px : response.so_ct_px),
        stt_rec_px: stt_rec_px,
        doi_bh_yn: doi_bh_yn!,
        hang_moi_yn: hang_moi_yn!,
        ma_td1: response.ma_vt
      });
      this.calcTotal();
      this.dataSource.data = this.data.details[0].data;
      this.imei_xuat = '';
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
    this.data.masterInfo = { ...this.data.masterInfo, t_so_luong: t_so_luong, t_tien_nt: 0 };
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

  /*
  * Enable checkbox in grid
  */
  get enabledCheckboxColumns() {
    return this.disabled ? [] : ['hang_moi_yn'];
  }
}
