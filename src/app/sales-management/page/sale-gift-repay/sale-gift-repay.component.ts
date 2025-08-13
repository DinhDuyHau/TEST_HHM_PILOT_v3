import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleGiftRepayService } from './sale-gift-repay.service';
import { Merchandise, GiftRepaySaleTicketCreate } from '@app/sales-management/model/ticket/sale-gift-repay/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../component/search/serach-dialog.component';
import { CustomerCreateDialogComponent } from '../../component/customer/customer-create-dialog/customer-create-dialog.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { MODE, STATUS_LIST } from '@app/sales-management/enum/ticket.enum';
import { CommonService } from '../common/common.service';
import { MerchandiseService } from '../common/merchandise.service';
import { DiscountService } from '../common/discount.service';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { EInvoiceInfo } from '@app/sales-management/model/dto/einvoice.dto';

const { MERCHANDISE_LIST_IN_GIFT_REPAY } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-gift-repay',
  templateUrl: './sale-gift-repay.component.html',
  styleUrls: ['./sale-gift-repay.component.scss'],
})
export class SaleGiftRepayComponent implements OnInit, AfterViewInit {
  ticket: GiftRepaySaleTicketCreate = new GiftRepaySaleTicketCreate;
  statusList: StatusTicket[] = [];
  disableSelectStatus = true;
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_LIST_IN_GIFT_REPAY;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    ma_kh: 'ma_kh',
    nvvc: 'nvvc',
    imei: 'imei',
  };
  previewImage = '';
  tabIndexFocusFirst = 'ma_kh';
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  entity = TICKET_ENTITY.GIFT_REPAY;
  ma_imei = '';
  invoice_model_status = '0';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleGiftRepayService: SaleGiftRepayService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private discountService: DiscountService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleGiftRepayService.setTicket(this.ticket);
  }

  get tabList() {
    return [
      { label: 'Hàng hoá', count: this.ticket?.merchandise?.length ?? 0 },
      { label: 'HĐĐT' }
    ];
  }

  ngAfterViewInit(): void {
    // this.commonService.focusControl(this.tabIndexFocusFirst);
  }

  ngOnInit() {
    // check quyền truy cập
    this.commonService.processAuthorization();

    this.route.url.subscribe(urlSegment => {
      const path = urlSegment[0].path;
      if (urlSegment[0].path) {
        switch (path) {
          case 'create':
            this.title = Language.content.add_new;
            this.disableSelectStatus = true;
            this.mode = MODE.CREATE;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            break;
          case 'update':
            this.title = Language.content.edit;
            this.mode = MODE.UPDATE;
            this.disableSelectStatus = false;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            break;
          case 'view':
            this.title = Language.content.view;
            this.mode = MODE.VIEW;
            this.readonly = true;
            this.cancelButtonTitle = Language.content.exit;
            break;
        }
      }
    });
    const getStatusList = () => {
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.GIFT_REPAY }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.disableSelectStatus = false;
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.GIFT_REPAY, data.key).subscribe((result) => {
          if (result.result) {
            //set status để xử lý vấn đề in ngay trên màn hình xem chứng từ
            this.invoice_model_status = (result.result as any).masterInfo.status;

            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_GIFT_REPAY.CREATE) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.saleGiftRepayService.loadData(result.result as any as VoucherDto);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.tabIndexFocusFirst = this.tabIndex.imei;
            this.commonService.getPointRateExchange(this.ticket);
          }
        });
      } else {
        this.disableSelectStatus = true;
        this.saleGiftRepayService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
      }
    });


  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.commonService.focusControl2(this.tabIndex.nvvc);
    this.saleGiftRepayService.setInfoCustomer(customer);
    this.saleGiftRepayService.calcMoney();
  }

  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleGiftRepayService.resetCustomerInfo(this.ticket);
        this.openAddCustomerDialog(ma_kh);
      }
    });
  }

  openSearchCustomerDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER, title: this.getLabel('tlt_customer_list') }, 'search-style-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => customer && this.handleAddCustomer(customer));
  }
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleGiftRepayService.setInfoCustomer(customer);
      });
  }
  //#endregion

  // #region imei
  handleAddImei(merchandiseResponse: any) {
    const merchandise = this.merchandiseService.getMerchandiseNotHaveImei(merchandiseResponse.ma_vt, this.ticket.merchandise);
    merchandise && (merchandise.ma_imei = merchandiseResponse.ma_imei) && (merchandise.ma_kho = merchandiseResponse.ma_kho);
    this.commonService.clearText2([this.tabIndex.imei]);
    this.commonService.focusControl2(this.tabIndex.imei);
  }

  onEnterImeiCode(ma_imei: string) {
    if (!this.ticket.masterInfo.ma_kh || this.ticket.masterInfo.ma_kh === '') {
      this.commonService.showMessage('Cần nhập mã khách trước khi nhập imei');
      return;
    }

    if (!ma_imei || ma_imei.length < 5) {
      this.commonService.showMessage('Imei cần ít nhất 5 ký tự để tìm kiếm');
      return;
    }

    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleGiftRepayService.getImeiInStore(ma_imei, ngay_ct).subscribe(result => {
      if (result.success && result.result.length) {
        if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
          return;
        }
        const merchandise = result.result[0];
        const isExistsMerchandise = this.merchandiseService.getMerchandiseByMaVT(merchandise.ma_vt, this.ticket.merchandise);
        if (isExistsMerchandise) {
          this.handleAddImei(merchandise);
          // this.imeiApiService.updateImeiState([ma_imei], true).subscribe(result => {
          //   if (result.success && result.result[0].dat_hang_yn) {
          //     this.handleAddImei(merchandise);
          //     this.commonService.addImeiToStorage(ma_imei);
          //   }
          // });
        } else {
          this.commonService.showMessageByName('lblWarningNotExistItemInDetail');
        }
      } else {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.commonService.openDialog(SearchDialogComponent, {
          keyword: ma_imei,
          shop: user.shop,
          componentName: SEARCH_COMPONENT_NAME.IMEI_SEARCH_SALES,
        }, 'search-style-dialog')
          .afterClosed().subscribe(result => {
            if (result && result.ma_imei) {
              this.ma_imei = result.ma_imei;
              this.handleProcessImei(result.ma_imei);
            }
          });
      }
    });
  }

  onClickCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiCode(result);
    });
  }

  // #endregion imei

  // #region lọc hóa đơn
  openInvoiceByCustomerDialog() {
    if (!this.ticket.masterInfo.ma_kh) {
      this.commonService.showMessageByName('lblWarningNotValidCustomer');
      return;
    } else {
      this.commonService.openDialog(SearchDialogComponent,
        { keyword: this.ticket.masterInfo.ma_kh, componentName: SEARCH_COMPONENT_NAME.INVOICE, title: this.getLabel('lbl_list_invoice') }, 'search-style-dialog')
        .afterClosed()
        .subscribe((result: any) => {
          if (result) {
            const isExists = this.ticket.merchandise.find(mer => (mer.stt_rec_hd === result.stt_rec) && (mer.stt_rec0_hd === result.stt_rec0));

            if (!isExists) {
              result.so_luong = result.sl_ban;
              result.stt_rec_hd = result.stt_rec;
              result.stt_rec0_hd = result.stt_rec0;
              result.so_ct_hd = result.so_ct;
              this.merchandiseService.addNew(result, this.ticket.merchandise, Merchandise);
              this.saleGiftRepayService.calcMoney();
            }
          }
        }
        );
    }

  }
  // #endregion lọc hóa đơn

  // #region merchandise

  onRemoveMerchandise(event: { item: Merchandise }) {
    this.saleGiftRepayService.removeMerchandise(event.item);
  }

  // #endregion merchandise

  //Upload image
  openUploadImage() {
    this.commonService.openDialog(CameraComponent, {}, 'camera-style').afterClosed().subscribe(result => {
      this.previewImage = result;
    });
  }

  // Open Image
  openImage() {
    if (!this.previewImage) {
      this.commonService.showMessage(Language.content.No_image);
      return;
    }
    this.commonService.openDialog(ViewImageComponent, { imageUrl: this.previewImage }, '', false).afterClosed().subscribe(result => {
      // console.log("result: ", result);
    });
  }

  // Submit
  onSave() {
    //Check imei trùng trong grid chi tiết
    const mechandise_dup = [];
    const counter: { [key: string]: number } = {};
    for (const item of this.ticket.merchandise) {
      counter[item.ma_imei] = (counter[item.ma_imei] || 0) + 1;
      if (counter[item.ma_imei] > 1) {
        mechandise_dup.push(item.ma_imei);
      }
    }
    if (mechandise_dup && mechandise_dup.length > 0) {
      const duplicate_imeis = mechandise_dup.join(',');
      this.commonService.showMessage(`Các imei xuất hiện nhiều lần trong chi tiết phiếu: ${duplicate_imeis}`);
      return;
    }

    const message = this.saleGiftRepayService.validateTicket(this.ticket);
    this.invalid = !this.ticket.masterInfo.ma_kh;
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);

    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleGiftRepayService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.GIFT_REPAY, voucherDto).subscribe(result => {
            if (result.success) {
              this.isSaving = false;
              this.isDisabled = false;
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Update_Completed);
              this.router.navigate(['sales/gift-repay']);
            } else {
              this.commonService.handleResponseErrorVoucher(result, 'sales/gift-repay');
            }
          });
        } else if (this.mode === MODE.CREATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.GIFT_REPAY, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/gift-repay']);
            } else {
              this.commonService.handleResponseErrorVoucher(result, 'sales/gift-repay');
            }
          });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['sales/gift-repay']);
    // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/gift-repay']);
    //     } else {
    //       this.commonService.showMessage('Lỗi update state của hàng hóa');
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/gift-repay']);
    // }

  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  handleProcessImei(ma_imei: string) {
    this.ma_imei = ma_imei;

    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleGiftRepayService.getImeiInStore(this.ma_imei, ngay_ct).subscribe(result => {
      if (result.success && result.result.length) {
        if (this.merchandiseService.checkImeiExistMerchandise(this.ma_imei, this.ticket.merchandise)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: this.ma_imei });
          return;
        }
        const merchandise = result.result[0];
        const isExistsMerchandise = this.merchandiseService.getMerchandiseByMaVT(merchandise.ma_vt, this.ticket.merchandise);
        if (isExistsMerchandise) {
          this.handleAddImei(merchandise);
        } else {
          this.commonService.showMessageByName('lblWarningNotExistItemInDetail');
        }
      } else {
        this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: this.ma_imei });
      }
    });
  }
}



