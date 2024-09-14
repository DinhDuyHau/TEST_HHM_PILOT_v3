import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SaleReturnService } from './sale-return.service';
import { Merchandise, ReturnSaleTicketCreate } from '@app/sales-management/model/ticket/sale-return/model';
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
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { ServiceOfMerchandiseService } from '../common/service.service';
import { PaymentService } from '../common/payment.service';
import { Service } from '@app/sales-management/model/ticket/sale-return-service/model';
import { MatCheckboxChange } from '@angular/material/checkbox';

const { SERVICE_LIST_SALE_RETURN, MERCHANDISE_RETURN_LIST } = require('@assets/fields/grid/sales-fields-table.json')

@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.scss'],
})

export class SaleReturnComponent implements OnInit, AfterViewInit {
  ticket: ReturnSaleTicketCreate = new ReturnSaleTicketCreate;
  serviceColumns = SERVICE_LIST_SALE_RETURN;
  statusList: StatusTicket[] = [];
  disableSelectStatus = true;
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_RETURN_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  isDisableSaleDown = false;
  isDisableReturnType = false;
  isDisableCODReturn = false;
  tabIndex = {
    imei: 1
  };
  previewImage = '';

  isCODReturn = false;
  isSaleDown = false;
  rate = '0';
  rateMax = 100;
  tien_giam = 0;
  ma_asm = '';
  ten_asm = '';
  entity = TICKET_ENTITY.RETURN;

  disable_tl_giam = false;
  disable_tien_giam = false;

