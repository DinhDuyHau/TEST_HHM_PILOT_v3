import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleChangeService } from './sale-change.service';
import { Merchandise, ChangeSaleTicket, ServiceChange } from '@app/sales-management/model/ticket/sale-change/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../component/search/serach-dialog.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { MODE, STATUS_LIST } from '@app/sales-management/enum/ticket.enum';
import { CommonService } from '../common/common.service';
import { MerchandiseService } from '../common/merchandise.service';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { GuaranteeApiService } from '@app/sales-management/api/guarantee-api.service';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { DeliveryEmployeeApiService } from '@app/sales-management/api/delivery-employee-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { EInvoiceInfo } from '@app/sales-management/model/dto/einvoice.dto';
import { CustomerCreateDialogComponent } from '@app/sales-management/component/customer/customer-create-dialog/customer-create-dialog.component';
import { ServiceOfMerchandiseService } from '../common/service.service';

const { GUARANTEE_LIST, MERCHANDISE_CHANGE, SERVICE_CHANGE_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-change',
  templateUrl: './sale-change.component.html',
  styleUrls: ['./sale-change.component.scss'],
})
export class SaleChangeComponent implements OnInit, AfterViewInit {
  ticket: ChangeSaleTicket = new ChangeSaleTicket;
  statusList: StatusTicket[] = [];
  disableSelectStatus = true;
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_CHANGE;
  guaranteeColumns = GUARANTEE_LIST;
  serviceColumns = SERVICE_CHANGE_LIST;
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
    imei_return: 'imei_return',
    imei_change: 'imei_change',
    ma_vt: 'ma_vt'
  };
  previewImage = '';
  tabIndexFocusFirst = 'ma_kh';
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  entity = TICKET_ENTITY.CHANGE;
  ma_imei_doi = '';

  tab_sources: any[] = [
    { label: 'Hàng dổi', name: 'merchandise_change' },
    { label: 'Hàng trả', name: 'merchandise_return' },
    { label: 'Đổi kèm dịch vụ', name: 'service' },
    { label: 'HĐĐT', name: null }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleChangeService: SaleChangeService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private deliveryEmployeeApiService: DeliveryEmployeeApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private guaranteeApiService: GuaranteeApiService,
    private serviceOfMerchandiseService: ServiceOfMerchandiseService,
    private imeiApiService: ImeiApiService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleChangeService.setTicket(this.ticket);
  }

  // get tabList() {
  //   return [
  //     { label: 'Hàng đổi', count: this.ticket?.merchandise_change?.length ?? 0 },
  //     { label: 'Hàng trả', count: this.ticket?.merchandise_return?.length ?? 0 },
  //     { label: 'Đổi kèm dịch vụ', count: this.ticket?.service?.length ?? 0 },
  //     { label: 'HĐĐT' }
  //   ];
  // }

  ngAfterViewInit(): void {
    // this.commonService.focusControl(this.tabIndexFocusFirst);
  }

  ngOnInit() {
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.CHANGE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.CHANGE, data.key).subscribe((result) => {
          if (result.result) {
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_CHANGE.CREATE) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            getStatusList();
            this.saleChangeService.loadData(result.result as any as VoucherDto);
            this.tabIndexFocusFirst = this.tabIndex.imei_return;
            this.commonService.getPointRateExchange(this.ticket);
          }
        });
      } else {
        this.disableSelectStatus = true;
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
        this.saleChangeService.initTicket(this.ticket);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.saleChangeService.setInfoCustomer(customer);
    this.saleChangeService.calcMoney();
  }

  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleChangeService.resetCustomerInfo(this.ticket);
        this.openAddCustomerDialog(ma_kh);
      }
    });
  }

  openSearchCustomerDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER })
      .afterClosed()
      .subscribe((customer: Customer) => customer && this.handleAddCustomer(customer));
  }

  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleChangeService.setInfoCustomer(customer);
      });
  }
  //#endregion

  // #region Guarantee
  handleAddGuarantee(merchandiseResponse: any) {
    this.guaranteeApiService.getOneById(TICKET_ENTITY.RETAIL, { ma_vt: merchandiseResponse.ma_vt, ma_kho: merchandiseResponse.ma_kho }).subscribe(result => {
      if (result && result.success && result?.result?.length) {
        const guarantee = result.result[0];
        this.saleChangeService.addGuaranteeMerchandise(merchandiseResponse, guarantee);
      }
    });
  }

  // #endregion Guarantee

  // #region imei
  handleAddImei(merchandiseResponse: any, return_or_change: Merchandise[]) {
    this.merchandiseService.addNew(merchandiseResponse, return_or_change, Merchandise);
    this.commonService.clearText2([this.tabIndex.imei_change]);
    this.saleChangeService.calcMoney();
  }

  onEnterImeiReturnCode(ma_imei: string) {
    if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise_return)) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
      return;
    }
    if (this.ticket.merchandise_return.length > 0) {
      this.commonService.showMessageByName('lbl_invalid_merchandise_return_change');
      return;
    }
    // if (!this.ticket.masterInfo.ma_kh || this.ticket.masterInfo.ma_kh === '') {
    //   this.commonService.showMessage('Cần nhập mã khách trước khi nhập imei');
    //   return;
    // }
    this.saleChangeService.getSoldInfoChangeItem(ma_imei).subscribe((result: any) => {
      if (result && result.success && result.result && result.result.details) {
        if (!this.ticket.masterInfo.ma_kh) {
          this.onEnterCustomerCode(result.result.masterInfo.ma_kh);
        }

        const merchandise = result.result.details[0].data;
        const service = result.result.details[1].data;
        const src_merchandise = merchandise.filter((x: any) => x.ma_imei.toLowerCase().trim() === ma_imei.toLowerCase().trim());
        src_merchandise.forEach((x: any) => x.stt_rec_dh = x.stt_rec);

        //kiểm tra thỏa mãn chính sách trả lại vật tư
        if (src_merchandise && src_merchandise[0] && !src_merchandise[0].nhap_tra_lai_yn) {
          this.commonService.showMessage('Imei không thỏa mãn chính sách trả lại');
          return;
        }

        this.merchandiseService.convertFromVoucher(src_merchandise, this.ticket.merchandise_return, Merchandise);
        this.serviceOfMerchandiseService.convertFromVoucher(service.filter((x: any) => x.ma_imei.trim() === ma_imei.trim()), this.ticket.service);
        this.ticket.service.forEach(x => {
          x.ma_imei_tra = ma_imei;
          x.gia_ck = 0;
          x.gia_ban = 0;
          x.tien_ck = 0;
          x.tien_thue = 0;
          x.tong_tien = 0;
          x.thanh_tien = 0;
        });
        if (this.ticket.merchandise_change && this.ticket.merchandise_change.length) {
          this.ticket.service.forEach(x => x.ma_imei_doi = this.ticket.merchandise_change[0].ma_imei);
        }
        this.commonService.clearText2([this.tabIndex.imei_return]);
        this.commonService.focusControl2(this.tabIndex.imei_return);
        this.saleChangeService.calcMoney();
        // this.imeiApiService.updateImeiState([ma_imei], true, 1).subscribe(result => {
        //   if (result.success && result.result[0].dat_hang_yn) {
        //     this.merchandiseService.convertFromVoucher(merchandise, this.ticket.merchandise_return, Merchandise);
        //     this.commonService.clearText([this.tabIndex.imei_return]);
        //     this.saleChangeService.calcMoney();
        //     this.commonService.addImeiToStorage(ma_imei);
        //   }
        // });
      } else {
        this.commonService.showMessageByName('lblWarningNotExistItem');
      }
    });
  }

  onEnterImeiChangeCode(ma_imei: string) {
    if(this.ticket.merchandise_return.length == 0) {
      this.commonService.showMessage('Cần nhập IMEI trả trước khi nhập IMEI đổi');
      return;
    }
    if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise_change)) {
      this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
      return;
    }
    if (this.ticket.merchandise_change.length > 0) {
      this.commonService.showMessageByName('lbl_invalid_merchandise_return_change');
      return;
    }
    if (!this.ticket.masterInfo.ma_kh || this.ticket.masterInfo.ma_kh === '') {
      this.commonService.showMessage('Cần nhập mã khách trước khi nhập imei');
      return;
    }
    if (!ma_imei || ma_imei.length < 5) {
      this.commonService.showMessage('Imei cần ít nhất 5 ký tự để tìm kiếm');
      return;
    }

    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleChangeService.getImeiInStore(ma_imei, ngay_ct).subscribe(result => {
      if (result && result.success && result.result.length) {
        const merchandise = result.result[0];
        this.handleAddImei(merchandise, this.ticket.merchandise_change);
        this.ticket.service.forEach(item => item.ma_imei_doi = ma_imei);
        // this.handleAddGuarantee(merchandise);
        // this.imeiApiService.updateImeiState([ma_imei], true).subscribe(result => {
        //   if (result.success && result.result[0].dat_hang_yn) {
        //     this.handleAddImei(merchandise, this.ticket.merchandise_change);
        //     this.handleAddGuarantee(merchandise);
        //     this.commonService.addImeiToStorage(ma_imei);
        //   }
        // });
      } else {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.commonService.openDialog(SearchDialogComponent, {
          keyword: ma_imei,
          shop: user.shop,
          componentName: SEARCH_COMPONENT_NAME.IMEI_SEARCH_SALES,
        }, 'search-style-dialog')
          .afterClosed().subscribe(result => {
            if (result && result.ma_imei) {
              this.ma_imei_doi = result.ma_imei;
              this.handleProcessImei(this.ma_imei_doi);
            }
          });
      }
    });
  }

  onClickReturnCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiReturnCode(result);
    });
  }

  onClickChangeCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiChangeCode(result);
    });
  }

  // #endregion imei

  // #region merchandise
  onRemoveMerchandiseReturn(event: { item: Merchandise }) {
    this.saleChangeService.removeMerchandiseReturn(event.item);
  }

  onRemoveMerchandiseChange(event: { item: Merchandise }) {
    this.saleChangeService.removeMerchandiseChange(event.item);
  }

  //Upload image
  openUploadImage() {
    this.commonService.openDialog(CameraComponent, {}, 'camera-style').afterClosed().subscribe(result => {
      this.previewImage = result;
    });
  }

  // #region delivery empl
  handleAddDeliveryEmpl(empl: any) {
    this.ticket.masterInfo.ma_nvvc = empl.ma_kh;
    this.ticket.masterInfo.ten_nvvc = empl.ten_kh;
  }

  onEnterDECode(ma_nvvc: string) {
    if (!ma_nvvc) {
      return;
    }
    this.deliveryEmployeeApiService.getOneById(ma_nvvc).subscribe(result => {
      if (result.success && result.result) {
        this.handleAddDeliveryEmpl((result.result as any));
      } else {
        this.commonService.showMessage(Language.content.Staff_not_exist);
      }
    });
  }

  openSearchDEDialog() {
    this.commonService.openDialog(SearchDialogComponent, { keyword: '', componentName: SEARCH_COMPONENT_NAME.DELIVERY_EMP }, 'search-style-dialog')
      .afterClosed()
      .subscribe((empl: Customer) => this.handleAddDeliveryEmpl(empl));
  }

  //#endregion delivery empl

  // View photo uploaded
  openImage() {
    if (!this.previewImage) {
      this.commonService.showMessage(Language.content.No_image);
      return;
    }
    this.commonService.openDialog(ViewImageComponent, { imageUrl: this.previewImage }, '', false).afterClosed().subscribe(result => {
      // console.log("result: ", result);
    });
  }

  // #region merchandise
  openMerchandiseDialog(ma_vt?: string) {
    if (!this.ticket.masterInfo.ma_kh || this.ticket.masterInfo.ma_kh === '') {
      this.commonService.showMessage('Cần nhập mã khách trước khi nhập imei');
      return;
    }

    this.commonService.openDialog(SearchDialogComponent, {
      keyword: ma_vt || '',
      componentName: SEARCH_COMPONENT_NAME.MERCHANDISE,
      ma_ct: this.ticket.masterInfo.ma_ct
    }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        if (result && result.ma_imei) {
          // this.onEnterImeiChangeCode(result.ma_imei);
          this.ma_imei_doi = result.ma_imei;
          this.handleProcessImei(this.ma_imei_doi);
        }
      });
  }

  onEnterMerchandiseCode(ma_vt: string) {
    this.openMerchandiseDialog(ma_vt);
  }

  //#endregion

  // Submit
  onSave() {
    // Check âm tiền nợ
    if (this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

    //Check imei trùng trong grid chi tiết
    const mechandise_dup = [];
    const counter: { [key: string]: number } = {};
    // check imei trả
    for (const item of this.ticket.merchandise_return) {
      counter[item.ma_imei] = (counter[item.ma_imei] || 0) + 1;
      if (counter[item.ma_imei] > 1) {
        mechandise_dup.push(item.ma_imei);
      }
    }
    // check imei đổi
    for (const item of this.ticket.merchandise_change) {
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

    const message = this.saleChangeService.validateTicket(this.ticket);
    this.invalid = /*this.commonService.isInValidPayment(this.ticket.payment) ||*/ this.saleChangeService.isInvalidForm(this.ticket.masterInfo);
    this.invalid && this.commonService.showMessageByContent(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleChangeService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.CHANGE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessageByContent(Language.content.Update_Completed);
              this.router.navigate(['sales/change']);
            } else {
              if (result.result && result.result.length > 0) {
                this.commonService.showMessageByNameAdvance(result.message, ...result.result);
              }
              else {
                this.commonService.showMessageByName(result.message);
              }
            }
          });
        } else if (this.mode === MODE.CREATE) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.CHANGE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessageByContent(Language.content.Successful_Create);
              this.router.navigate(['sales/change']);
            } else {
              if (result.result && result.result.length > 0) {
                this.commonService.showMessageByNameAdvance(result.message, ...result.result);
              }
              else {
                this.commonService.showMessageByName(result.message);
              }
            }
          });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['sales/change']);
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  handleProcessImei(ma_imei: string) {
    this.ma_imei_doi = ma_imei;

    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleChangeService.getImeiInStore(ma_imei, ngay_ct).subscribe(result => {
      if (result && result.success && result.result.length) {
        const merchandise = result.result[0];
        this.handleAddImei(merchandise, this.ticket.merchandise_change);
        this.ticket.service.forEach(item => item.ma_imei_doi = ma_imei);
      } else {
        this.commonService.showMessageByName('lblWarningNotExsitImei');
      }
    });
  }
}



