import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Receipt, ReceiptDetail } from '../internal-purchase.model';
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
import { PaymentService } from '@app/_components/lookup/payment/payment.service';
import { ItemService } from '@app/_components/lookup/item/item.service';
import { IMEIService } from '@app/_services/imei.service';
import button from '@app/_common/button';
import { InternalPurchaseDetailService } from './internal-purchase-detail.service';
import { InternalPurchaseService } from '../internal-purchase.service';
import { StockService } from '@app/_components/lookup/stock/stock.service';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { MODE, VOUCHER_TYPE } from '../../../enum/voucher_enum';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { getDateFormat } from '@app/_common/commonFunction';

@Component({
  selector: 'internal-purchase-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class InternalPurchaseCreateComponent extends Grid<ReceiptDetail> implements OnInit, AfterViewInit {
  // buttonsCustom!: Button[];
  override buttons = [button.LockingColumnButton, button.EditIMEIButton];
  @ViewChild('form') form!: ElementRef;
  @ViewChild('btnSubmit') btnSubmit!: ElementRef;
  voucherForm!: FormGroup;
  titleHeader = 'Phiếu nhập mua nội bộ';
  userName = '';
  item_code = '';
  t_so_luong = 0;
  imei = '';
  data!: Receipt;

  statusList: StatusTicket[] = [];
  voucherCode = 'PNN';

  submitted = false;
  loading = false;

  disabled = false;
  mode = 1;
  title = '';
  submitButtonTitle = '';
  cancelButtonTitle = '';
  isDisabled = false;
  readonly = false;
  entity = VOUCHER_TYPE.INTERNAL_PURCHASE.sysid;


  override gridType = GridType.GridDetail;
  constructor(
    private formBuilder: FormBuilder,
    public internalPurchaseDeatailService: InternalPurchaseDetailService,
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
    private internalPurchaseService: InternalPurchaseService,
    private statusVoucher: StatusVoucher,
    private el: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonService
  ) {
    localStorage.setItem('useGridCached', '1');
    super(internalPurchaseDeatailService);
    const user = authenticateService.userValue;
    if (user !== null && user.username !== undefined && user.shop) {
      this.userName = user.username;
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
        this.internalPurchaseDeatailService.openDialogIMEI(data).subscribe((value) => {
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
    this.internalPurchaseService.getItem(stt_rec).subscribe((item => {
      item.masterInfo.ngay_ct = item.masterInfo.ngay_ct?.substring(0, 10);
      item.masterInfo.ngay_ct0 = item.masterInfo.ngay_ct0?.substring(0, 10);
      // item.details[0].data.forEach((res) => {
      //   if (res.ma_imei) {
      //     res.ma_imei = res.ma_imei.split(',');
      //     res.ma_imei = res.ma_imei.map((item: any) => {
      //       return item.trim();
      //     });
      //   }
      // });

      this.data = item;
      this.voucherForm = this.formBuilder.group({
        so_ct: [this.data.masterInfo.so_ct, Validators.required],
        ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
        status: [this.data.masterInfo.status, Validators.required],
        ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
        ma_cuahang_x: [this.data.masterInfo.ma_cuahang_x, Validators.required],
        ma_gd: [this.data.masterInfo.ma_gd, Validators.required],
        ma_kho: [this.data.masterInfo.ma_kho?.trim(), Validators.required],
        ma_khox: [this.data.masterInfo.ma_khox?.trim(), Validators.required],
        dien_giai: [this.data.masterInfo.dien_giai],
        t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
        so_ct0: [this.data.masterInfo.so_ct0, Validators.required],
        so_seri0: [this.data.masterInfo.so_seri0, Validators.required],
        ngay_ct0: [this.data.masterInfo.ngay_ct0, Validators.required],
        item_code: [this.item_code],
        imei: [this.imei],
        detail: [this.data.details || [], Validators.required],
      });
      this.t_so_luong = this.data.details[0].data.reduce((pre, item) => { return pre += item.so_luong; }, 0);
      this.dataSource = new MatTableDataSource<ReceiptDetail>(this.data.details[0].data);
    }));
    // this.data = {
    //   dien_giai: 'test nhu cau 444',
    //   stt_rec: 'H00000001EPXB',
    //   ma_ct: 'PXB',
    //   so_ct: '0004',
    //   ngay_ct: '2023-05-04T00:00:00+07:00'.substring(0, 10),
    //   ma_dvcs: '001',
    //   ma_cuahang: 'HN001',
    //   ma_ca: '01',
    //   status: '0',
    //   ma_gd: '',
    //   ma_kho: '00000TEST',
    //   ma_khon: '01',
    //   t_so_luong: 30,
    //   details: [
    //     {
    //       stt_rec0: '001',
    //       line_nbr: 1,
    //       ma_vt: '1024VN',
    //       ten_vt: 'MTXT MSI Modern 15 A11M-1024VN, i5-1155G7/8GB/512GB/15.6FHD/Win10/Carbon Gray',
    //       dvt: 'bộ',
    //       so_luong: 10
    //     },
    //     {
    //       stt_rec0: '002',
    //       line_nbr: 2,
    //       ma_vt: '1030VN',
    //       ten_vt: 'MTXT MSI Modern 14 B11MOU-1030VN, i3-1115G4/8GB/256GB/14FHD/WIN11/Xám',
    //       dvt: 'bộ',
    //       so_luong: 20
    //     }
    //   ]
    // };
  }
  ngOnInit() {
    // check quyền truy cập
    this.commonService.processAuthorization();

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
        ma_ct: 'PXB',
        so_ct: '0004',
        ngay_ct: getDateFormat(new Date()),
        ma_dvcs: '001',
        ma_ca: '01',
        status: '0'
      },
      details: [
        {
          id: 'd591',
          name: '',
          data: []
        }
      ]
    };
    this.route.queryParams.subscribe((params: any) => {
      if (params['key']) {
        this.initData(params['key']);
      }
      // console.log(Object.keys(params).map(key => ({ key, value: params[key] })));
    });

    this.voucherForm = this.formBuilder.group({
      so_ct: [this.data.masterInfo.so_ct, Validators.required],
      ngay_ct: [this.data.masterInfo.ngay_ct, Validators.required],
      status: [this.data.masterInfo.status, Validators.required],
      ma_cuahang: [this.data.masterInfo.ma_cuahang, Validators.required],
      ma_cuahang_x: [this.data.masterInfo.ma_cuahang_x, Validators.required],
      ma_gd: [this.data.masterInfo.ma_gd, Validators.required],
      ma_kho: [this.data.masterInfo.ma_kho, Validators.required],
      ma_khox: [this.data.masterInfo.ma_khox, Validators.required],
      dien_giai: [this.data.masterInfo.dien_giai],
      t_so_luong: [this.data.masterInfo.t_so_luong, Validators.required],
      so_ct0: [this.data.masterInfo.so_ct0, Validators.required],
      so_seri0: [this.data.masterInfo.so_seri0, Validators.required],
      ngay_ct0: [this.data.masterInfo.ngay_ct0, Validators.required],
      item_code: [this.item_code],
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
      this.commonService.showMessageByName('lblWarningLackInformation');
      return;
    }
    if (this.data.masterInfo.so_seri0?.trim() !== this.data.masterInfo.so_seri0_xuat?.trim()
      || this.data.masterInfo.so_ct0?.trim() !== this.data.masterInfo.so_ct0_xuat?.trim()
      || this.data.masterInfo.ngay_ct0?.trim() !== this.data.masterInfo.ngay_ct0_xuat?.trim().substring(0, 10)) {
      this.commonService.showMessageByName('lblWarningInvoiceIncorrect');
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

      this.internalPurchaseService.update(this.data).subscribe((item: any) => {
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
    this.router.navigate(['voucher/internal-purchase']);
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

    const imei = $event.target.value;
    if (imei) {
      const flag = this.addIMEI(imei);
      if (flag)
        this.imei = '';
    }
    else {
      this.commonService.showMessageByName('lblWarningLackIMEI');
    }
  }
  addIMEI(imei: string) {
    this.imeiService.getListImeiInfo([imei]).subscribe((res) => {
      if (!(res.success && res.result)) {
        this.commonService.showMessage(res.message);
        return false;
      }
      const map = new Map();
      map.set('exists_yn', true);
      map.set('in_store_yn', false);
      map.set('xuat_yn', true);
      map.set('dieu_chuyen_yn', true);
      map.set('dat_hang_yn', false);
      const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
      if (message) {
        this.commonService.showMessage(this.imeiService.GetMessageStatusImei(map, res.result[0]));
        return false;
      }
      const imei_info = res.result[0];
      const item = this.data.details[0].data.find((item) => { return item.ma_vt.trim() == imei_info.ma_vt.trim(); });
      if (!item) {
        this.commonService.showMessageByName('lblWarningNotValidItem');
        return false;
      }
      let all_imei: string[] = [];
      this.data.details[0].data.forEach((detail) => {
        if (detail.ma_imei) {
          all_imei = [...all_imei, ...detail.ma_imei.split(',').map((item: string) => item.trim())];
        }
      });
      let list_imei: string[] = [];
      if (item.ma_imei) {
        list_imei = item.ma_imei.split(',');
        list_imei = list_imei.map((item: any) => {
          return item.trim();
        });

        if (list_imei.length >= item.so_luong) {
          this.commonService.showMessageByNameAdvance('lblWarningEnoughImei', { name: '%ma_vt', value: item.ma_vt });
          return false;
        }
        if (!item.ma_imei_xuat) {
          this.commonService.showMessageByNameAdvance('lblWarningNotExistImeiExport', { name: '%ma_vt', value: item.ma_vt });
          return false;
        }
        else {
          let list_imei_xuat: string[] = item.ma_imei_xuat.split(',');
          list_imei_xuat = list_imei_xuat.map((item: any) => {
            return item.trim();
          });
          if (!list_imei_xuat.find(item => item === imei)) {
            this.commonService.showMessageByNameAdvance('lblWarningNotExistImeiItemExport', { name: '%ma_vt', value: item.ma_vt }, { name: '%imei', value: imei });
            return false;
          }
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
  // addIMEI2(imei: string) {
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
  //         this.commonService.showMessageByNameAdvance('lblWarningEnoughImei', { name: '%ma_vt', value: item.ma_vt });
  //         return false;
  //       }
  //     }
  //     if (!item.ma_imei_xuat) {
  //       this.commonService.showMessageByNameAdvance('lblWarningNotExistImeiExport', { name: '%ma_vt', value: item.ma_vt });
  //       return false;
  //     }
  //     else {
  //       let list_imei_xuat: string[] = item.ma_imei_xuat.split(',');
  //       list_imei_xuat = list_imei_xuat.map((item: any) => {
  //         return item.trim();
  //       });
  //       if (!list_imei_xuat.find(item => item === imei)) {
  //         this.commonService.showMessageByNameAdvance('lblWarningNotExistImeiItemExport', { name: '%imei', value: imei }, { name: '%ma_vt', value: item.ma_vt });
  //         return false;
  //       }
  //     }

  //     this.imeiService.getListImeiInfo([imei]).subscribe((res) => {
  //       if (res.success && res.result) {
  //         const map = new Map();
  //         map.set('exists_yn', true);
  //         map.set('in_store_yn', false);
  //         map.set('xuat_yn', true);
  //         map.set('dieu_chuyen_yn', true);
  //         map.set('dat_hang_yn', false);
  //         const message = this.imeiService.GetMessageStatusImei(map, res.result[0]);
  //         if (message) {
  //           this.commonService.showMessage(this.imeiService.GetMessageStatusImei(map, res.result[0]));
  //           return false;
  //         }
  //       }
  //       if (all_imei.length !== 0) {
  //         if (all_imei.find((item: any) => { return item === imei; })) {
  //           this.commonService.showMessageByNameAdvance('lblWarningExistImei', { name: '%imei', value: imei });
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
  //     this.commonService.showMessageByName('lblWarningNotValidItem');
  //     return false;
  //   }
  // }
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
