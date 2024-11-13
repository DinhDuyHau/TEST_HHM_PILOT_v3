import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleRenewService } from './sale-renew.service';
import { Merchandise, MerchandiseUsed, RenewSaleTicketCreate } from '@app/sales-management/model/ticket/sale-renew/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../component/search/serach-dialog.component';
import { CustomerCreateDialogComponent } from '../../component/customer/customer-create-dialog/customer-create-dialog.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { DeliveryEmployeeApiService } from '@app/sales-management/api/delivery-employee-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { Service } from '@app/sales-management/model/ticket/common-model/service.model';
import { DiscountSelectComponent } from '@app/sales-management/component/discount/select/discount-select.component';
import { CommonService } from '../common/common.service';
import { MerchandiseService } from '../common/merchandise.service';
import { DiscountService } from '../common/discount.service';
import { MODE, STATUS_LIST } from '@app/sales-management/enum/ticket.enum';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { GuaranteeApiService } from '@app/sales-management/api/guarantee-api.service';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';
import { formatDate } from '@angular/common';
import { IMEIService } from '@app/_services/imei.service';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { environment } from '@environments/environment';
import { LookupApiService } from '@app/sales-management/api/lookup-api.service';
import { async } from 'rxjs';
import { Package } from '@app/sales-management/model/ticket/common-model/package.model';
import { PromotionSelectComponent } from '@app/sales-management/component/promotion/promotion-select.component';
import { OldProductDialogComponent } from './old-product-dialog.component';
import { DataFormatPipe } from '@app/_pipe/dataFormat/data-format.pipe';

const { DISCOUNT_LIST,
  GUARANTEE_LIST,
  MERCHANDISE_LIST_RENEW,
  MERCHANDISE_THU_CU_LIST,
  SERVICE_LIST,
  PACKAGE_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-renew',
  templateUrl: './sale-renew.component.html',
  styleUrls: ['./sale-renew.component.scss'],
})
export class SaleRenewComponent implements OnInit, AfterViewInit {
  ticket: RenewSaleTicketCreate = new RenewSaleTicketCreate;
  statusList: StatusTicket[] = [];
  dataFormat = dataFormat;
  title = '';

  renew = {
    ma_imei: '',
    ma_kho: '',
    ma_vt: '',
    ten_vt: '',
    loai_hh: '',
    gia_nt: 0,
    ma_loai: '',
    dvt: '',
    new_imei_yn: false,
  };

