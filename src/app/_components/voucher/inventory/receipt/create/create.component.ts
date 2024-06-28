import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Extend, Receipt, ReceiptDetail } from '../receipt.model';
import { Button, Grid, GridType } from '@app/_components/gridV2/grid.model';
import { ReceiptService } from '../receipt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, StatusVoucher } from '@app/_services';
import { ReceiptDetailService } from './receipt-detail.service';
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
import { TaxService } from '@app/_components/lookup/tax/tax.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { checkValidImei } from '@app/_common/commonFunction';

@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateReceiptComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [button.LockingColumnButton, button.EditIMEIButton, button.EditSiteButton];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Phiếu nhập kho';
  userName = '';
  ma_cuahang = '';
  ten_cuahang = '';
  item_code = '';
  site_code = '';
  t_so_luong = 0;
  imei = '';
  data!: Receipt;
  extend: Extend = {};
  statusList: StatusTicket[] = [];
  voucherCode = 'PNA';
  submitted = false;
  loading = false;
  disabled = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';

  itemRowSelect: any;
  imeiOld: string[] = [];
  [key: string]: any;
  entity = VOUCHER_TYPE.RECEIPT.sysid;

  override gridType = GridType.GridDetail;
  constructor(
    private formBuilder: FormBuilder,
    public receiptDetailService: ReceiptDetailService,
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
    public taxService: TaxService,
    private authenticateService: AuthenticationService,
    private imeiService: IMEIService,
    private location: Location,
    private matSnackBar: MatSnackBar,
    private receiptService: ReceiptService,
    private statusVoucher: StatusVoucher,
    private commonService: CommonService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    localStorage.setItem('useGridCached', '1');
    super(receiptDetailService);
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

  clickButton(event: { buttonId: string; data?: any; }): void {
    this.onClickButton(event);
    if (event.buttonId == button.EditIMEIButton.id) {
      if (!event.data) {
        this.commonService.showMessageByName('lblWarningEditRowIMEI');
      }
      else {
        const data = { ...event.data };

        //Tạo danh sách imei để hiển thị mỗi imei 1 dòng trong dialog box
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
        data.imeiOld = this.imeiOld;

        //Tạo danh sách imei hiện tại đang xuất hiện trong grid (loại bỏ các imei tại dòng đang chọn)
        let current_imeis_in_grid = '';
        if (this.data && this.data.details && this.data.details.length > 0
          && this.data.details[0].data && this.data.details[0].data.length > 0
          && this.itemRowSelect) {
          const data_grid_row = this.data.details[0].data.filter(x => x.stt_rec0.toString() !== this.itemRowSelect.stt_rec0.toString());
          if (data_grid_row && data_grid_row.length > 0)
            for (let row_item of data_grid_row) {
              if (row_item.ma_imei && row_item.ma_imei !== '')
                current_imeis_in_grid += (current_imeis_in_grid !== '' ? ', ' : '') + row_item.ma_imei;
            }
        }

        //open dialog box
        this.receiptDetailService.openDialogIMEI(data, current_imeis_in_grid).subscribe((value) => {
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
        this.receiptDetailService.openLookup(this.stockService).subscribe((res) => {
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
    this.receiptService.getItem(stt_rec).subscribe((item => {
      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      console.log(item.masterInfo.ngay_ct);

      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
        ten_cuahang: [this.ten_cuahang],
        ma_gd: [this.data.masterInfo.ma_gd, Validators.required],
        ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
        ma_tt: [this.data.masterInfo.ma_tt, Validators.required],
        dien_giai: [this.data.masterInfo.dien_giai],
        t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
        item_code: [this.item_code],
        site_code: [this.site_code],
        imei: [this.imei],
        detail: [this.data.details || [], Validators.required],
      });
      this.stockService.setItemFilter([{ name: 'ma_cuahang', value: this.data.masterInfo.ma_cuahang }, { name: 'ma_loai', value: 'HM' }]);
      this.t_so_luong = this.data.details[0].data.reduce((pre, item) => { return pre += item.so_luong; }, 0);
      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
      this.data.details[0].data.forEach((item: ReceiptDetail) => {
        const imei = item.ma_imei?.split(',').map(x => x.trim());
        if (imei && imei.length) {
          this.imeiOld.push(...imei);
        }
      });
      if (this.data.details.length >= 2 && this.data.details[1].data) {
        this.extend = this.data.details[1].data[0] || {};
      }
      this.statusVoucher.getStatus(this.voucherCode, this.data.masterInfo.fnote3).subscribe(result => {
        this.statusList = result;
        if (!this.data.masterInfo.status) {
          this.data.masterInfo.status = this.statusList[0].status;
        }
      });
    }));
  }
  ngOnInit() {
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

    this.transactionService.setItemFilter([{ name: 'ma_ct', value: this.voucherCode }]);
    this.levelService.setItemFilter([{ name: 'ma_ct', value: this.voucherCode }]);
    this.data = {
      masterInfo: {
        dien_giai: '',
        stt_rec: '',
        ma_ct: 'PR1',
        so_ct: '0004',
        ngay_ct: getDateFormat(new Date()),
        ma_dvcs: '001',
        ma_ca: '01',
        status: '0',
        t_tien_nt: 0,
        t_tt_nt: 0,
        t_thue_nt: 0,
      },
      details: [
        {
          id: 1,
          name: 'd571',
          data: []
        },
        {
          id: 2,
          name: 'm571ext',
          data: []
        }
      ]
    };
    this.route.queryParams.subscribe((params: any) => {
      if (params['stt_rec']) {
        this.initData(params['stt_rec']);
      }
      else {
        this.statusVoucher.getStatus(this.voucherCode).subscribe(result => {
          this.statusList = result;
          if (!this.data.masterInfo.status) {
            this.data.masterInfo.status = this.statusList[0].status;
          }
        });
      }
      // console.log(Object.keys(params).map(key => ({ key, value: params[key] })));
    });

    this.voucherForm = this.formBuilder.group({
      so_ct: [this.data.masterInfo.so_ct, Validators.required],
      ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
      status: [this.data.masterInfo.status, Validators.required],
      ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
      ten_cuahang: [this.ten_cuahang],
      ma_gd: [this.data.masterInfo.ma_gd, Validators.required],
      ma_kh: [this.data.masterInfo.ma_kh, Validators.required],
      ma_tt: [this.data.masterInfo.ma_tt, Validators.required],
      dien_giai: [this.data.masterInfo.dien_giai],
      t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
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
    this.data.details[1].data = [this.extend];
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
    let all_imei: string[] = [];
    this.data.details[0].data.forEach((detail) => {
      if (detail.ma_imei) {
        all_imei = [...all_imei, ...detail.ma_imei.split(',').map((item: string) => item.trim())];
      }
    });
    if (this.checkDuplicateIMEI(all_imei) !== '') {
      this.commonService.showMessage(this.checkDuplicateIMEI(all_imei));
      return;
    }
    const imeiInvalid = this.data.details[0].data.filter((item) => {
      if (item.ma_imei) {
        let list_imei = item.ma_imei.split(',');
        list_imei = list_imei.map((item: any) => {
          return item.trim();
        });
        return list_imei.length !== item.so_luong;
      }
      return true;
    });
    if (imeiInvalid.length) {
      let itemInvalid = '';
      imeiInvalid.forEach((item) => {
        let list_imei = [];
        if (item.ma_imei) {
          list_imei = item.ma_imei.split(',');
        }
        list_imei = list_imei.map((item: any) => {
          return item.trim();
        });
        const count = item.so_luong - (list_imei.length || 0);
        itemInvalid += item.so_luong - (list_imei.length || 0) > 0 ? this.commonService.getMessageAdvance('lblWarningQuantityImeiItem', { name: '%ma_vt', value: item.ma_vt }, { name: '%count', value: count }) : this.commonService.getMessageAdvance('lblWarningQuantityImeiItem2', { name: '%ma_vt', value: item.ma_vt }, { name: '%count', value: -count });
      });
      this.commonService.showMessage(itemInvalid);
    }
    else {
      // this.data.details[0].data.forEach((item) => {
      //   item.ma_imei = item.ma_imei?.join(', ');
      // });
      this.loading = true;

      this.receiptService.update(this.data).subscribe((item: any) => {
        this.loading = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'edit_success');
        }
        else {
          console.log(item.result.length);
          if (item.result && item.result.length > 0) {
            // this.commonService.showMessageByNameAdvance(item.message, ...item.result);
            const msg = this.commonService.getMessage('lblDatabaseWarningMessage', [item.message]);
            this.commonService.showMessage(msg);
          }
          else {
            this.commonService.showMessageByName(item.message);
          }
        }
      });
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
  handleInputLookupChangeExtend($event: any): void {
    $event.forEach((item: any) => {
      this.extend[item.control] = item.value;
    });
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
      this.addIMEI(imei);
  }


  onEnter(event: any) {

    event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    // const form = this.el.nativeElement.closest('form');
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
    const imei = $event.target.value.trim();
    if (imei) {
      if (!checkValidImei(imei)) {
        this.commonService.showMessageByName('lblWarningImeiInputInvalid');
        return;
      }

      this.addIMEI(imei);
      this.imei = '';
    }
    else {
      this.commonService.showMessageByName('lblWarningLackIMEI');
    }
  }

  addIMEI(imei: string) {
    let ma_vt = this.f['item_code'].value.trim();
    let ma_kho = this.f['site_code'].value.trim();
    if (ma_vt == '' && ma_kho == '') {
      if (this.itemRowSelect) {
        ma_vt = this.itemRowSelect.ma_vt.trim();
        ma_kho = this.itemRowSelect.ma_kho.trim();
      }
    }
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

      // Kiểm tra xem imei có trong imei đã xoá ban đầu không
      if (this.imeiOld.find(x => x == imei.trim())) {
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
      }
      // Nếu không thì phải check trạng thái đặt hàng
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
  handleChangeTaxCode(event: string) {
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
  changeRow(item: any) {
    this.itemRowSelect = item;
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
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }
}