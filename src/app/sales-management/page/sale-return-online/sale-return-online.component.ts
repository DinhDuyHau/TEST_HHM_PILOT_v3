import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SaleReturnOnlineService } from './sale-return-online.service';
import { Merchandise, ReturnSaleOnlineTicketCreate } from '@app/sales-management/model/ticket/sale-return-online/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
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
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { Language } from '../common/language';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '@app/sales-management/component/search/serach-dialog.component';
import { IMEIService } from '@app/_services/imei.service';
import { CustomerCreateDialogComponent } from '@app/sales-management/component/customer/customer-create-dialog/customer-create-dialog.component';
import { Service } from '@app/sales-management/model/ticket/common-model/service.model';
import { ServiceOfMerchandiseService } from '../common/service.service';
import { PaymentService } from '../common/payment.service';

const { MERCHANDISE_RETURN_ONLINE_LIST, SERVICE_LIST, SERVICE_LIST_SALE_RETURN } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-return-online',
  templateUrl: './sale-return-online.component.html',
  styleUrls: ['./sale-return-online.component.scss'],
})

export class SaleReturnOnlineComponent implements OnInit, AfterViewInit {
  ticket: ReturnSaleOnlineTicketCreate = new ReturnSaleOnlineTicketCreate;
  serviceColumns = SERVICE_LIST_SALE_RETURN;
  statusList: StatusTicket[] = [];
  disableSelectStatus = true;
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_RETURN_ONLINE_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    imei: 'imei'
  };
  previewImage = '';

  isSaleDown = false;
  rate = '0';
  rateMax = 100;
  tien_giam = 0;
  ma_asm = '';
  ten_asm = '';
  entity = TICKET_ENTITY.RETURN_ONLINE;
  action = '';
  shop = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleReturnOnlineService: SaleReturnOnlineService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private serviceOfMerchandiseService: ServiceOfMerchandiseService,
    private paymentService: PaymentService,
    private imeiService: IMEIService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleReturnOnlineService.setTicket(this.ticket);
  }
  ngAfterViewInit(): void {
    // this.commonService.focusControl(this.tabIndex.imei);
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.RETURN_ONLINE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.disableSelectStatus = false;
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.RETURN_ONLINE, data.key).subscribe((result) => {
          if (result.result) {
            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_RETURN_ONLINE.CREATE) {
              this.router.navigate(['/404']);
            }
            this.saleReturnOnlineService.loadData(result.result as any as VoucherDto);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.commonService.getPointRateExchange(this.ticket);
          }
        });
      } else {
        this.disableSelectStatus = true;
        this.saleReturnOnlineService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.saleReturnOnlineService.setInfoCustomer(customer);
    this.saleReturnOnlineService.calcMoney();
  }

  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleReturnOnlineService.resetCustomerInfo(this.ticket);
        this.openAddCustomerDialog(ma_kh);
      }
    });
  }

  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleReturnOnlineService.setInfoCustomer(customer);
      });
  }

  onEnterASMCode(ma_nvbh: string) {
    this.ticketApiService.getASMOneById(ma_nvbh).subscribe(result => {
      if (result.success && result.result) {
        const employee: any = result.result;
        if (employee) {
          this.ma_asm = employee.ma_nvbh;
          this.ten_asm = employee.ten_nvbh;
        }
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_nvbh);
        this.ma_asm = '';
        this.ten_asm = '';
      }
    });
  }

  loadCustomerInfo(ma_kh: string) {
    if (ma_kh !== this.ticket.masterInfo.ma_kh) {
      this.onEnterCustomerCode(ma_kh);
    }
  }

  //#endregion

  // #region imei

  onEnterImeiCode(ma_imei: string) {
    this.saleReturnOnlineService.getListImeiInfo([ma_imei]).subscribe(result => {
      if (result.success && result.result.length) {
        const map = new Map();
        map.set('exists_yn', true);
        map.set('in_store_yn', false);
        map.set('xuat_yn', true);
        map.set('dieu_chuyen_yn', false);
        // map.set('dat_hang_yn', false);
        const message = this.imeiService.GetMessageStatusImei(map, result.result[0]);
        if (message) {
          this.commonService.showMessageByContent(this.imeiService.GetMessageStatusImei(map, result.result[0]));
          return;
        }

        let rate = -1;
        if (this.isSaleDown) {
          rate = Number.parseFloat(this.rate);
        }
        this.saleReturnOnlineService.getSoldInfo(ma_imei, rate, this.tien_giam).subscribe((result: any) => {
          if (result && result.success && result.result && result.result.details) {
            this.loadCustomerInfo(result.result.masterInfo.ma_kh);
            const merchandise = result.result.details[0].data;
            const details = result.result.details
            this.imeiApiService.updateImeiState([ma_imei], true, 1).subscribe(result => {
              if (result.success && result.result[0].dat_hang_yn) {
                if (!this.ticket.merchandise.find(mer => mer.ma_imei === merchandise[0].ma_imei)) {
                  merchandise[0].stt_rec_hd1 = merchandise[0].stt_rec;
                  merchandise[0].ma_asm_duyet = this.ma_asm;
                  merchandise[0].ten_asm_duyet = this.ten_asm;
                  merchandise[0].ty_le_giam = Number.parseFloat(this.rate);
                  merchandise[0].tien_giam = this.tien_giam;
                  merchandise[0].giam_gia_yn = this.isSaleDown;

                  console.log(this.ticket.merchandise)
                  console.log(merchandise[0])
                  this.merchandiseService.convertFromVoucher(merchandise, this.ticket.merchandise, Merchandise);
                  console.log(this.ticket.merchandise)

                  details.map((detail: any) => {
                    switch (detail.name.toLocaleLowerCase()) {
                      case 'services':
                        this.serviceOfMerchandiseService.convertFromVoucher(detail.data, this.ticket.service);
                        break;
                      case 'electric_biill':
                        this.ticket.electronic_bill = this.commonService.convertDateOfModelFromVoucher(detail.data[0]);
                        break;
                      case 'payments':
                        this.paymentService.convertPaymentFromVoucher(detail.data, this.ticket.payment);
                        break;
                      default:
                        break;
                    }
                  })

                  this.commonService.clearText2([this.tabIndex.imei]);
                  this.commonService.focusControl2(this.tabIndex.imei);
                  this.commonService.addImeiToStorage(ma_imei);
                  this.resetSaleDown();
                } else {
                  this.commonService.showMessageByName('lblWarningProductExist');
                }
              }
            });
          } else {
            this.commonService.showMessageByName('lblWarningInvalidProduct');
          }
        });

      } else {
        this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: ma_imei });
      }
    });
  }
  resetSaleDown() {
    this.isSaleDown = false;
    this.rate = '0';
    this.ma_asm = '';
    this.ten_asm = '';
    this.tien_giam = 0;
  }
  onRemoveMerchandise(event: { item: Merchandise }) {
    this.handleRemoveMerchandise(event.item);
  }

  handleRemoveMerchandise(merchandise: Merchandise) {
    if (merchandise.km_yn) {
      this.saleReturnOnlineService.removePromotionMechandise(merchandise);
    } else {
      this.saleReturnOnlineService.removeMerchandise(merchandise);
    }
  }

  onClickCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiCode(result);
    });
  }
  // #endregion merchandise

  // Submit
  onSave() {
    // Check âm tiền nợ
    if(this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

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

    const message = this.saleReturnOnlineService.validateTicket(this.ticket);

    if (message) {
      this.commonService.showMessage(message);
    } else if (!message) {
      const voucherDto = this.saleReturnOnlineService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.RETURN_ONLINE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Update_Completed);
              this.router.navigate(['sales/return-online']);
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
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.RETURN_ONLINE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/return-online']);
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
    this.router.navigate(['sales/return']);
    // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/return']);
    //     } else {
    //       this.commonService.showMessage('Lỗi update state của hàng hóa');
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/return']);
    // }

  }
  openSearchCustomerDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.CUSTOMER, title: this.getLabel('lbl_list_asm') }, 'search-style-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => customer && this.handleAddCustomer(customer));
  }

  openSearchASMDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.ASM_EMPLOYEE, title: this.getLabel('lbl_list_asm') }, 'search-style-dialog')
      .afterClosed()
      .subscribe((employee: any) => {
        if (employee) {
          this.ma_asm = employee.ma_nvbh;
          this.ten_asm = employee.ten_nvbh;
        }
      });
  }


  handleChangeRate($event: any) {
    try {
      this.rate = Number.parseFloat($event) > 100 ? 100 + '' : Number.parseFloat($event).toFixed(2) + '';
    }
    catch {
      const t = this.rate;
      this.rate = t;
      //
    }
  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

}