  saleReturnType: any[] = [
    { ma_loai: '01', ten_loai: 'Nhập trả lại áp dụng chính sách' },
    { ma_loai: '02', ten_loai: 'Nhập trả lại do hàng lỗi' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleReturnService: SaleReturnService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private imeiService: IMEIService,
    private serviceOfMerchandiseService: ServiceOfMerchandiseService,
    private paymentService: PaymentService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleReturnService.setTicket(this.ticket);
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
            break;
          case 'update':
            this.title = Language.content.edit;
            this.mode = MODE.UPDATE;
            this.disableSelectStatus = false;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            this.isDisableCODReturn = true;
            this.isDisableReturnType = true;
            this.isDisableSaleDown = true;
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.RETURN }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.disableSelectStatus = false;
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.RETURN, data.key).subscribe((result) => {
          if (result.result) {
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_RETURN.CREATE) {
              this.router.navigate(['/404']);
            }
            this.saleReturnService.loadData(result.result as any as VoucherDto);
            this.isCODReturn = this.ticket.masterInfo.tra_lai_cod;
            this.ticket.masterInfo.fcode1 = this.ticket.masterInfo.fcode1.trim();

            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.commonService.getPointRateExchange(this.ticket);
          }
        });
      } else {
        this.disableSelectStatus = true;
        this.saleReturnService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket);
      }
    });

    //mặc định loại giao dịch
    if (this.mode === MODE.CREATE)
      this.ticket.masterInfo.fcode1 = '01';
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.saleReturnService.setInfoCustomer(customer);
    this.saleReturnService.calcMoney();
  }

  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleReturnService.resetCustomerInfo(this.ticket);
        this.openAddCustomerDialog(ma_kh);
      }
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
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleReturnService.setInfoCustomer(customer);
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
    this.saleReturnService.getListImeiInfo([ma_imei]).subscribe(result => {
      if (result.success && result.result.length) {
        const map = new Map();
        map.set('exists_yn', true);
        map.set('in_store_yn', false);
        map.set('xuat_yn', true);
        map.set('dieu_chuyen_yn', false);
        map.set('dat_hang_yn', false);
        map.set('ban_hang_yn', true);
        map.set('tra_ncc_yn', false);
        const message = this.imeiService.GetMessageStatusImei(map, result.result[0]);
        if (message) {
          this.commonService.showMessageByContent(this.imeiService.GetMessageStatusImei(map, result.result[0]));
          return;
        }

        let rate = -1;
        if (this.isSaleDown) {
          rate = Number.parseFloat(this.rate);
          if (!this.ma_asm) {
            this.commonService.showMessageByName('invalidASM');
            return;
          }
        }

        this.saleReturnService.getSoldInfo(ma_imei, rate, this.tien_giam, this.ticket.masterInfo.fcode1, this.isCODReturn).subscribe((result: any) => {
          if (result && result.success && result.result && result.result.details) {
            const map_tralai = new Map();
            map_tralai.set('nhap_tra_lai_yn', true);
            const message = this.imeiService.GetMessageStatusImei(map_tralai, result.result.details[0].data[0]);
            if (message) {
              this.commonService.showMessageByContent(message);
              return;
            }

            this.loadCustomerInfo(result.result.masterInfo.ma_kh);
            const merchandise = result.result.details[0].data;

            //xử lý set các trường giá & tiền = 0 cho hàng khuyến mại
            const promotion_items = merchandise.filter((x: { km_yn: number; }) => x.km_yn === 1);
            if (promotion_items && promotion_items.length > 0) for (let item of promotion_items) {
              item.tien_giam = 0;
              item.gia_tra_lai = 0;
              item.tt = 0;
              item.tt_nt = 0;
              item.ty_le_giam = 0;
            }

            if (!this.ticket.merchandise.find(mer => mer.ma_imei === merchandise[0].ma_imei)) {
              merchandise[0].stt_rec_hd1 = merchandise[0].stt_rec;
              merchandise[0].ma_asm_duyet = this.ma_asm;
              merchandise[0].ten_asm_duyet = this.ten_asm;
              // merchandise[0].ty_le_giam = Number.parseFloat(this.rate);
              // merchandise[0].tien_giam = this.tien_giam;
              merchandise[0].giam_gia_yn = this.isSaleDown;

              this.merchandiseService.convertFromVoucher(merchandise, this.ticket.merchandise, Merchandise);

              result.result.details.map((detail: any) => {
                switch (detail.name.toLocaleLowerCase()) {
                  case 'services':
                    this.serviceOfMerchandiseService.convertFromVoucher(detail.data, this.ticket.service);
                    break;
                  case 'electric_biill':
                    this.ticket.electronic_bill = this.commonService.convertDateOfModelFromVoucher(detail.data[0]);
                    break;
                  default:
                    break;
                }
              })

              //Lưu thông tin stt_rec, so_ct, ngay_ct của đơn hàng bán vào phiếu trả lại
              this.ticket.masterInfo.stt_rec_hd = result.result.masterInfo.stt_rec;
              this.ticket.masterInfo.fcode2 = result.result.masterInfo.so_ct;
              this.ticket.masterInfo.fdate2 = result.result.masterInfo.ngay_ct;


              //tính số tiền còn nợ
              this.ticket.masterInfo.t_con_no = Math.abs(this.ticket.masterInfo.t_tt_nt - this.ticket.masterInfo.t_da_tra);

              this.commonService.clearText([this.tabIndex.imei]);
              // this.commonService.addImeiToStorage(ma_imei);
              this.resetSaleDown();
              //Khóa trường
              this.isDisableCODReturn = true;
              this.isDisableReturnType = true;
            } else {
              this.commonService.showMessageByName('lblWarningProductExist');
            }
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
    //this.isSaleDown = false;
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
      this.saleReturnService.removePromotionMechandise(merchandise);
    } else {
      this.saleReturnService.removeMerchandise(merchandise);
    }
    if (this.ticket.merchandise.length === 0) {
      this.isDisableCODReturn = false;
      this.isDisableReturnType = false;
      this.isDisableSaleDown = false;
    }
  }

  onClickCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiCode(result);
    });
  }
  // #endregion merchandise

  // #region service
  onRemoveService(event: { item: Service }) {
    this.serviceOfMerchandiseService.removeService(event.item, this.ticket.service)
    this.saleReturnService.calcMoney();
  }
  // #endregion service

  // Submit
  onSave() {
    const message = this.saleReturnService.validateTicket(this.ticket);

    if (message) {
      this.commonService.showMessage(message);
    } else if (!message) {
      const voucherDto = this.saleReturnService.prepareVoucher();

      //mapping checkbox trả lại COD
      voucherDto.masterInfo.tra_lai_cod = this.isCODReturn;

      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.RETURN, voucherDto).subscribe(result => {
            this.isSaving = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Update_Completed);
              this.router.navigate(['sales/return']);
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
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.RETURN, voucherDto).subscribe(result => {
            this.isSaving = false;
            if (result.success) {
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/return']);
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
      if (isNaN(Number.parseFloat(this.rate)))
        this.rate = '';
    }
    catch {
      const t = this.rate;
      this.rate = t;
      //
    }

    const rate_num = Number.parseFloat(this.rate);
    this.disable_tien_giam = (this.rate !== '' && !isNaN(rate_num) && rate_num !== 0);
  }

  handleChangeTienGiam($event: any) {
    this.tien_giam = $event;
    this.disable_tl_giam = (!isNaN(this.tien_giam) && this.tien_giam !== 0);
  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onSaleReturnTypeChange($event: any) {
    this.ticket.masterInfo.fcode1 = $event;

    const option: Option = new Option;
    this.ticket.merchandise.forEach(item => {
      //nhập trả lại theo chính sách
      if (this.ticket.masterInfo.fcode1 === '01') {
        const ty_le_giam = item.ty_le_giam ? item.ty_le_giam : 0;
        item.tien_giam = item.gia_ban * ty_le_giam / 100;

        //set kho nhập trả lại cho các item trong grid hàng hóa
        this.ticketApiService.getStockRenew(this.ticket.masterInfo.ma_cuahang, 'TL').subscribe(result => {
          if (result && result.success && result.result.items && result.result.items[0]) {
            const ma_kho = result.result.items[0].ma_kho;
            for (let item of this.ticket.merchandise) {
              item.ma_kho = ma_kho;
            }
          }
        });
      }

      //nhập trả lại do hàng lỗi
      if (this.ticket.masterInfo.fcode1 === '02') {
        item.tien_giam = 0;

        //set kho hàng lỗi cho các item trong grid hàng hóa
        this.ticketApiService.getStockRenew(this.ticket.masterInfo.ma_cuahang, 'HL').subscribe(result => {
          if (result && result.success && result.result.items && result.result.items[0]) {
            const ma_kho = result.result.items[0].ma_kho;
            for (let item of this.ticket.merchandise) {
              item.ma_kho = ma_kho;
            }
          }
        });
      }

      //tính lại các trường giá trả lại, thành tiền, thuế, thanh toán
      item.gia_tra_lai = item.gia_ban - (item.tien_giam ? item.tien_giam : 0);
      item.thanh_tien = item.gia_tra_lai * item.so_luong;
      item.tien_thue = item.thanh_tien * item.thue_suat / 100;
      item.thanh_toan = this.commonService.rouding((item.thanh_tien + item.tien_thue), option);
    })
    //update tổng cộng
    this.saleReturnService.calcMoney();

    //tính lại số tiền còn nợ
    this.ticket.masterInfo.t_con_no = Math.abs(this.ticket.masterInfo.t_tt_nt - this.ticket.masterInfo.t_da_tra);
  }
  onCODReturn(event: MatCheckboxChange): void {
    // Thực hiện hành động khác dựa trên trạng thái của checkbox
    this.isCODReturn = event.checked;
    if (this.isCODReturn) {
      this.isSaleDown = false;
      this.isDisableReturnType = true;
      this.isDisableSaleDown = true;
    }
    else {
      this.isDisableReturnType = false;
      this.isDisableSaleDown = false;
    }
  }
}


