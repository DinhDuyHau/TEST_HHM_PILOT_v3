import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Extend, Receipt, ReceiptDetail, ReceiptDiscountDetail, ReceiptDiscountDetailRequest } from '../receipt.model';
import { Button, Field, Grid, GridType } from '@app/_components/gridV2/grid.model';
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
import { map } from 'rxjs';
import dataFormat from '@app/_common/dataFormat';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateReceiptComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [button.LockingColumnButton, button.EditIMEIButton, button.EditSiteButton];
  buttonsDiscount = [button.AddRowButton, button.DeleteRowButton];
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
  voucher_date = '';
  receipt_invoice_date = '';

  submitted = false;
  loading = false;
  disabled = false;
  isDisabled = false;
  readonly = false;
  isFocused = false;

  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';

  itemRowSelect: any;
  imeiOld: string[] = [];
  [key: string]: any;
  entity = VOUCHER_TYPE.RECEIPT.sysid;
  discountColumns: Field[] = [];
  dataSourceDiscount = new MatTableDataSource<ReceiptDiscountDetail>([]);
  actionButtons = [button.EditPriceButton];

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
    private renderer: Renderer2,
    private http: HttpClient
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
      this.voucher_date = item.masterInfo.ngay_ct!;
      this.receipt_invoice_date = item.masterInfo.ngay_ct0?.substring(0, 10)!;

      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        ngay_lct: [this.data.masterInfo.ngay_lct, Validators.required],
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
        s5: [this.data.masterInfo.s5],
        s6: [this.data.masterInfo.s6],
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
        this.extend.ngay_ct0 = this.receipt_invoice_date;
      }
      if (this.data.details.length >= 3 && this.data.details[2].data) {
        this.dataSourceDiscount = new MatTableDataSource<ReceiptDiscountDetail>(this.data.details[2].data);
      }
      this.statusVoucher.getStatus(this.voucherCode, this.data.masterInfo.fnote3).subscribe(result => {
        this.statusList = result;
        if (!this.data.masterInfo.status) {
          this.data.masterInfo.status = this.statusList[0].status;
        }
      });
      this.calcDiscount();
      this.calcTax();
      this.calcTotal();
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
            this.readonly = true;
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
        ngay_lct: getDateFormat(new Date()),
        ma_dvcs: '001',
        ma_ca: '01',
        status: '0',
        t_tien_nt: 0,
        t_tt_nt: 0,
        t_thue_nt: 0,
        t_ck_nt: 0,
        // s4: 0, // thuế suất ck
        s5: 0, // tt thuế ck
        s6: 0 // tt ck trước vat
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
        },
        {
          id: 3,
          name: 'd571ck',
          data: []
        }
      ]
    };
    this.route.queryParams.subscribe((params: any) => {
      if (params['key']) {
        this.initData(params['key']);
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
      ngay_lct: [this.data.masterInfo.ngay_lct, Validators.required],
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
      s5: [this.data.masterInfo.s5],
      s6: [this.data.masterInfo.s6],
    });

    // lấy các cột cho tab chiết khấu
    this.getDiscountFields();
  }

  get f() {
    return this.voucherForm.controls;
  }

  getDiscountFields() {
    const randomParam = new Date().getTime();
    this.http.get<Field[]>(`assets/fields/grid/receipt_discount_detail.json?r=${randomParam}`).pipe(
      map((data: any[]) => {
        return data.map((item) => {
          return { ...new Field(), ...item, dataFormatString: (dataFormat as any)[item.dataFormatString || ''] };
        });
      })
    ).subscribe(fields => {
      this.discountColumns = fields;
    });
  }

  mappingDataDiscountRequest(): ReceiptDiscountDetailRequest[] {
    return this.dataSourceDiscount.data.map((item: any, index: number) => ({
      stt_rec: this.data.masterInfo.stt_rec,
      stt_rec0: (index + 1).toString().padStart(3, '0'),
      ma_ct: this.data.masterInfo.ma_ct,
      ngay_ct: this.data.masterInfo.ngay_ct
        ? new Date(this.data.masterInfo.ngay_ct).toISOString().split('T')[0] + "T00:00:00"
        : '',
      so_ct: this.data.masterInfo.so_ct,
      dien_giai: item.dien_giai,
      thue_suat: Number(item.thue_suat) || 0,
      tien: Number(item.tien) || 0
    }));
  }

  onSubmit() {
    // tạo dữ liệu chiết khấu trước khi request
    this.data.details[2].id = 3;
    this.data.details[2].data = this.mappingDataDiscountRequest();
    // end

    // validate chiết khấu
    let message = this.validateDiscountTab();
    if (message) {
      this.commonService.showMessage(message);
      return;
    }

    // xử lý thêm trường cho chi tiết hàng hóa
    this.data.details[0].data.map((item: any) => {
      item.ck_nt = item.ck;
      item.thue_ck_nt = item.thue_ck;
    });

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
      this.isDisabled = true;

      this.receiptService.update(this.data).subscribe((item: any) => {
        this.loading = false;
        this.isDisabled = false;
        if (item.success) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.commonService.showMessageByName(item.message ? item.message : 'edit_success');
        }
        else {
          if (item.result && item.result.length > 0) {
            // this.commonService.showMessageByNameAdvance(item.message, ...item.result);
            if (item.message === 'exists_yn_yes' || item.message === 'dat_hang_yn_yes') {
              this.commonService.showMessageByNameAdvance(item.message, ...item.result);
            }
            else {
              const msg = this.commonService.getMessage('lblDatabaseWarningMessage', [item.message]);
              this.commonService.showMessage(msg);
            }
          }
          else {
            this.commonService.showMessageByName(item.message);
            // const msg = this.commonService.getMessage('lblDatabaseWarningMessage', [item.message]);
            // this.commonService.showMessage(msg);
            //this.commonService.showMessageByName(item.message);
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
    this.router.navigate(['voucher/receipt']);
  }

  scanORCode(imei: string) {
    if (imei)
      if (!checkValidImei(imei)) {
        this.commonService.showMessageByName('lblWarningImeiInputInvalid');
        return;
      }
    this.addIMEI(imei);
  }

  handleFocus(event: any) {
    if (!this.isFocused) {
      this.commonService.showMessage('Vui lòng đảm bảo rằng Unikey đang ở chế độ gõ tiếng Anh trước khi quét mã IMEI.');
      this.isFocused = true
    }
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
    let t_ck_nt = this.data.masterInfo.t_ck_nt || 0;
    let t_thue_suat_ck = this.data.masterInfo.s4 || 0;
    let s5 = this.data.masterInfo.s5 || 0; // Tổng thuế chiết khấu
    let s6 = this.data.masterInfo.s6 || 0; // Tổng tiền chiết khấu trước VAT

    // thành tiền grid
    this.data.details[0].data.forEach((item) => {
      item.tien_nt = item.gia_nt * item.so_luong;
      item.thue_nt = item.tien_nt * (item.thue_suat / 100);
    });

    // tổng tiền
    this.data.details[0].data.forEach((item) => {
      t_tien_nt += item.tien_nt || 0;
    });
    t_tien_nt = Math.round(t_tien_nt - t_ck_nt - s6);

    // tổng thuế
    this.data.details[0].data.forEach((item) => {
      t_thue_nt += item.thue_nt || 0;
    });

    // thanh toán
    this.data.details[0].data.forEach((item) => {
      item.tt_nt = item.tien_nt - item.ck + (item.thue_nt - item.thue_ck);
      item.tt = item.tien_nt - item.ck + (item.thue_nt - item.thue_ck);
    });

    t_thue_nt = Math.round(t_thue_nt - ((t_ck_nt * t_thue_suat_ck) / 100) - s5);

    this.data.masterInfo = {
      ...this.data.masterInfo,
      t_tien_nt: t_tien_nt,
      t_tien: t_tien_nt,
      t_thue_nt: t_thue_nt,
      t_thue: t_thue_nt,
      t_tt_nt: t_tien_nt + t_thue_nt,
      t_tt: t_tien_nt + t_thue_nt
    };
  }
  calcTax() {
    this.extend.t_thue_nt = ((this.extend.t_tien_nt || 0) * (this.extend.thue_suat || 0) / 100) - (this.data.masterInfo.s5 || 0);
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onStatusChange($event: any) {
    this.data.masterInfo.status = $event;
    if (this.data.masterInfo.status === '2') {
      this.data.masterInfo.ngay_ct = this.data.masterInfo.ngay_ht?.substring(0, 10);
      this.f['ngay_ct'].setValue(this.data.masterInfo.ngay_ct);
    }
    else {
      this.f['ngay_ct'].setValue(this.voucher_date);
    }
  }

  onDiscountChange($event: any) {
    this.data.masterInfo.t_ck_nt = $event;
    this.data.masterInfo.t_ck = $event;
  }

  onEnterDiscount(event: any) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    this.calcTotal();
  }

  onTaxRateChange($event: any) {
    this.data.masterInfo.s4 = $event;
  }

  onEnterTaxRate(event: any) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    this.calcTotal();
  }

  validateDiscountTab() {
    if (this.data.details[2].data.some((item: any) => !item.dien_giai)) {
      return "Tab chiết khấu có dòng chưa có diễn giải";
    }
    if (this.data.details[2].data.some((item: any) => item.tien === null || item.tien === undefined || item.tien <= 0)) {
      return "Tiền chiết khấu phải lớn hơn 0";
    }
    return '';
  }

  handleAddRow() {
    const newRow = {
      line_nbr: this.dataSourceDiscount.data.length + 1,
      dien_giai: '',
      thue_suat: 0,
      tien: 0
    };

    this.dataSourceDiscount.data = [...this.dataSourceDiscount.data, newRow];

    // tính toán lại tiền
    this.calcDiscount();
    this.calcTax();
    this.calcTotal();
  }

  handleDeleteRow(index: number) {
    if (index !== -1) {
      const updatedData = this.dataSourceDiscount.data.slice();
      updatedData.splice(index, 1);

      // Reset lại số thứ tự
      updatedData.forEach((item, idx) => {
        item.line_nbr = idx + 1;
      });

      this.dataSourceDiscount.data = updatedData;

      // tính toán lại tiền
      this.calcDiscount();
      this.calcTax();
      this.calcTotal();
    }
  }

  changeInputRow(event: any) {
    let value = event.value;

    // Nếu là trường `tien` hoặc `thue_suat`, xử lý chuyển đổi số
    if (event.name === 'tien' || event.name === 'thue_suat') {
      if (typeof value === 'string' && /^[\d,]+(\.\d+)?$/.test(value)) {
        value = value.replace(/,/g, '');
        value = isNaN(Number(value)) ? event.value : Number(value);
      }
    }

    if (event.name === 'tien' && Number(value) > (this.data.masterInfo.t_tien_nt ?? 0)) {
      this.commonService.showMessage('Không được nhập lớn hơn tổng tiền hàng!');
      return;
    }

    // Cập nhật giá trị vào `dataSourceDiscount`
    (this.dataSourceDiscount.data[event.row] as any)[event.name] = value;

    // tính toán lại tiền
    this.calcDiscount();
    this.calcTax();
    this.calcTotal();
  }

  calcDiscount() {
    //  tt ck trước vat
    this.data.masterInfo.s6 = this.dataSourceDiscount.data.reduce((pre, item) => {
      return pre += (item.tien || 0);
    }, 0);
    // tt thuế ck
    this.data.masterInfo.s5 = this.dataSourceDiscount.data.reduce((pre, item) => {
      return pre + ((item.tien || 0) * ((item.thue_suat || 0) / 100));
    }, 0);
    // tính ra thuế CK = tiền ck x thuế suất / 100
    this.data.details[0].data.forEach((item) => {
      const ck = this.parseValidNumber(item.ck); // Lấy giá trị ck vừa nhập
      const thueSuat = this.parseValidNumber(item.thue_suat); // Thuế suất

      // Tính lại thuế chiết khấu
      item.thue_ck = ck * (thueSuat / 100);
    });

    // cộng thêm tiền ck cho từng item nếu có
    this.data.masterInfo.s5 += this.data.details[0].data.reduce((pre, item) => {
      return pre + item.thue_ck;
    }, 0);
    this.data.masterInfo.s6 += this.data.details[0].data.reduce((pre, item) => {
      return pre + item.ck;
    }, 0);
  }

  onHandleActionButton(event: { buttonId: string; data?: any; index: number }) {
    switch (event.buttonId) {
      case button.EditPriceButton.id:
        let donGia = event.data.s4 > 0 ? event.data.s4 : event.data.gia_nt;

        this.receiptDetailService.openDialogEditPrice({
          fields: [
            { label: 'Tiền chiết khấu', name: 'ck', value: this.parseValidNumber(event.data.ck) },
            { label: 'Đơn giá gốc', name: 'gia_nt', value: this.parseValidNumber(donGia), readonly: true },
            { label: 'Đơn giá điều chỉnh', name: 'gia_dc', value: 0 },
          ]
        }).subscribe((res) => {
          if (res) {
            const item = this.data.details[0].data[event.index];
            const ckField = res.find((f: { name: string; }) => f.name === 'ck');
            const giaNt = res.find((f: { name: string; }) => f.name === 'gia_nt');
            const priceAdjusment = res.find((f: { name: string; }) => f.name === 'gia_dc');
            const priceAdjusmentValue = priceAdjusment.value <= 0 ? item.gia_nt : priceAdjusment.value;

            // kiểm tra ko được lớn hơn 2 đồng
            if (Math.abs(priceAdjusmentValue - this.parseValidNumber(giaNt.value)) > 2) {
              this.commonService.showMessage('Không được điều chỉnh lớn hơn 2 đồng');
              return;
            }

            item.ck = this.parseValidNumber(ckField.value);
            item.gia_nt = this.parseValidNumber(priceAdjusment.value <= 0 ? item.gia_nt : priceAdjusment.value);
            item.s4 = this.parseValidNumber(giaNt.value);

            if (priceAdjusment.value > 0) {
              item.gc_td1 = "1";
            }

            // tính toán lại tiền
            this.calcDiscount();
            this.calcTax();
            this.calcTotal();
          }
        });
        break;
      default:
        break;
    }
  }

  parseValidNumber = (val: any) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };
}