  //mặc định loại kho nhập hàng thu cũ
  defaultRenew_StockType = 'HC';
  defaultStockRenew = '';

  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_LIST_RENEW;
  serviceColumns = SERVICE_LIST;
  packageColumns = PACKAGE_LIST;
  discountColumns = DISCOUNT_LIST;
  guaranteeColumns = GUARANTEE_LIST;
  merchandiseUsedColumns = MERCHANDISE_THU_CU_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  invalidMerchandiseInput = { ma_vt: false, gia_nt: false, loai_hh: false, imei_used: false };
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    ma_kh: 0,
    nvvc: 2,
    ma_loai: 3,
    ma_vt: 4,
    ma_vt_new_sale: 5,
    gia_nt: 6,
    imei_used: 7,
    imei_new_sale: 8,
    ten_vt: 9,
    ma_ncc: 10,
  };
  disableSelectSatus = false;
  previewImage = '';
  tabIndexFocusFirst = 0;
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  conversionPoints = 0;
  eInvoiceInfoOutput: EInvoiceInfoOutput = new EInvoiceInfoOutput();
  option: Option = new Option;
  entity = TICKET_ENTITY.RENEW;

  depositCanApply: any[] = [];
  depositMerchandise: any[] = [];
  depositNameList = '';
  depositTotalPrice = 0;

  action = '';
  shop = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleRenewService: SaleRenewService,
    public dialog: MatDialog,
    public customerApiService: CustomerApiService,
    private deliveryEmployeeApiService: DeliveryEmployeeApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private discountService: DiscountService,
    private guaranteeApiService: GuaranteeApiService,
    private imeiService: IMEIService,
    private lookup_service: LookupApiService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleRenewService.setTicket(this.ticket, this.option);
  }

  testData() {
    // this.onEnterCustomerCode('001098025044');
    // this.onEnterImeiNewMerchandiseCode('11SC662VNA00009');
    // this.onEnterImeiNewMerchandiseCode('11SC664VNA001');
    // this.onEnterImeiNewMerchandiseCode('0100270081A00015');
    // this.onEnterImeiNewMerchandiseCode('0100270080A00004');
    // // this.onEnterImeiNewMerchandiseCode('IPV11128B2308016');
    // this.onEnterImeiNewMerchandiseCode('1030VNA00008');

    // this.onEnterImeiNewMerchandiseCode('CLFP12MA0001');
    // this.onEnterImeiNewMerchandiseCode('CSXMA0001');
    // this.onEnterImeiNewMerchandiseCode('G4S22AA0001');
    // this.onEnterImeiNewMerchandiseCode('MTIP12NA0001 ');
    // this.onEnterImeiNewMerchandiseCode('SBAG20A0001');
    // this.onEnterImeiNewMerchandiseCode('ZEE15CL1A0001');

    // this.onEnterImeiNewMerchandiseCode('CLFP12MA0002');
    // this.onEnterImeiNewMerchandiseCode('CSXMA0002');
    // this.onEnterImeiNewMerchandiseCode('G4S22AA0002');
    // this.onEnterImeiNewMerchandiseCode('MTIP12NA0002 ');
    // this.onEnterImeiNewMerchandiseCode('SBAG20A0002');
    // this.onEnterImeiNewMerchandiseCode('ZEE15CL1A0002');

    // this.onEnterImeiNewMerchandiseCode('CLFP12MA0003');
    // this.onEnterImeiNewMerchandiseCode('MTIP12NA0003 ');
    // this.onEnterImeiNewMerchandiseCode('SBAG20A0003');

  }

  ngAfterViewInit(): void {
    if (!environment.production) {
      //this.testData();
    }
    // this.commonService.focusControl(this.tabIndexFocusFirst);
  }

  ngOnInit() {
    this.route.url.subscribe(urlSegment => {
      const path = urlSegment[0].path;
      if (urlSegment[0].path) {
        switch (path) {
          case 'create':
            this.title = Language.content.add_new;
            this.disableSelectSatus = true;
            this.mode = MODE.CREATE;
            this.submitButtonTitle = Language.content.save;
            this.cancelButtonTitle = Language.content.cancel;
            this.action = 'create';
            break;
          case 'update':
            this.title = Language.content.edit;
            this.mode = MODE.UPDATE;
            this.disableSelectSatus = false;
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.RENEW }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };
    const getDefaultStock = () => {
      this.ticketApiService.getStockRenew(this.ticket.masterInfo.ma_cuahang, this.defaultRenew_StockType).subscribe(result => {
        if (result && result.success && result.result.items && result.result.items[0]) {
          this.defaultStockRenew = result.result.items[0].ma_kho;
        }
      });
    };
    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.RENEW, data.key).subscribe((result) => {
          if (result.result) {
            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_RENEW.CREATE) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.saleRenewService.loadData(result.result as any as VoucherDto);
            this.commonService.addToImeisInVoucher(this.ticket.merchandise_new_sale.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            getDefaultStock();
            this.commonService.getPointRateExchange(this.ticket, this.option);

            this.saleRenewService.getConversionPoint().subscribe(result => {
              if (result && result.success && result.result !== null) {
                this.conversionPoints = result.result;
                // this.ticket.payment.sd_diem.diem_qd = result.result;
              }
            });

            this.tabIndexFocusFirst = this.tabIndex.imei_used;
          }
        });
      } else {
        this.saleRenewService.initTicket(this.ticket);
        getStatusList();
        getDefaultStock();
        this.commonService.getPointRateExchange(this.ticket, this.option);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.commonService.focusControl(this.tabIndex.nvvc);
    this.saleRenewService.removeDiscountForCustomer();
    this.saleRenewService.setInfoCustomer(customer);
    this.handleGetDeposit();
    this.saleRenewService.setIsNeedCalcDiscount(true);
    this.discountService.resetDiscount(this.ticket.discount);
    this.saleRenewService.calcMoney();
    this.saleRenewService.getConversionPoint().subscribe(result => {
      if (result && result.success && result.result !== null) {
        this.conversionPoints = result.result;
        this.ticket.payment.sd_diem.diem_qd = result.result;
      }
    });
  }

  handleGetDeposit() {
    this.saleRenewService.getDeposit().subscribe((result: any) => {
      if (result && result.success && result.result && result.result.items) {
        this.depositCanApply = result.result.items;
      } else {
        this.depositCanApply = [];
      }
      this.handleCheckDeposit();
    });
  }

  handleCheckDeposit(ma_vt?: string, isAdd = true) {
    if (ma_vt && isAdd) {
      const isExists = this.depositMerchandise.find(item => item.ma_vt.trim() === ma_vt.trim());
      const depositItem = this.depositCanApply.find(item => item.ma_vt.trim() === ma_vt.trim());
      if (isExists) {
        return;
      } else if (!isExists && depositItem) {
        this.depositMerchandise.push(depositItem);
        this.depositNameList = this.depositMerchandise.map(item => item.ma_vt).join(', ');
        this.depositTotalPrice = this.depositMerchandise.reduce((pre, cur) => pre + cur.cl_nt, 0);
      }
    } else if (ma_vt && !isAdd) {
      const isDelete = this.ticket.merchandise_new_sale.filter(mer => mer.ma_vt.trim() === ma_vt.trim()).length;
      if (isDelete <= 1) {
        this.depositMerchandise = this.depositMerchandise.filter(item => item.ma_vt.trim() !== ma_vt.trim());
        this.depositNameList = this.depositMerchandise.map(item => item.ma_vt).join(', ');
        this.depositTotalPrice = this.depositMerchandise.reduce((pre, cur) => pre + cur.cl_nt, 0);
      }
    } else {
      //sửa gán thẳng danh sách các đặt cọc có thể áp dụng mà không cần quan tâm đến mã hàng
      //this.depositMerchandise = this.depositCanApply.filter(item => this.ticket.merchandise.some(({ ma_vt }) => item.ma_vt.trim() === '' || item.ma_vt.trim() === ma_vt.trim()));
      this.depositMerchandise = this.depositCanApply;

      this.depositNameList = this.depositMerchandise.map(item => item.ma_vt).join(', ');
      this.depositTotalPrice = this.depositMerchandise.reduce((pre, cur) => pre + cur.cl_nt, 0);
    }
  }


  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleRenewService.resetCustomerInfo(this.ticket);
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

  // click button thêm khách hàng
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleRenewService.setInfoCustomer(customer);
      });
  }
  //#endregion

  // #region delivery empl
  handleAddDeliveryEmpl(empl: any) {
    this.ticket.masterInfo.ma_nvvc = empl.ma_kh;
    this.ticket.masterInfo.ten_nvvc = empl.ten_kh;
    this.commonService.focusControl(this.tabIndex.imei_used);
  }

  onEnterDECode(ma_nvvc: string) {
    if (!ma_nvvc) {
      this.commonService.focusControl(this.tabIndex.imei_used);
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

  // #region supplier
  handleAddSupplier(empl: any) {
    this.ticket.masterInfo.ma_ncc = empl.ma_kh;
    this.resetRew();
    // this.commonService.focusControl(this.tabIndex.imei_used);
  }

  onEnterSupplierCode(ma_ncc: string) {
    if (!ma_ncc) {
      // this.commonService.focusControl(this.tabIndex.imei_used);
      this.resetRew();
      return;
    }
    this.deliveryEmployeeApiService.getOneById(ma_ncc).subscribe(result => {
      if (result.success && result.result) {
        this.handleAddSupplier((result.result as any));
      } else {
        this.commonService.showMessageByName('agent_not_exist');
        this.resetRew();
      }
    });
  }

  openSearchSupplierDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.OLD_RECEIVER_SUPPLIER }, 'search-style-dialog')
      .afterClosed()
      .subscribe((empl: Customer) => this.handleAddSupplier(empl));
  }

  //#endregion supplier

  // #region Guarantee
  handleAddGuarantee(merchandiseResponse: any) {
    this.guaranteeApiService.getOneById(TICKET_ENTITY.RETAIL, { ma_vt: merchandiseResponse.ma_vt, ma_kho: merchandiseResponse.ma_kho }).subscribe(result => {
      if (result && result.success && result?.result?.length) {
        const guarantee = result.result[0];
        this.saleRenewService.addGuaranteeMerchandise(merchandiseResponse, guarantee);
      }
    });
  }
  // #endregion Guarantee

  // #region imei
  handleAddImei(merchandiseResponse: any) {
    const merchandise = this.merchandiseService.getMerchandiseNotHaveImei(merchandiseResponse.ma_vt, this.ticket.merchandise_new_sale);
    merchandise && (merchandise.ma_imei = merchandiseResponse.ma_imei) && (merchandise.ma_kho = merchandiseResponse.ma_kho);
    if (!merchandise) {
      this.merchandiseService.addNew(merchandiseResponse, this.ticket.merchandise_new_sale, Merchandise);
      if (this.ticket.merchandise_new_sale[0].ma_td3 === '') {
        this.commonService.showMessage('Chương trình hỗ trợ không hợp lệ hoặc đã hết hạn');
        this.ticket.merchandise_new_sale = [];
        return;
      }

      //nếu tiền hỗ trợ lấy từ khai báo trong danh mục giá bán (hàng thu cũ) > 0 => set mã giao dịch TCĐM là '1', ngược lại set = '2'
      this.ticket.merchandise_new_sale[0].ma_gd_tcdm = merchandiseResponse.ma_gd_tcdm;

      if (merchandiseResponse.promotions && merchandiseResponse.promotions.length) {
        const discount = this.discountService.convertPromotionToDiscount(merchandiseResponse.promotions);
        // const discount = merchandiseResponse.promotions.length && this.discountService.convertDiscount(discount_temp);
        if (discount) {
          this.discountService.attachImeiForDiscount(merchandiseResponse.ma_imei, discount);
          const discountInDetail = this.ticket.discount.find(x => x.ma_ck.trim() === discount.ma_ck.trim());
          if (!discountInDetail) {
            this.discountService.addNew([discount], this.ticket.discount);
          }
          else {
            discountInDetail.tien_qd += discount.tien_qd;
          }
          this.saleRenewService.addPromotionMerchandise(discount, merchandiseResponse.ma_imei);
        }
      }
      this.commonService.clearText([this.tabIndex.imei_new_sale, this.tabIndex.ma_vt_new_sale]);
      this.saleRenewService.setIsNeedCalcDiscount(true);
      this.discountService.resetDiscount(this.ticket.discount);
      this.saleRenewService.calcMoney();
    }

  }

  // Kiểm tra iemi đã có trong merchandise chưa
  handleCheckExistsImei(imei: string) {
    const isExists = this.ticket.merchandise_used.find(item => item.ma_imei.trim() === imei);
    return isExists ? true : false;
  }
  addImeiOldMerchandise(imei_xuat_ban: string = '') {
    const merchandiseResponse = {
      ma_vt: this.renew.ma_vt,
      ten_vt: this.renew.ten_vt,
      ma_loai: this.renew.ma_loai,
      dvt: this.renew.dvt,
      ma_imei: this.renew.ma_imei,
      new_imei_yn: this.renew.new_imei_yn,
      ma_kho: this.defaultStockRenew,
      gia0: this.renew.gia_nt,
      gia_ban: this.renew.gia_nt,
      thanh_tien: this.renew.gia_nt,
      thanh_toan: this.renew.gia_nt,
      gc_td1: imei_xuat_ban
    };
    this.merchandiseService.addNew(merchandiseResponse, this.ticket.merchandise_used, MerchandiseUsed);
    this.commonService.clearText([this.tabIndex.ma_loai, this.tabIndex.ma_vt, this.tabIndex.ten_vt, this.tabIndex.gia_nt]);
    this.onRefreshRenew();
    this.saleRenewService.calcMoney();
    this.commonService.addImeiToStorage(this.renew.ma_imei);
  }

  //#region Enter Imei mua lại

  onEnterImeiOldMerchandiseCode(ma_imei: string) {
    /* add imei thu cũ vào grid 'hàng thu cũ' */
    const imei_thu_cu = this.renew.ma_imei;
    const ma_vt_thu_cu = this.renew.ma_vt;
    this.invalidMerchandiseInput.ma_vt = false;
    this.invalidMerchandiseInput.gia_nt = false;
    this.invalidMerchandiseInput.loai_hh = false;
    this.invalidMerchandiseInput.imei_used = false;

    const isExists = this.handleCheckExistsImei(this.renew.ma_imei);

    isExists && this.commonService.showMessageByName('lblWarningInfomationRenew');
    if (!isExists) {
      if (!(this.renew.ma_vt && this.renew.ma_imei && this.renew.loai_hh)) {
        this.invalidMerchandiseInput.ma_vt = true;
        this.invalidMerchandiseInput.gia_nt = true;
        this.invalidMerchandiseInput.loai_hh = true;
        this.invalidMerchandiseInput.imei_used = true;
      } else {
        this.imeiApiService.getImeisState([this.renew.ma_imei]).subscribe((result) => {
          if (result && result.success && result.result && result.result[0]) {
            if (result.result[0].exists_yn) {
              const map = new Map();
              map.set('in_store_yn', false);
              map.set('dat_hang_yn', false);
              const message = this.imeiService.GetMessageStatusImei(map, result.result[0]);
              if (message) {
                this.commonService.showMessageByContent(this.imeiService.GetMessageStatusImei(map, result.result[0]));
                return;
              } else {
                this.addImeiOldMerchandise(ma_imei);
                this.commonService.clearText([this.tabIndex.imei_used]);
                this.onRefreshRenew();
              }
            }
            else {
              this.renew.new_imei_yn = true;
              this.addImeiOldMerchandise(ma_imei);
              this.commonService.clearText([this.tabIndex.imei_used]);
              this.onRefreshRenew();
            }
          }


        });
      }
    }
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
  }
  //#endregion



  onRefreshRenew() {
    this.renew = {
      ma_imei: '',
      ma_kho: '',
      ma_vt: '',
      ten_vt: '',
      loai_hh: '',
      gia_nt: 0,
      ma_loai: '',
      dvt: '',
      new_imei_yn: false
    };
  }
  onClickImeiOldMerchandiseCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      if (result) { this.renew.ma_imei = result; this.onChangeImei(result); }
    });
  }
  onChangeImei($event: any) {
    if (this.ticket.masterInfo.ten_kh == '') {
      this.commonService.showMessage('Mã khách hàng không được để trống');
      return;
    }
    this.renew.ma_imei = $event;
    this.imeiApiService.getImeisStateAndItem([$event]).subscribe((result) => {
      if (result && result.success && result.result && result.result[0]) {
        const map = new Map();
        map.set('in_store_yn', false);
        map.set('dat_hang_yn', false);
        const message = this.imeiService.GetMessageStatusImei(map, result.result[0]);
        if (message) {
          this.renew.ma_imei = '';
          this.commonService.showMessageByContent(this.imeiService.GetMessageStatusImei(map, result.result[0]));
          return;
        }
        if (result.result[0].exists_yn) {
          this.renew.ma_vt = result.result[0].ma_vt;
          this.renew.ten_vt = result.result[0].ten_vt;
          this.renew.dvt = result.result[0].dvt;
        }
      }
    });
  }

  //#region Enter tại ô imei bán ra
  onEnterImeiNewMerchandiseCode(ma_imei: string) {
    if (this.ticket.masterInfo.ten_kh == '') {
      this.commonService.showMessage('Mã khách hàng không được để trống');
      return;
    }
    if (this.renew && this.renew.ma_imei && this.renew.ma_imei !== '' && this.renew.ma_vt && this.renew.ma_vt !== ''
      && this.renew.ma_loai && this.renew.ma_loai !== '' && this.ticket.merchandise_used.length > 0) {
      this.commonService.showMessageByName('bhk_exists_old_imei_msg');
      this.onRefreshRenew();
      return
    }
    if (this.renew && this.renew.ma_imei === '' && this.renew.ma_vt === '' && this.renew.loai_hh === '' && this.renew.gia_nt === 0) {
      //trường hợp chỉ nhập thông tin hàng bán ra => add hàng bán vào grid
      this.onEnterImeiSell(ma_imei, '', '');
      return;
    }

    /* add imei thu cũ vào grid 'hàng thu cũ' */
    const imei_thu_cu = this.renew.ma_imei;
    const ma_vt_thu_cu = this.renew.ma_vt;
    const gia_thu_cu = this.renew.gia_nt;

    this.invalidMerchandiseInput.ma_vt = false;
    this.invalidMerchandiseInput.gia_nt = false;
    this.invalidMerchandiseInput.loai_hh = false;
    this.invalidMerchandiseInput.imei_used = false;

    const isExists = this.handleCheckExistsImei(this.renew.ma_imei);

    isExists && this.commonService.showMessageByName('lblWarningInfomationRenew');
    if (!isExists) {
      if (!(this.renew.ma_vt && this.renew.ma_imei && this.renew.loai_hh)) {
        this.invalidMerchandiseInput.ma_vt = true;
        this.invalidMerchandiseInput.gia_nt = true;
        this.invalidMerchandiseInput.loai_hh = true;
        this.invalidMerchandiseInput.imei_used = true;
      } else {
        this.imeiApiService.getImeisState([this.renew.ma_imei]).subscribe((result) => {
          if (result && result.success && result.result && result.result[0]) {
            if (result.result[0].exists_yn) {
              const map = new Map();
              map.set('in_store_yn', false);
              map.set('dat_hang_yn', false);
              const message = this.imeiService.GetMessageStatusImei(map, result.result[0]);
              if (message) {
                this.commonService.showMessageByContent(this.imeiService.GetMessageStatusImei(map, result.result[0]));
                return;
              } else {
                this.addImeiOldMerchandise(ma_imei);
                this.commonService.clearText([this.tabIndex.imei_used]);
                this.onRefreshRenew();
              }
            }
            else {
              this.renew.new_imei_yn = true;
              this.addImeiOldMerchandise(ma_imei);
              this.commonService.clearText([this.tabIndex.imei_used]);
              this.onRefreshRenew();
            }
          }

          /* add imei hàng bán ra */
          this.onEnterImeiSell(ma_imei, imei_thu_cu, ma_vt_thu_cu, gia_thu_cu);
        });
      }
    }
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
  }

  onEnterImeiSell(ma_imei: string, imei_thu_cu: string, ma_vt_thu_cu: string, tien_thu_cu: number = 0) {
    if (!this.ticket.masterInfo.ma_ncc) {
      this.commonService.showMessageByName('lblWarningLackSupplierRenew');
      return;
    }

    if (this.ticket.merchandise_used.length == 0) {
      this.commonService.showMessageByName('lblWarningLackOldDetail');
      return;
    }

    //Tính tổng tiền hỗ trợ đã có trong phiếu
    let tien_ho_tro = 0;
    for (const item of this.ticket.merchandise_new_sale) {
      tien_ho_tro += item.tien_ht;
    }

    const ngay_ct: Date = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleRenewService.getPriceRenew(ma_imei, ma_vt_thu_cu, imei_thu_cu, ngay_ct, tien_ho_tro, tien_thu_cu).subscribe(result => {
      if (result.success && result.result.length && result.result.length > 0) {
        const sale_item = result.result[0] as any;
        if (sale_item.gia_ban === 0 || sale_item.gia_vat === 0) {
          const ma_vt_ban = sale_item.ma_vt.trimEnd();
          let msg = this.commonService.getMessage('lblWarningRenewSale_PriceNotDeclare');
          msg = msg.replace('%ma_vt_ban', ma_vt_ban).replace('%ma_vt_thucu', ma_vt_thu_cu);
          this.commonService.showMessage(msg);

          //xóa imei thu cũ trong tab 'Hàng thu cũ'
          this.ticket.merchandise_used = this.ticket.merchandise_used.filter(x => x.ma_imei.trimEnd() != imei_thu_cu.trimEnd());
          return;
        }

        if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise_new_sale)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
          return;
        }
        const merchandise = result.result[0];
        this.handleAddImei(merchandise);
        // this.handleAddGuarantee(merchandise);

        //update lại mã kho nhập tương ứng với imei trong tab hàng thu cũ
        const imei_ban = sale_item.ma_imei.trim();
        const ma_kho_nhap = sale_item.ma_kho_nhap;
        if (imei_ban && imei_ban !== '' && ma_kho_nhap && ma_kho_nhap !== '') {
          this.ticket.merchandise_used.find(x => x.gc_td1.trim() === imei_ban)!.ma_kho = ma_kho_nhap;
        }

      } else {
        if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise_new_sale)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
          return;
        }
        this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: ma_imei });
      }
    });

  }
  //#endregion

  onClickCodeScanner() {
    this.commonService.openDialog(ScanQrcodeComponent, {}, '', true, '100').afterClosed().subscribe(result => {
      result && this.onEnterImeiNewMerchandiseCode(result);
    });
  }


  // #endregion imei

  // #region merchandise
  openMerchandiseDialog(ma_vt?: string) {
    this.commonService.openDialog(SearchDialogComponent, { keyword: ma_vt || '', componentName: SEARCH_COMPONENT_NAME.MERCHANDISE }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        this.onEnterImeiNewMerchandiseCode(result.ma_imei);
      });
  }

  onEnterMerchandiseCode(ma_vt: string) {
    this.openMerchandiseDialog(ma_vt);
  }

  // Mã vật tư nhập
  openTypeMerchandiseDialog(ma_vt?: string) {
    this.commonService.openDialog(SearchDialogComponent, { keyword: ma_vt || '', componentName: SEARCH_COMPONENT_NAME.TYPE_MERCHANDISE })
      .afterClosed().subscribe(result => {
        if (result) {
          this.renew.ma_vt = result.ma_vt;
          this.renew.ten_vt = result.ten_vt;
          this.renew.dvt = result.dvt;
        }
      });
  }

  onBlurTypeMerchandiseCode(item: any) {
    if (item && item.ma_vt && item.ten_vt) {
      this.renew.ma_vt = item.ma_vt;
      this.renew.ten_vt = item.ten_vt;
    }

  }

  // on enter mã vật tư
  onEnterTypeMerchandiseCode(ma_vt: string) {
    // console.log(ma_vt);
  }

  handleInputChange(controlName: string, $event: any): void {
    if (typeof $event !== 'string') {
      $event = $event.target.value;
    }
    // this.data.masterInfo[controlName] = $event;
    // this.f[controlName].setValue($event);
    // if (controlName == 'ma_cuahang') {
    //   this.stockService2.setItemFilter([{ name: 'ma_cuahang', operator: '=', value: $event }]);
    // }
  }

  getConversionPoint() {
    const ngay_ct = formatDate(this.ticket.masterInfo.ngay_ct, 'yyyy/MM/dd', 'en_US');
    const { ma_kh } = this.ticket.masterInfo;
    return this.customerApiService.getConversionPoint(ma_kh, ngay_ct);
  }
  // Nhập loại hàng
  openSearchTypeMerchandiseDialog() {
    const { ma_cuahang, ma_ncc } = this.ticket.masterInfo;
    if (!(ma_cuahang == '' || this.renew.ma_vt == '')) {
      const initFilter = [
        { name: 'ma_cuahang', value: ma_cuahang },
        { name: 'ma_ncc', value: ma_ncc },
        { name: 'ma_vt', value: this.renew.ma_vt }
      ];

      this.commonService.openDialog(SearchDialogComponent, { keyword: '', componentName: SEARCH_COMPONENT_NAME.TYPE_RENEW, filter: initFilter })
        .afterClosed().subscribe(result => {
          if (result) {
            this.renew.loai_hh = result.ten_loai;
            this.renew.ma_loai = result.ma_loai;
            this.renew.gia_nt = result.gia_nt;
            if (!this.ticket.masterInfo.ma_ncc) {
              this.ticket.masterInfo.ma_ncc = result.ma_kh;
            }
            // this.ticketApiService.getStocks(TICKET_ENTITY.REPURCHASE, {
            //   ma_cuahang: this.ticket.masterInfo.ma_cuahang,
            //   ma_loai: result.ma_loai
            // }).subscribe(result => {
            //   if (result.success) {
            //     const { ma_kho } = result.result as any;
            //     this.renew.ma_kho = ma_kho || '';
            //   }
            // });
          }
        });
    }
    else {
      this.commonService.showMessageByName('lblWarningLackInfomationRenew');
    }
  }

  // Reset lại loại hàng & tiền
  resetRew() {
    this.renew.loai_hh = '';
    this.renew.ma_loai = '';
    this.renew.gia_nt = 0;
  }

  onRemoveMerchandise(event: { item: Merchandise }) {
    this.handleRemoveMerchandise(event.item);
  }

  // onUpdateUsedMerchandiseDialog() {
  //   console.log(this.renew);
  //   this.commonService.openDialog(UpdateOldMerchandiseComponent, 'fullscreen-dialog')
  //     .afterClosed()
  //     .subscribe();
  // }

  onRemoveUsedMerchandise(event: { item: Merchandise }) {
    this.ticket.merchandise_new_sale = [];
    this.ticket.discount = [];
    this.saleRenewService.removeUsedMerchandise(event.item);
  }

  handleRemoveMerchandise(merchandise: Merchandise) {
    if (merchandise.km_yn) {
      this.saleRenewService.removePromotionMechandise(merchandise);
    } else {
      this.saleRenewService.removeMerchandise(merchandise);
      this.saleRenewService.setIsNeedCalcDiscount(true);
      this.handleRemoveDiscountProgram(merchandise.ma_imei);
      this.ticket.discount = [];
    }
  }
  handleRemoveDiscountProgram(ma_imei: string) {
    const giam_gia_crm = this.ticket.payment.giam_gia_crm;
    if (giam_gia_crm.selected) {
      const length = giam_gia_crm.detail.length;
      giam_gia_crm.detail = giam_gia_crm.detail.filter(x => x.ma_imei.trim() != ma_imei.trim());
      if (length != giam_gia_crm.detail.length) {
        giam_gia_crm.tien = giam_gia_crm.detail.reduce((res, cur) => { return res + cur.tien_giam; }, 0);
        this.ticket.payment.giam_gia_crm = giam_gia_crm;
        this.ticket.payment = { ...this.ticket.payment };
        setTimeout(() => {
          this.commonService.showMessageByNameAdvance('lblWarningDeleteDiscountProgram', { name: '%imei', value: ma_imei });
        }, 1000);
      }
    }
  }
  onSwapPromotionMerchandise(event: { item: Merchandise }) {
    const current_imei = event!.item.imei_mua;
    const current_discount = this.ticket.discount.filter(x => x.ma_imei === current_imei && x.loai_ck === DISCOUNT_TYPE.GIFT) as any;
    if (current_discount && current_discount.length > 0) {
      const ma_ck = current_discount[0].ma_ck.trim();
      const rec = current_discount[0].rec;

      this.commonService.openDialog(PromotionSelectComponent, { ma_vt: event.item.ma_vt, ma_imei: current_imei, ma_ck: ma_ck, rec: rec })
        .afterClosed().subscribe((selected: Merchandise) => {
          const merchandise = this.ticket.merchandise_new_sale.find(e => e.ma_imei === event.item.ma_imei)
          if (merchandise) {
            merchandise.ma_vt = selected.ma_vt
            merchandise.ten_vt = selected.ten_vt
            merchandise.dvt = selected.dvt
          }
        });
    }
  }

  onChangePromotionalDebt(event: { item: Merchandise, index: number, checked: boolean, columnName: string }) {
    this.saleRenewService.onChangePromotionalDebt(event, this.ticket);
  }
  // #endregion merchandise

  // #region discount
  openCalcDiscountDialog(isGridItem: boolean = false, event: { item: Merchandise } | null = null, loai_ck: string = '') {
    // if (!this.ticket.masterInfo.ma_kh) {
    //   this.commonService.showMessageByName('invalid_cus_discount');
    //   return;
    // }
    const openDialog = (dataSource: Discount[], currentItem: Discount[], isGridItem: boolean, currentRow: { item: Merchandise } | null) => {
      this.commonService.openDialog(DiscountSelectComponent, { dataSource: dataSource, currentItem: currentItem })
        .afterClosed().subscribe(discountSelected => {
          if (discountSelected) {
            this.saleRenewService.updateDiscount(discountSelected, isGridItem, currentRow ? currentRow!.item : null);
          }
        });
    };

    let discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount);
    if (loai_ck === '04' && event && event!.item.ma_imei !== '') {
      //đối với loại ck 04 (ngoại giao) xử lý lọc selected item theo imei đã chọn áp ck
      discountCurrent = discountCurrent.filter(x => x.ma_imei && x.ma_imei.trim() === event!.item.ma_imei.trim());
    }
    const rs = this.saleRenewService.calcDiscount(loai_ck);
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          // Mảng này dùng để đánh dấu đối với loại chiết khấu 06
          // Lúc chưa chọn thì sẽ chọn chiết khấu nào thì áp dụng với các mã vật tư vào chiết khấu ưu tiên cao nhất để tính ra tiền chiết khấu có lợi nhất cho khách
          // Khi chọn hoặc bỏ chiết khấu thì phải thực hiện tính toán lại tiền chiết khấu tương ứng và tính xem các chiết khấu khác sẽ có áp dụng được không ngay trên lúc thay đổi
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          openDialog(this.discountCanApply, discountCurrent, isGridItem, event);
        }
      });
    } else {
      openDialog(this.discountCanApply, discountCurrent, isGridItem, event);
    }
  }

  onRemoveDiscount(event: { item: Discount }) {
    if (event.item.loai_ck === DISCOUNT_TYPE.GIFT) {
      this.commonService.showMessageByName('lblWarningNotDeleteDiscountGift');
      return;
    }
    const discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount.filter(x => x.ma_ck !== event.item.ma_ck));
    const rs = this.saleRenewService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
          this.saleRenewService.updateDiscount(discountAfterRemove);
        }
        else {
          this.commonService.showMessageByName(result.message);
        }
      });
    }
    else {
      this.commonService.showMessageByName('Runtime_err');
    }
  }
  // #endregion discount

  // #region service
  onAddService(event: { item: Merchandise }) {
    this.saleRenewService.addServiceForMerchandise(event.item, this.ticket);
  }

  // click button add service
  onRemoveService(event: { item: Service }) {
    if (event.item.km_yn) {
      this.saleRenewService.removePromotionService(event.item);
    } else {
      this.saleRenewService.removeService(event.item, this.ticket);
    }
  }
  // #endregion service

  // #region package
  onAddPackage(event: { item: Merchandise }) {
    this.saleRenewService.addPackageForMerchandise(event.item, this.ticket)
  }

  onRemovePackage(event: { item: Package }) {
    this.saleRenewService.removePackage(event.item, this.ticket)
  }
  // #endregion package

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
    // check imei bán mới
    for (const item of this.ticket.merchandise_new_sale) {
      counter[item.ma_imei] = (counter[item.ma_imei] || 0) + 1;
      if (counter[item.ma_imei] > 1) {
        mechandise_dup.push(item.ma_imei);
      }
    }
    // check imei thu cũ
    for (const item of this.ticket.merchandise_used) {
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

    const message = this.saleRenewService.validateTicket(this.ticket);
    this.invalid = this.saleRenewService.isInvalidForm(this.ticket.masterInfo);
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);

    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleRenewService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.RENEW, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Update_Completed);
              if (this.ticket.masterInfo.status == '2') {
                this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
                  if (res.success) {
                    this.commonService.showMessageByName(res.message);
                  }
                  this.router.navigate(['sales/renew']);
                });
              }
              else {
                this.router.navigate(['sales/renew']);
              }
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
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.RENEW, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/renew']);
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
    this.router.navigate(['sales/renew']);
    // let imeis = this.ticket.merchandise_new_sale.filter(e => e.ma_imei).map(e => e.ma_imei);
    // imeis = imeis.concat(this.ticket.merchandise_used.filter(e => e.ma_imei).map(e => e.ma_imei));
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/renew']);
    //     } else {
    //       this.commonService.showMessage('Lỗi update state của hàng hóa');
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/renew']);
    // }

  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onUsedMerchandiseUpdate(event: { item: Merchandise }) {
    this.commonService.openDialog(OldProductDialogComponent, { supplierId: this.ticket.masterInfo.ma_ncc, currentItem: event.item })
      .afterClosed().subscribe(res => {
        if (res) {
          //lọc tìm item theo imei xuất bán (gc_td1)
          const sale_item = this.ticket.merchandise_new_sale.find(x => x.ma_imei.trim() === event.item.gc_td1.trim());
          const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
          this.saleRenewService.adjustBuyPrice(ngay_ct, this.ticket.masterInfo.ma_ncc, res, sale_item!)?.pipe().subscribe(result => {
            if (result && result.success && result.result) {
              const tien_max = Number(result.result[0].tien_dc_max);
              const tien_min = Number(result.result[0].tien_dc_min);
              const tien_ht = Math.round(Number(result.result[0].tien_ht));
              const gia_dc = Number(res.gia_dc);
              const ma_gd_tcdm = sale_item?.ma_gd_tcdm;

              if (gia_dc < tien_min || gia_dc > tien_max) {
                const dataFormatPipe = new DataFormatPipe();
                const t_max = dataFormatPipe.transform(tien_max, 'number', dataFormat.moneyViewNoDigit);
                const t_min = dataFormatPipe.transform(tien_min, 'number', dataFormat.moneyViewNoDigit);

                this.commonService.showMessage(`Giá điều chỉnh không được nhỏ hơn ${t_min} hoặc lớn hơn ${t_max}`);
                return;
              }
              else {
                //cập nhật giá điều chỉnh vào tab hàng thu cũ
                const buy_item = this.ticket.merchandise_used.find(x => x.ma_imei.trim() === res.ma_imei.trim());
                buy_item!.gia_ban = gia_dc;
                buy_item!.thanh_tien = gia_dc;
                buy_item!.thanh_toan = gia_dc;
                this.saleRenewService.calcMoney();

                if (ma_gd_tcdm === '1') {
                  //fix không thay đổi tiền hỗ trợ
                  this.commonService.showMessage(`Chương trình đã cập nhật giá mua hàng cũ. Tiền hỗ trợ của hàng bán mới không thay đổi do cài đặt từ chương trình thu cũ`);
                  return;
                }
                else {
                  sale_item!.tien_ht = tien_ht;

                  // sale_item!.gia_vat -= tien_ht;
                  // sửa lại công thức: giá vat = giá niêm yết - tiền hỗ trợ
                  sale_item!.gia_vat = sale_item!.s4 - tien_ht;

                  //tính lại tiền trước thuế và tiền thuế
                  sale_item!.gia_ban = Math.round(sale_item!.gia_vat / (1 + (sale_item!.thue_suat / 100)));

                  sale_item!.tien_thue = sale_item!.gia_vat - sale_item!.gia_ban;
                  if (sale_item!.tien_thue < 0) sale_item!.tien_thue = 0;
                  sale_item!.gia_ck = sale_item!.gia_ban;
                  sale_item!.thanh_tien = sale_item!.gia_ck * sale_item!.so_luong;
                  this.saleRenewService.calcMoney();
                }

              }
            }
          })
        }
      });
  }
}





