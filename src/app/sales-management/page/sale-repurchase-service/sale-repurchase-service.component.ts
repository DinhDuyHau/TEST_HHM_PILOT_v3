import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleRepurchaseServiceService } from './sale-repurchase-service.service';
import { Service, ServiceRepurchaseServiceTicket } from '@app/sales-management/model/ticket/sale-repurchase-service/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../component/search/serach-dialog.component';
import { CustomerCreateDialogComponent } from '../../component/customer/customer-create-dialog/customer-create-dialog.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { CommonService } from '../common/common.service';
import { MODE } from '@app/sales-management/enum/ticket.enum';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';
import { ServiceOrderComponent } from '@app/sales-management/component/merchandise-service/service-order/service-order.component';
import { PurchasePriceDialogComponent } from './purchase-price-dialog/purchase-price-dialog.component';

const { SALE_REPURCHASE_SERVICE, BUY_BACK_SERVICE } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-repurchase',
  templateUrl: './sale-repurchase-service.component.html',
  styleUrls: ['./sale-repurchase-service.component.scss'],
})
export class SaleRepurchaseServiceComponent implements OnInit, AfterViewInit {
  ticket: ServiceRepurchaseServiceTicket = new ServiceRepurchaseServiceTicket;
  statusList: StatusTicket[] = [];
  disableSelectStatus = true;
  readonly = false;
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  serviceColumns = SALE_REPURCHASE_SERVICE;
  invalid = false;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  mode!: number;
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    ma_kh: 0,
    gia_nhap_mua: 1,
    ma_dv: 2,
  };
  previewImage = '';
  tabIndexFocusFirst = 0;
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  conversionPoints = 0;
  eInvoiceInfoOutput: EInvoiceInfoOutput = new EInvoiceInfoOutput();
  entity = TICKET_ENTITY.REPURCHASE_SERVICE;
  action = '';
  shop = '';
  input_store_id = '';
  dataOrderAdded: Service[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleServiceService: SaleRepurchaseServiceService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleServiceService.setTicket(this.ticket);

    const current_shop_id = (JSON.parse(localStorage.getItem('user')!)).shop.trim();
    const stocks = JSON.parse(localStorage.getItem('stock')!);

    this.input_store_id = stocks.find((x: any) => x.ma_cuahang == current_shop_id && x.ma_loai == 'KD')?.ma_kho || "";
  }

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
            this.action = 'create';
            break;
          case 'update':
            this.title = Language.content.edit;
            this.mode = MODE.UPDATE;
            this.disableSelectStatus = false;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            this.action = 'update';
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.SERVICE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.disableSelectStatus = false;
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.REPURCHASE_SERVICE, data.key).subscribe((result) => {
          if (result.result) {
            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            // const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            // if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
            //   this.eInvoiceInfo = hddtTable.data[0];
            // }

            (result.result as any as VoucherDto).details.find(x => x.name === 'd531')?.data.forEach((e: any) => {
              e.tien2 = e.tien;
            });

            this.saleServiceService.loadData(result.result as any as VoucherDto);
            getStatusList();
            this.commonService.getPointRateExchange(this.ticket);
            this.tabIndexFocusFirst = this.tabIndex.ma_dv;

            this.dataOrderAdded = this.ticket.service;
          }
        });
      } else {
        this.disableSelectStatus = true;
        this.saleServiceService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    // this.commonService.focusControl(this.tabIndex.ma_dv);
    this.saleServiceService.setInfoCustomer(customer);
  }



  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleServiceService.resetCustomerInfo(this.ticket);
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

  // click button thêm khách hàng
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleServiceService.setInfoCustomer(customer);
      });
  }

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

  //#endregion customer

  //#region service
  openSearchOrderDialog() {
    if (!this.ticket.masterInfo.ma_kh) {
      this.commonService.showMessage('Cần chọn mã khách trước khi chọn dịch vụ trả lại');
      return;
    }

    this.commonService.openDialog(ServiceOrderComponent,
      {
        ma_kh: this.ticket.masterInfo.ma_kh,
        ten_kh: this.ticket.masterInfo.ten_kh,
        ma_cuahang: this.ticket.masterInfo.ma_cuahang,
        dataSource: this.dataOrderAdded,
        columns: BUY_BACK_SERVICE,
        title: 'Chọn dịch vụ mua lại',
        type_api: '2'
      },
      'search-style-dialog')
      .afterClosed()
      .subscribe((services: any) => {
        /*
        * gán dữ liệu đã add vào detail
        * để khi thực hiện mở lại dialog
        * những cái nào đã được add thì checked = true
        */
        this.dataOrderAdded = services;

        // Tìm các mã dịch vụ hiện tại và mới
        const currentServices = this.ticket.service.map((e: any) => e.ma_dv);
        const newServices = services.map((e: any) => e.ma_dv);

        // **Xóa các dịch vụ bị bỏ chọn**
        this.ticket.service = this.ticket.service.filter((service: any) => newServices.includes(service.ma_dv));

        // **Thêm các dịch vụ mới**
        services.forEach((newService: any) => {
          if (!currentServices.includes(newService.ma_dv)) {
            this.saleServiceService.handleAddService(newService);
          }
        });

        this.saleServiceService.calcMoney();
      });
  }

  /*
  * Tạm ko dùng
  */
  onEnterService(service: any) {
    this.handleAddService(service);
    this.commonService.clearText([this.tabIndex.ma_dv]);
  }

  /*
  * Tạm ko dùng
  */
  openSearchServiceDialog() {
    if (this.ticket.masterInfo.ten_kh == '') {
      this.commonService.showMessage('Mã khách hàng không được để trống');
      return;
    }
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.SERVICE })
      .afterClosed()
      .subscribe((service: any) => {
        this.handleAddService(service);
        this.commonService.clearText([this.tabIndex.ma_dv]);
      });
  }

  /*
  * Tạm ko dùng
  */
  handleAddService(service: any) {
    if (this.ticket.masterInfo.gia_nhap_mua <= 0) {
      this.commonService.showMessage('Chưa nhập giá nhập mua hoặc giá trị không hợp lệ');
      return;
    }

    const isExist = this.ticket.service.find((e: any) => e.ma_dv === service.ma_dv);
    if (isExist) {
      this.commonService.showMessageByName('lblWarningServiceExist');
    } else {

      this.saleServiceService.setInfoService(service, this.input_store_id, this.ticket.masterInfo.gia_nhap_mua);
    }

    //reset giá nhập
    this.ticket.masterInfo.gia_nhap_mua = 0;
  }

  /*
  * Tạm ko dùng
  */
  openSaleServiceDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.SERVICE })
      .afterClosed()
      .subscribe();
  }

  // click button add service
  onRemoveService(event: { item: Service }) {
    this.dataOrderAdded = this.dataOrderAdded.filter(item => item.key !== event.item.key);
    this.saleServiceService.removeService(event.item as any, this.ticket);
  }
  // #endregion service

  // Submit
  onSave() {
    // Check âm tiền nợ
    if (this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

    // Check giá nhập mua
    const arrError = this.ticket.service
      .filter(e => e.gia_nhap_mua <= 0)
      .map(e => e.ma_dv);
    if (arrError.length > 0) {
      let error = 'Chưa có giá nhập mua cho mã dịch vụ: ';
      const errMsg = arrError.map(maDv => `${maDv}`).join(',\n');
      this.commonService.showMessage(error + errMsg);
      return;
    }

    const message = this.saleServiceService.validateTicket(this.ticket);
    this.invalid = this.commonService.isInValidPayment(this.ticket.payment) || !this.ticket.masterInfo.ma_kh;

    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleServiceService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.REPURCHASE_SERVICE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;

            if (result.success) {
              this.commonService.showMessage(Language.content.Update_Completed);
              // if (this.ticket.masterInfo.status == '2') {
              //   this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
              //     if (res.success) {
              //       this.commonService.showMessageByName(res.message);
              //     }
              //     this.router.navigate(['sales/repurchase-service']);
              //   });
              // }
              // else {
              //   this.router.navigate(['sales/repurchase-service']);
              // }
              this.router.navigate(['sales/repurchase-service']);
            } else {
              if (result.result && result.result.length > 0) {
                this.commonService.showMessageByNameAdvance(result.message, ...result.result);
              }
              else {
                this.commonService.showMessageByName(result.message);
              }
            }
          });
        } else if (this.mode === MODE.CREATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.REPURCHASE_SERVICE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/repurchase-service']);
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
    this.router.navigate(['sales/repurchase-service']);
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onChange_dien_giai(event: any) {
    this.ticket.masterInfo.dien_giai = event;
  }

  // Nhập giá mua
  onEnterPrice(gia_nhap_mua: number) {
    this.ticket.masterInfo.gia_nhap_mua = gia_nhap_mua;
  }

  onOpenPricePurchase($event: any) {
    // lấy giá nhập nếu có
    let purchase_price = $event.item.gia_nhap_mua || 0;
    // lấy giá bán
    let sold_price = $event.item.gia_ban || 0;

    this.commonService.openDialog(PurchasePriceDialogComponent, { sold_price: sold_price, purchase_price: purchase_price }, 'fullscreen-dialog')
      .afterClosed().subscribe((price = 0) => {
        const service = this.ticket.service.find(item => item.ma_dv === $event.item.ma_dv);

        if (service) {
          service.gia_nhap_mua = price;
          this.saleServiceService.handleEditPurchasePriceService(service, this.input_store_id, price);
        }
      });
  }
}


