import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Receipt, ReceiptDetail } from '../proposed-purchase.model';
import { Button, Grid, GridType } from '@app/_components/gridV2/grid.model';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ProposedPurchaseDetailService } from './proposed-purchase-detail.service';
import { ProposedPurchaseService } from '../proposed-purchase.service';
import { StockService } from '@app/_components/lookup/stock/stock.service';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { MODE, VOUCHER_TYPE } from '../../../enum/voucher_enum';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-proposed-purchase-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ProposedPurchaseCreateComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons: Button[] = [];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  title = 'Phiếu đề nghị xin hàng';
  userName = '';

  item: ReceiptDetail = {
    line_nbr: 0,
    stt_rec0: '',
    ma_vt: '',
    ten_vt: '',
    dvt: '',
    so_luong: 0
  };

  t_so_luong = 0;
  data!: Receipt;
  statusList: StatusTicket[] = [];
  voucherCode = 'PR3';

  submitted = false;
  loading = false;

  disabled = false;
  mode = 1;
  submitButtonTitle = '';
  cancelButtonTitle = '';
  ma_cuahang = '';
  ten_cuahang = '';
  stockService2!: StockService;
  entity = VOUCHER_TYPE.PROPOSEDPURCHASE.sysid;
  isDisabled = false;
  readonly = false;

  [key: string]: any
  override gridType = GridType.GridDetail;
  actionButtons = [button.DeleteButton];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    public stockTranferDetailService: ProposedPurchaseDetailService,
    private route: ActivatedRoute,
    private router: Router,
    public customerService: CustomerService,
    public departmentService: DepartmentService,
    public transactionService: TransactionService,
    public levelService: LevelService,
    public shopService: ShopService,
    public exchangeRateService: ExchangeRateService,
    public paymentService: PaymentService,
    public itemService: ItemService,
    public stockService: StockService,
    private authenticateService: AuthenticationService,
    private imeiService: IMEIService,
    private location: Location,
    private matSnackBar: MatSnackBar,
    private proposedPurchase: ProposedPurchaseService,
    private statusVoucher: StatusVoucher,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    localStorage.setItem('useGridCached', '1');
    super(stockTranferDetailService);
    const user = authenticateService.userValue;
    this.stockService2 = new StockService(http, dialog);
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
    }
    // this.initData();
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
  calcTotal() {
    let t_so_luong = 0;
    this.data.details[0].data.forEach((item) => {
      t_so_luong += item.so_luong;
    });
    this.data.masterInfo = { ...this.data.masterInfo, t_so_luong: t_so_luong };
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
        this.stockTranferDetailService.openDialogIMEI(data).subscribe((value) => {
          if (value) {
            event.data.ma_imei = value.join(', ');
          }
        });
      }
    }
  }
  ngAfterViewInit(): void {
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly])');
    inputs[0].focus();
  }
  initData(stt_rec: string) {
    this.proposedPurchase.getItem(stt_rec).subscribe((item => {
      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      this.data = item;
      this.stockService.setItemFilter([{ name: 'ma_cuahang', operator: '=', value: this.data.masterInfo.ma_cuahang_n }]);
      this.stockService2.setItemFilter([{ name: 'ma_cuahang', operator: '=', value: this.data.masterInfo.ma_cuahang_x }]);
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang],
        ma_cuahang_x: [this.data.masterInfo.ma_cuahang_x?.trim(), Validators.required],
        ma_cuahang_n: [this.data.masterInfo.ma_cuahang_n, Validators.required],
        ma_kho: [this.data.masterInfo.ma_kho?.trim(), Validators.required],
        ma_khon: [this.data.masterInfo.ma_khon?.trim(), Validators.required],
        dien_giai: [this.data.masterInfo.dien_giai],
        t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
        detail: [this.data.details || [], Validators.required],
      });
      this.t_so_luong = this.data.details[0].data.reduce((pre, item) => { return pre += item.so_luong; }, 0);
      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
    }));
  }
  ngOnInit() {
    // check quyền truy cập
    this.commonService.processAuthorization();

    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    this.ma_cuahang = userObj['shop'];
    this.shopService.getItemByLocal(this.ma_cuahang).subscribe((item) => { this.ten_cuahang = item.ten_cuahang; });

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
    this.stockService.setItemFilter([{ name: 'ma_cuahang', operator: '=', value: this.ma_cuahang }]);
    this.statusVoucher.getStatus(this.voucherCode).subscribe(result => {
      this.statusList = result;
      if (!this.data.masterInfo.status) {
        this.data.masterInfo.status = this.statusList[0].status;
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
        ma_cuahang_n: this.ma_cuahang,
        ten_cuahang_n: this.ten_cuahang,
        t_so_luong: 0,
        t_tien_nt: 0,
        status: '0'
      },
      details: [
        {
          id: 1,
          name: 'd569',
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
      this.ticketApiService.getVoucherNumber(this.entity).subscribe(result => {
        this.data.masterInfo.so_ct = result.result as any;
        this.voucherForm = this.formBuilder.group({
          so_ct: [this.data.masterInfo.so_ct, Validators.required],
          ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
          status: [this.data.masterInfo.status, Validators.required],
          ma_cuahang: [this.data.masterInfo.ma_cuahang_n],
          ma_cuahang_x: [this.data.masterInfo.ma_cuahang_x?.trim(), Validators.required],
          ma_cuahang_n: [this.data.masterInfo.ma_cuahang_n, Validators.required],
          ma_kho: [this.data.masterInfo.ma_kho, Validators.required],
          ma_khon: [this.data.masterInfo.ma_khon, Validators.required],
          dien_giai: [this.data.masterInfo.dien_giai],
          t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
          detail: [this.data.details || [], Validators.required],
        });
      });
      this.ticketApiService.getVoucherDate().subscribe(result => {
        this.data.masterInfo.ngay_ct = result?.result as any || Date();
      });
    }
    else {
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
      ma_cuahang: [this.data.masterInfo.ma_cuahang_n],
      ma_cuahang_x: [this.data.masterInfo.ma_cuahang_x?.trim(), Validators.required],
      ma_cuahang_n: [this.data.masterInfo.ma_cuahang_n, Validators.required],
      ma_kho: [this.data.masterInfo.ma_kho, Validators.required],
      ma_khon: [this.data.masterInfo.ma_khon, Validators.required],
      dien_giai: [this.data.masterInfo.dien_giai],
      t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
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
    // let all_imei: string[] = [];
    // this.data.details[0].data.forEach((detail) => {
    //   if (detail.ma_imei) {
    //     all_imei = [...all_imei, ...detail.ma_imei.split(',').map((item: string) => item.trim())];
    //   }
    // });
    // if (this.checkDuplicateIMEI(all_imei) !== '') {
    //   this.matSnackBar.open(this.checkDuplicateIMEI(all_imei), 'Đóng', {
    //     duration: 2000,
    //   });
    //   return;
    // }

    //set ma_cuahang là mã cửa hàng nhập
    this.data.masterInfo.ma_cuahang = this.data.masterInfo.ma_cuahang_n;

    this.loading = true;
    this.disabled = true;
    this.isDisabled = true;
    if (this.mode == MODE.UPDATE) {
      this.proposedPurchase.update(this.data).subscribe((item: any) => {
        this.loading = false;
        this.disabled = false;
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
      this.proposedPurchase.create(this.data).subscribe((item: any) => {
        this.loading = false;
        this.disabled = false;
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
    const old_value = this.data.masterInfo[controlName];
    this.data.masterInfo[controlName] = $event;
    this.f[controlName].setValue($event);
    if (controlName === 'ma_cuahang_x') {
      this.stockService2.setItemFilter([{ name: 'ma_cuahang', operator: '=', value: $event }]);
      if (old_value.trim() !== $event) this.f['ma_kho'].setValue('');
    }
  }
  onDelete() {
    console.log('onDelete');
  }

  onCancel() {
    this.router.navigate(['voucher/proposed-purchase']);
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
  onEnterItem($event: any) {
    if ($event) {
      $event.preventDefault();
    }
    if (this.item.ma_vt != '' && this.item.so_luong != 0) {
      this.addItem();
      this.calcTotal();
      this.item = {
        line_nbr: 0,
        stt_rec0: '',
        ma_vt: '',
        ten_vt: '',
        dvt: '',
        so_luong: 0
      };
    }
    else {
      if (this.item.ma_vt == '') {
        this.commonService.showMessageByName('lblWarningInvalidItem');
      }
      else if (this.item.so_luong == 0) {
        this.commonService.showMessageByName('lblWarningInvalidQuantity');
      }
    }
  }
  addItem() {
    this.item.line_nbr = this.data.details[0].data.length + 1;
    this.data.details[0].data.push(this.item);
    this.dataSource.data = this.data.details[0].data;
  }
  handleInputLookupChange($event: any, name: string): void {
    if (name == 'ma_vt') {
      $event.forEach((item: any) => {
        this.item[item.control] = item.value;
        this[item.control] = item.value;
        this.data.masterInfo[item.control] = item.value;
        if (this.f[item.control]) {
          this.f[item.control].setValue(item.value);
        }
      });
    }
    $event.forEach((item: any) => {
      this[item.control] = item.value;
      this.data.masterInfo[item.control] = item.value;
      if (this.f[item.control]) {
        this.f[item.control].setValue(item.value);
      }
    });

  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }
  // addIMEI(imei: string) {
  //   const ma_vt = this.f['item_code'].value.trim();
  //   const item = this.data.details[0].data.find((item) => { return item.ma_vt.trim() == ma_vt.trim(); });
  //   let all_imei: string[] = [];
  //   this.data.details[0].data.forEach((detail) => {
  //     if (detail.ma_imei) {
  //       all_imei = [...all_imei, ...detail.ma_imei.split(',').map((item: string) => item.trim())];
  //     }
  //   });
  //   let list_imei: string[] = [];
  //   if (ma_vt && item) {
  //     if (item.ma_imei) {
  //       list_imei = item.ma_imei.split(',');
  //       list_imei = list_imei.map((item: any) => {
  //         return item.trim();
  //       });
  //       if (list_imei.length >= item.so_luong) {
  //         this.matSnackBar.open(`Mã vật tư ${item.ma_vt} đã đủ imei. Vui lòng kiểm tra lại`, 'Đóng', {
  //           duration: 2000,
  //         });
  //         return false;
  //       }
  //     }

  //     this.imeiService.getListImeiInfo([imei]).subscribe((res) => {
  //       if (res.success && res.result) {
  //         const map = new Map();
  //         map.set('exists_yn', true);
  //         map.set('in_store_yn', true);
  //         map.set('xuat_yn', false);
  //         map.set('dieu_chuyen_yn', false);
  //         map.set('dat_hang_yn', false);
  //         const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
  //         if (message) {
  //           this.matSnackBar.open(this.imeiService.GetMessageStatusImei(map, res.result[0]), 'Đóng', {
  //             duration: 2000,
  //           });
  //           return false;
  //         }
  //       }
  //       if (all_imei.length !== 0) {
  //         if (all_imei.find((item: any) => { return item === imei; })) {
  //           this.matSnackBar.open(`IMEI ${imei} đã tồn tại trên chi tiết. Vui lòng kiểm tra lại`, 'Đóng', {
  //             duration: 2000,
  //           });
  //           return false;
  //         }
  //         else {
  //           list_imei = [...list_imei, imei];
  //           this.imei = '';
  //           this.f['imei'].setValue('');
  //         }
  //       } else {
  //         list_imei = [imei];
  //         this.imei = '';
  //         this.f['imei'].setValue('');
  //       }
  //       item.ma_imei = list_imei.join(', ');
  //       return true;
  //     });
  //     return false;
  //   }
  //   else {
  //     this.matSnackBar.open('Mã vật tư chưa nhập hoặc nhập không đúng', 'Đóng', {
  //       duration: 2000,
  //     });
  //     return false;
  //   }
  // }
}
