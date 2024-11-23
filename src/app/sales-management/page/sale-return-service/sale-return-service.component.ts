import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleReturnServiceService } from './sale-return-service.service';
import { ReturnServiceSaleTicketCreate, Service } from '@app/sales-management/model/ticket/sale-return-service/model';
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
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { ServiceOfMerchandiseService } from '../common/service.service';
import { CustomerCreateDialogComponent } from '@app/sales-management/component/customer/customer-create-dialog/customer-create-dialog.component';
import { ServiceOrderComponent } from '@app/sales-management/component/merchandise-service/service-order/service-order.component';

const { SALE_SERVICE_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-return-service',
  templateUrl: './sale-return-service.component.html',
  styleUrls: ['./sale-return-service.component.scss'],
})
export class SaleReturnServiceComponent implements OnInit, AfterViewInit {
  ticket: ReturnServiceSaleTicketCreate = new ReturnServiceSaleTicketCreate;
  statusList: StatusTicket[] = [];
  disableSelectStatus = true;
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  serviceColumns = SALE_SERVICE_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    so_dh: 'so_dh',
  };
  previewImage = '';
  tabIndexFocusFirst = 'so_dh';
  entity = TICKET_ENTITY.WHOLE;
  dataOrderAdded: Service[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleReturnServiceService: SaleReturnServiceService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private serviceOfMerchandiseService: ServiceOfMerchandiseService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleReturnServiceService.setTicket(this.ticket);
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.RETURN_SERVICE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.pipe().subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.RETURN_SERVICE, data.key).subscribe((result) => {
          if (result.result) {
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_RETURN_SERVICE.CREATE) {
              this.router.navigate(['/404']);
            }
            getStatusList();
            this.commonService.getPointRateExchange(this.ticket);
            this.saleReturnServiceService.loadData(result.result as any as VoucherDto);
            this.tabIndexFocusFirst = this.tabIndex.so_dh;

            this.dataOrderAdded = this.ticket.service;
          }
        });
      } else {
        this.saleReturnServiceService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
        this.tabIndexFocusFirst = this.tabIndex.so_dh;
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.saleReturnServiceService.setInfoCustomer(customer);
    this.saleReturnServiceService.calcMoney();
  }

  onEnterCustomerCode(ma_kh: string) {
    this.ticket.masterInfo.ma_kh = ma_kh || '';
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleReturnServiceService.resetCustomerInfo(this.ticket);
        this.openAddCustomerDialog(ma_kh);
      }
    });
  }
  openSearchCustomerDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER, title: this.getLabel('tlt_customer_list') }, 'search-style-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.handleAddCustomer(customer)
        this.ticket.masterInfo.ma_kh = customer.ma_kh || '';
      });
  }
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleReturnServiceService.setInfoCustomer(customer);
      });
  }
  //#endregion

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
        dataSource: this.dataOrderAdded
      },
      'search-style-dialog')
      .afterClosed()
      .subscribe((orders: any) => {
        /*
        * gán dữ liệu đã add vào detail
        * để khi thực hiện mở lại dialog
        * những cái nào đã được add thì checked = true
        */
        this.dataOrderAdded = orders;

        orders && this.addOrder(orders)
      });
  }

  addOrder(orders: any) {
    this.ticket.service = [];
    this.serviceOfMerchandiseService.convertReturnServiceFromVoucher(orders, this.ticket.service, Service);
    this.saleReturnServiceService.calcMoney();
  }

  onEnterSalesOrderNumber(order: string) {
    if (order) {
      this.saleReturnServiceService.getDataByOrderNumber(order).subscribe(result => {
        if (result && result.success && result.result) {
          const { prime, detail } = result.result as any;
          if (!this.ticket.service.find(ser => ser.stt_rec_hd1 === prime[0].stt_rec)) {
            if (this.ticket.masterInfo.ma_kh !== prime[0].ma_kh.trim()) {
              this.ticket.masterInfo.ma_kh = prime[0].ma_kh.trim();
              this.onEnterCustomerCode(prime[0].ma_kh);
              this.ticket.service = [];
            }
            this.serviceOfMerchandiseService.convertReturnServiceFromVoucher(detail, this.ticket.service, Service);
            this.commonService.clearText2([this.tabIndex.so_dh]);
            this.saleReturnServiceService.calcMoney();
          } else {
            this.commonService.showMessageByName('lblWarningServiceExist');
          }


        }
      });
    }
  }

  // #region service
  onRemoveService(event: { item: any }) {
    this.dataOrderAdded = this.dataOrderAdded.filter(item => item.so_ct !== event.item.so_ct);

    this.serviceOfMerchandiseService.removeService(event.item, this.ticket.service);
    this.saleReturnServiceService.calcMoney();
  }
  // #endregion service

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
    const message = this.saleReturnServiceService.validateTicket(this.ticket);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!message) {
      const voucherDto = this.saleReturnServiceService.prepareVoucher();

      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.RETURN_SERVICE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Update_Completed);
              this.router.navigate(['sales/return-service']);
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
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.RETURN_SERVICE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/return-service']);
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
    this.router.navigate(['sales/return-service']);
  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }
}


