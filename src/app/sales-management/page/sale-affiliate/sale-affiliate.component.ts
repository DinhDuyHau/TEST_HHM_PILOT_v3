import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleAffiliateService } from './sale-affiliate.service';
import { Merchandise, SaleAffiliateceTicket, TAB_NAME } from '@app/sales-management/model/ticket/sale-affiliate/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import { MobifoneApiService } from '@app/sales-management/api/mobifone-api.service';
import { Mobifone } from '@app/sales-management/model/common/mobifone.model';
import { GuaranteeApiService } from '@app/sales-management/api/guarantee-api.service';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../common/language';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { Package } from '@app/sales-management/model/ticket/common-model/package.model';
import { PromotionSelectComponent } from '@app/sales-management/component/promotion/promotion-select.component';
import { InternalSaleDetailService } from '@app/_components/voucher/inventory/internal-sale/create/internal-sale-detail.service';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { isValidEmail, isValidTaxcode } from '@app/_common/commonFunction';

const { DISCOUNT_LIST,
  GUARANTEE_LIST,
  MERCHANDISE_LIST,
  SERVICE_LIST,
  PACKAGE_LIST,
  OVERVIEW_LIST } = require('@assets/fields/grid/sales-fields-table.json');
@Component({
  selector: 'app-sale-affiliate',
  templateUrl: './sale-affiliate.component.html',
  styleUrls: ['./sale-affiliate.component.scss'],
})
export class SaleAffiliateComponent implements OnInit, AfterViewInit {
  ticket: SaleAffiliateceTicket = new SaleAffiliateceTicket;
  statusList: StatusTicket[] = [];
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  merchandiseColumns = MERCHANDISE_LIST;
  serviceColumns = SERVICE_LIST;
  packageColumns = PACKAGE_LIST;
  discountColumns = DISCOUNT_LIST;
  guaranteeColumns = GUARANTEE_LIST;
  overviewColumns = OVERVIEW_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  isSentRequestToMobifone = false;
  isDisabled = false;
  tabIndex = {
    ma_kh: 'ma_kh',
    nvvc: 'nvvc',
    imei: 'imei',
    ma_vt: 'ma_vt'
  };
  disableSelectStatus = false;
  disabledMobifone = true;
  previewImage = '';
  depositCanApply: any[] = [];
  depositMerchandise: any[] = [];
  depositNameList = '';
  depositTotalPrice = 0;
  tabIndexFocusFirst = 'ma_kh';
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  conversionPoints = 0;
  eInvoiceInfoOutput: EInvoiceInfoOutput = new EInvoiceInfoOutput();
  option: Option = new Option;
  entity = TICKET_ENTITY.AFFILIATE;
  action = '';
  shop = '';
  ma_imei = '';
  addOrUpdateCustomer = 'create';
  isCreateDraftInvoice = false;
  isGetInvoice = false;
  isGetPdfInvoice = false;
  invoice_model_status = '0';

  tab_sources: any[] = [
    { label: 'Tổng quan' },
    { label: 'Hàng hoá', name: 'merchandise' },
    { label: 'Dịch vụ', name: 'service' },
    { label: 'Chiết khấu', name: 'discount' },
    { label: 'HĐĐT' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleAffiliateService: SaleAffiliateService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private deliveryEmployeeApiService: DeliveryEmployeeApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private discountService: DiscountService,
    private mobifoneApiService: MobifoneApiService,
    private guaranteeApiService: GuaranteeApiService,
    public internalSaleDeatailService: InternalSaleDetailService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleAffiliateService.setTicket(this.ticket, this.option);
  }

  // get tabList() {
  //   return [
  //     { label: 'Hàng hoá', count: this.ticket?.merchandise?.length ?? 0 },
  //     { label: 'Dịch vụ', count: this.ticket?.service?.length ?? 0 },
  //     { label: 'Chiết khấu', count: this.ticket?.discount?.length ?? 0 },
  //     { label: 'HĐĐT' }
  //   ];
  // }

  get overviewData() {
    const newOverview = [
      ...this.ticket.merchandise.map(item => this.commonService.mapToOverview(item, 'Hàng hóa', 'merchandise')),
      ...this.ticket.service.map(item => this.commonService.mapToOverview(item, 'Dịch vụ', 'service'))
    ];

    if (JSON.stringify(newOverview) !== JSON.stringify(this.ticket.overview)) {
      this.ticket.overview = newOverview;
    }
    return this.ticket.overview || [];
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.AFFILIATE }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.AFFILIATE, data.key).subscribe((result) => {
          if (result.result) {
            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            //set status để xử lý vấn đề in ngay trên màn hình xem chứng từ
            this.invoice_model_status = (result.result as any).masterInfo.status;

            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_AFFILIATE.CREATE) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            getStatusList();
            this.saleAffiliateService.loadData(result.result as any as VoucherDto);
            this.handleGetDeposit();
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            if (this.ticket.masterInfo.lap_dh_lk === 0) {
              this.disabledMobifone = false;
            } else {
              this.disabledMobifone = true;
              this.isSentRequestToMobifone = true;
              this.ticket.masterInfo.status = '2';
            }
            this.commonService.getPointRateExchange(this.ticket, this.option);
            this.saleAffiliateService.getConversionPoint().subscribe(result => {
              if (result && result.success && result.result !== null) {
                this.conversionPoints = result.result;
                // this.ticket.payment.sd_diem.diem_qd = result.result;
              }
            });


            this.tabIndexFocusFirst = this.tabIndex.imei;
          }
        });
      } else {
        this.saleAffiliateService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket, this.option);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.commonService.focusControl2(this.tabIndex.nvvc);
    this.saleAffiliateService.removeDiscountForCustomer();
    this.saleAffiliateService.setInfoCustomer(customer);
    this.handleGetDeposit();
    this.saleAffiliateService.setIsNeedCalcDiscount(true);
    this.discountService.resetDiscount(this.ticket.discount);
    this.saleAffiliateService.calcMoney();

    this.saleAffiliateService.getConversionPoint().subscribe(result => {
      if (result && result.success && result.result !== null) {
        this.conversionPoints = result.result;
        this.ticket.payment.sd_diem.diem_qd = result.result;
      }
    });
  }

  handleGetDeposit() {
    this.saleAffiliateService.getDeposit().subscribe((result: any) => {
      if (result && result.success && result.result && result.result.items) {
        this.depositCanApply = result.result.items;
      } else {
        this.depositCanApply = [];
      }
      this.handleCheckDeposit();
    });
  }

  onEnterCustomerCode(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.handleAddCustomer(customer);

        // Kiểm tra điều kiện mở dialog
        if (this.commonService.shouldOpenDialog(customer)) {
          // mở dialog add khách hàng nhưng ở chế độ update
          this.addOrUpdateCustomer = 'update';
          this.openAddCustomerDialog(customer.ma_kh);
        }
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleAffiliateService.resetCustomerInfo(this.ticket);
        this.addOrUpdateCustomer = 'create';
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

        // Kiểm tra điều kiện mở dialog
        if (this.commonService.shouldOpenDialog(customer)) {
          // mở dialog add khách hàng nhưng ở chế độ update
          this.addOrUpdateCustomer = 'update';
          this.openAddCustomerDialog(customer.ma_kh);
        }
      });
  }

  // click button thêm khách hàng
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh, addOrUpdate: this.addOrUpdateCustomer }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        customer && this.saleAffiliateService.setInfoCustomer(customer);
      });
  }
  //#endregion

  // #region delivery empl
  handleAddDeliveryEmpl(empl: any) {
    this.ticket.masterInfo.ma_nvvc = empl.ma_kh;
    this.ticket.masterInfo.ten_nvvc = empl.ten_kh;
    this.commonService.focusControl2(this.tabIndex.imei);
  }

  onEnterDECode(ma_nvvc: string) {
    if (!ma_nvvc) {
      this.commonService.focusControl2(this.tabIndex.imei);
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

  // #region Guarantee
  handleAddGuarantee(merchandiseResponse: any) {
    this.guaranteeApiService.getOneById(TICKET_ENTITY.RETAIL, { ma_vt: merchandiseResponse.ma_vt, ma_kho: merchandiseResponse.ma_kho }).subscribe(result => {
      if (result && result.success && result?.result?.length) {
        const guarantee = result.result[0];
        this.saleAffiliateService.addGuaranteeMerchandise(merchandiseResponse, guarantee);
      }
    });
  }

  // #endregion Guarantee

  // #region imei
  handleAddImei(merchandiseResponse: any) {
    const merchandise = this.merchandiseService.getMerchandiseNotHaveImei(merchandiseResponse.ma_vt, this.ticket.merchandise);
    merchandise && (merchandise.ma_imei = merchandiseResponse.ma_imei) && (merchandise.ma_kho = merchandiseResponse.ma_kho);

    if (!merchandise) {
      this.merchandiseService.addNew(merchandiseResponse, this.ticket.merchandise, Merchandise);
      this.handleCheckDeposit(merchandiseResponse.ma_vt, true);
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
          this.saleAffiliateService.addPromotionMerchandise(discount, merchandiseResponse.ma_imei);
        }
      }
      this.commonService.clearText2([this.tabIndex.imei, this.tabIndex.ma_vt]);
      this.commonService.focusControl2(this.tabIndex.imei);
      this.saleAffiliateService.setIsNeedCalcDiscount(true);
      this.discountService.resetDiscount(this.ticket.discount);
      this.saleAffiliateService.calcMoney();
    }
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
      const isDelete = this.ticket.merchandise.filter(mer => mer.ma_vt.trim() === ma_vt.trim()).length;
      if (isDelete <= 1) {
        this.depositMerchandise = this.depositMerchandise.filter(item => item.ma_vt.trim() !== ma_vt.trim());
        this.depositNameList = this.depositMerchandise.map(item => item.ma_vt).join(', ');
        this.depositTotalPrice = this.depositMerchandise.reduce((pre, cur) => pre + cur.cl_nt, 0);
      }
    } else {
      this.depositMerchandise = this.depositCanApply.filter(item => this.ticket.merchandise.some(({ ma_vt }) => item.ma_vt.trim() === ma_vt.trim()));
      this.depositNameList = this.depositMerchandise.map(item => item.ma_vt).join(', ');
      this.depositTotalPrice = this.depositMerchandise.reduce((pre, cur) => pre + cur.cl_nt, 0);
    }
  }

  onEnterImeiCode(ma_imei: string) {
    if (this.ticket.masterInfo.ten_kh == '') {
      this.commonService.showMessage('Mã khách hàng không được để trống');
      return;
    }

    if (!ma_imei || ma_imei.length < 5) {
      this.commonService.showMessage('Imei cần ít nhất 5 ký tự để tìm kiếm');
      return;
    }

    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleAffiliateService.getImeiInStore(ma_imei, ngay_ct).subscribe(result => {
      if (result.success && result.result.length) {
        if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
          return;
        }
        const merchandise = result.result[0];
        this.handleAddImei(merchandise);
        // this.handleAddGuarantee(merchandise);
        // this.imeiApiService.updateImeiState([ma_imei], true).subscribe(result => {
        //   if (result.success && result.result[0].dat_hang_yn) {
        //     this.handleAddImei(merchandise);
        //     this.handleAddGuarantee(merchandise);
        //     // this.commonService.addImeiToStorage(ma_imei);
        //   }
        // });
      } else {
        /*
        * Ko đúng imei sẽ mở dialog tìm kiếm
        */
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.commonService.openDialog(SearchDialogComponent, {
          keyword: ma_imei,
          shop: user.shop,
          componentName: SEARCH_COMPONENT_NAME.IMEI_SEARCH_SALES,
        }, 'search-style-dialog')
          .afterClosed().subscribe(result => {
            if (result && result.ma_imei) {
              this.ma_imei = result.ma_imei;
              this.handleProcessImei(this.ma_imei);
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

  // #region merchandise
  openMerchandiseDialog(ma_vt?: string) {
    if (this.ticket.masterInfo.ten_kh == '') {
      this.commonService.showMessage('Mã khách hàng không được để trống');
      return;
    }

    this.commonService.openDialog(SearchDialogComponent, {
      keyword: ma_vt || '',
      componentName: SEARCH_COMPONENT_NAME.MERCHANDISE,
      ma_ct: this.ticket.masterInfo.ma_ct
    }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        if (result && result.ma_imei) {
          // this.onEnterImeiCode(result.ma_imei);
          this.ma_imei = result.ma_imei;
          this.handleProcessImei(this.ma_imei);
        }
      });
  }

  onEnterMerchandiseCode(ma_vt: string) {
    this.openMerchandiseDialog(ma_vt);
  }

  onRemoveMerchandise(event: { item: Merchandise }) {
    this.handleRemoveMerchandise(event.item);
  }

  handleRemoveMerchandise(merchandise: Merchandise) {
    if (merchandise.km_yn) {
      this.saleAffiliateService.removePromotionMechandise(merchandise);
    } else {
      this.saleAffiliateService.removeMerchandise(merchandise);
      this.handleCheckDeposit(merchandise.ma_vt, false);
      this.saleAffiliateService.setIsNeedCalcDiscount(true);
      this.handleRemoveDiscountProgram(merchandise.ma_imei);
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
          const merchandise = this.ticket.merchandise.find(e => e.ma_imei === event.item.ma_imei)
          if (merchandise) {
            merchandise.ma_vt = selected.ma_vt;
            merchandise.ten_vt = selected.ten_vt;
            merchandise.dvt = selected.dvt;

            //clear mã imei của vật tư khuyến mại => người dùng sẽ phải nhập lại imei KM sau khi đổi quà
            merchandise.ma_imei = '';
            merchandise.ma_kho = '';
          }
        });
    }
  }

  onChangePromotionalDebt(event: { item: Merchandise, index: number, checked: boolean, columnName: string }) {
    this.saleAffiliateService.onChangePromotionalDebt(event, this.ticket);
  }
  // #endregion merchandise

  // Mobifone
  onOrdertMobifone() {
    // check trạng thái liên kết = "0" (chưa lập đơn liên kết) mới cho gửi request đến api của mobifone
    if (this.ticket.masterInfo.lap_dh_lk === 0) {
      const mobifone = new Mobifone();
      if (!this.isSentRequestToMobifone) {
        this.mobifoneApiService.postMobifone(mobifone).subscribe((result) => {
          if (result && result.message) {
            //api mobifone gửi response success: Disable nút "lập đơn mobifone"
            //và gửi request đến Backend cập nhật trạng thái liên kết là "1" (đã lập đơn mobifone)
            this.disabledMobifone = true;
            this.mode = MODE.UPDATE;

            //isSentRequestToMobifone
            this.ticketApiService.updateFormMobifone(TICKET_ENTITY.AFFILIATE, { id: this.ticket.masterInfo.stt_rec }).subscribe(result => {
              if (result.success) {
                this.isSentRequestToMobifone = true;
                this.ticket.masterInfo.lap_dh_lk = 1;
                //ô Trạng thái tự động chuyển sang "Hoàn thành"
                this.ticket.masterInfo.status = '2';
              }
            });
          }
        });
      } else {
        this.ticketApiService.updateFormMobifone(TICKET_ENTITY.AFFILIATE, { id: this.ticket.masterInfo.stt_rec }).subscribe(result => {
          if (result.success) {
            this.isSentRequestToMobifone = true;
            this.ticket.masterInfo.lap_dh_lk = 1;
            //ô Trạng thái tự động chuyển sang "Hoàn thành"
            this.ticket.masterInfo.status = '2';
          }
        });
      }
    }
  }

  // #region discount
  openCalcDiscountDialog(isGridItem: boolean = false, event: { item: Merchandise } | null = null, loai_ck: string = '') {
    const openDialog = (dataSource: Discount[], currentItem: Discount[], isGridItem: boolean, currentRow: { item: Merchandise } | null) => {
      this.commonService.openDialog(DiscountSelectComponent, { dataSource: dataSource, currentItem: currentItem })
        .afterClosed().subscribe(discountSelected => {
          if (discountSelected) {
            this.saleAffiliateService.updateDiscount(discountSelected, isGridItem, currentRow ? currentRow!.item : null);
          }
        });
    };

    let discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount);
    if (loai_ck === '04' && event && event!.item.ma_imei !== '') {
      //đối với loại ck 04 (ngoại giao) xử lý lọc selected item theo imei đã chọn áp ck
      discountCurrent = discountCurrent.filter(x => x.ma_imei && x.ma_imei.trim() === event!.item.ma_imei.trim());
    }

    const rs = this.saleAffiliateService.calcDiscount(loai_ck);
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
    const rs = this.saleAffiliateService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
          this.saleAffiliateService.updateDiscount(discountAfterRemove);
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
    this.saleAffiliateService.addServiceForMerchandise(event.item, this.ticket);
  }

  // click button add service
  onRemoveService(event: { item: Service }) {
    if (event.item.km_yn) {
      this.saleAffiliateService.removePromotionService(event.item);
    } else {
      this.saleAffiliateService.removeService(event.item, this.ticket);
    }
  }
  // #endregion service

  // #region package
  onAddPackage(event: { item: Merchandise }) {
    this.saleAffiliateService.addPackageForMerchandise(event.item, this.ticket)
  }

  onRemovePackage(event: { item: Package }) {
    this.saleAffiliateService.removePackage(event.item, this.ticket)
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
    // Check âm tiền nợ
    if (this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

    //Kiểm tra định dạng email của tab HĐĐT
    if (this.ticket.masterInfo.hd_email && this.ticket.masterInfo.hd_email !== ''
      && !isValidEmail(this.ticket.masterInfo.hd_email)) {
      this.commonService.showMessage('Định dạng email nhận hóa đơn điện tử không hợp lệ');
      return;
    }

    //Kiểm tra định dạng mã số thuế của tab HĐĐT
    if (this.ticket.masterInfo.hd_mst && this.ticket.masterInfo.hd_mst !== ''
      && !isValidTaxcode(this.ticket.masterInfo.hd_mst)) {
      this.commonService.showMessage('Mã số thuế không hợp lệ, vui lòng kiểm tra lại');
      return;
    }

    //Check imei trùng trong grid chi tiết
    let mechandise_dup = [];
    const counter: { [key: string]: number } = {};
    for (const item of this.ticket.merchandise) {
      counter[item.ma_imei] = (counter[item.ma_imei] || 0) + 1;
      if (counter[item.ma_imei] > 1) {
        mechandise_dup.push(item.ma_imei);
      }
    }
    //loại bỏ các mã imei là chuỗi rỗng
    mechandise_dup = mechandise_dup.filter((x: any) => x.ma_imei && x.ma_imei !== '')
    if (mechandise_dup && mechandise_dup.length > 0) {
      const duplicate_imeis = mechandise_dup.join(',');
      this.commonService.showMessage(`Các imei xuất hiện nhiều lần trong chi tiết phiếu: ${duplicate_imeis}`);
      return;
    }

    const message = this.saleAffiliateService.validateTicket(this.ticket);
    this.invalid = this.commonService.isInValidPayment(this.ticket.payment) || this.saleAffiliateService.isInvalidForm(this.ticket.masterInfo);
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleAffiliateService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          if (this.ticket.masterInfo.lap_dh_lk === 0) {
            const dataPayment = voucherDto.details.find(e => e.name === TAB_NAME.PAYMENT);
            if (dataPayment && dataPayment.data) {
              dataPayment.data = [];
            }
          }
          this.ticketApiService.updateVoucher(TICKET_ENTITY.AFFILIATE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessageByName(result.message || Language.content.Update_Completed);
              // if (this.ticket.masterInfo.status == '2') {
              //   this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
              //     if (res.success) {
              //       this.commonService.showMessageByName(res.message);
              //     }
              //     this.router.navigate(['sales/affiliate']);
              //   });
              // }
              // else {
              //   this.router.navigate(['sales/affiliate']);
              // }
              this.router.navigate(['sales/affiliate']);
            } else {
              this.commonService.handleResponseErrorVoucher(result, 'sales/affiliate');
            }
          });
        } else if (this.mode === MODE.CREATE && !this.isSaving) {
          const dataPayment = voucherDto.details.find(e => e.name === TAB_NAME.PAYMENT);
          if (dataPayment && dataPayment.data) {
            dataPayment.data = [];
          }
          if (voucherDto.masterInfo.stt_rec) {
            this.ticketApiService.getVoucherByid(TICKET_ENTITY.AFFILIATE, voucherDto.masterInfo.stt_rec).subscribe((result) => {
              if (result && result.success && result.result) {
                this.commonService.showMessageByName('lbl_exist_ticket');
                return;
              }
            });
          } else if (!this.isSaving) {
            this.isSaving = true;
            this.isDisabled = true;
            this.ticketApiService.addNewVoucher(TICKET_ENTITY.AFFILIATE, voucherDto).subscribe((result: any) => {
              this.isSaving = false;
              this.isDisabled = false;
              if (result.success && result?.result && result?.result?.stt_rec) {
                // this.commonService.clearImeiStorage();
                this.commonService.showMessageByName(result.message || Language.content.Successful_Create);
                this.disabledMobifone = false;
                this.ticket.masterInfo.stt_rec = result.result.stt_rec;
                this.router.navigate(['sales/affiliate']);
              } else {
                this.commonService.handleResponseErrorVoucher(result, 'sales/affiliate');
              }
            });
          }
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['sales/affiliate']);
    // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/affiliate']);
    //     } else {
    //       this.commonService.showMessage('Lỗi update state của hàng hóa');
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/affiliate']);
    // }

  }
  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onPaymentChange($event: any) {
    this.ticket.masterInfo.t_con_no = $event.t_con_no;
    this.ticket.masterInfo.t_da_tra = $event.t_da_tra;
    this.ticket.masterInfo.t_gg = $event.t_gg;
    this.ticket.masterInfo.nguoi_duyet_ck = $event.nguoi_duyet_ck;
    this.ticket.masterInfo.t_cp_khac = $event.t_chi_phi;

    this.ticket.masterInfo.fqty1 = this.ticket.masterInfo.t_tt_nt + this.ticket.masterInfo.t_cp_khac;
  }

  handleProcessImei(ma_imei: string) {
    this.ma_imei = ma_imei;

    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleAffiliateService.getImeiInStore(this.ma_imei, ngay_ct).subscribe(result => {
      if (result.success && result.result.length) {
        if (this.merchandiseService.checkImeiExistMerchandise(this.ma_imei, this.ticket.merchandise)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: this.ma_imei });
          return;
        }
        const merchandise = result.result[0];
        this.handleAddImei(merchandise);
      } else {
        this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: this.ma_imei });
      }
    });
  }

  // xử lý trước khi thực hiện hàm onSave()
  beforeSave() {
    // nếu là CREATE thực hiện valid
    if (this.mode === MODE.CREATE) {
      /*
      const title = 'Có lập HĐĐT (nháp) cho phiếu xuất bán hàng này hay không?';
      this.commonService.openDialog(DialogConfirmComponent, { title: title })
        .afterClosed().subscribe(result => {
          if (result) {
            const { hd_mst, hd_email, hd_ten_kh, hd_dia_chi } = this.ticket.masterInfo;
            if (!hd_mst || !hd_email || !hd_ten_kh || !hd_dia_chi) {
              this.commonService.showMessageByName('invoice_info_not_enough');
              return;
            }
          }

          // Gán flag cho BE biết
          this.ticket.masterInfo.fnote3 = result ? '1' : '0';

          // Gọi submit như bình thường
          this.onSave();
        });
      */

      // comment code phía trên và sửa lại như sau:
      // - Mặc định check phải nhập đủ thông tin hóa đơn điện tử mới cho lưu phiếu với status "hoàn thành"
      // - Hoàn thành phiếu sẽ chưa xử lý lập nháp hđ đt ngay, người dùng sẽ chủ động quay lại mở phiếu và click button "lập nháp HĐĐT"
      this.ticket.masterInfo.fnote2 = this.ticket.masterInfo.fnote2 ? this.ticket.masterInfo.fnote2 : '0';
      const objEinvoice = this.ticket.masterInfo.fnote2;
      const { hd_mst, hd_ten_kh, hd_dia_chi } = this.ticket.masterInfo;
      //phiếu bán liên kết không xử lý lập hddt trực tiếp cho từng phiếu => bỏ qua đoạn check ở dưới
      /*
      if (objEinvoice == '1' && (!hd_mst || !hd_ten_kh || !hd_dia_chi)) {
        this.commonService.showMessageByName('invoice_bussiness_info');
        return;
      }
      */
      const hd_loai_giay_to = this.ticket.masterInfo.hd_loai_giay_to;
      const hd_so_giay_to = this.ticket.masterInfo.hd_so_giay_to;
      if ((hd_loai_giay_to == '1' || hd_loai_giay_to == '2') && !hd_so_giay_to) {
        this.commonService.showMessageByName('invoice_papersType_info');
        return;
      }
      this.ticket.masterInfo.fnote3 = '0';
      this.onSave();

    } else {
      // Không cần hỏi → submit luôn
      this.ticket.masterInfo.fnote3 = '0';
      this.onSave();
    }
  }

  // #region EInvoice
  handleCreateDraftInvoice() {
    if (this.ticket.masterInfo.status === '0') {
      const title = 'Có lập HĐĐT (nháp) cho phiếu xuất bán hàng này hay không?';

      this.commonService.openDialog(DialogConfirmComponent, { title: title })
        .afterClosed().subscribe(result => {
          if (result) {
            this.onCreateDraft();
          }
        });
    }
  }

  handleGetInvoice() {
    let title = 'Có lấy HĐĐT cho phiếu bán hàng này hay không?';

    this.commonService.openDialog(DialogConfirmComponent, { title: title })
      .afterClosed().subscribe(result => {
        if (result) {
          this.isGetInvoice = true;

          this.internalSaleDeatailService.getPublishedInv(this.ticket).subscribe((res: any) => {
            if (res.result.errorCode) {
              this.commonService.showMessage(res.result.description);
              this.isGetInvoice = false;
              return;
            }
            if (res) {
              this.commonService.showMessageByName(res.message);
              location.reload();
            }
          }, (err: any) => {
            this.isGetInvoice = false;
            this.commonService.showMessageByName(err);
          });
        } else {
          this.isGetInvoice = false;
        }
      });
  }

  handleGetPDFInvoice() {
    let title = 'Có lấy PDF HĐĐT cho phiếu bán hàng này hay không?';

    this.commonService.openDialog(DialogConfirmComponent, { title: title })
      .afterClosed().subscribe(result => {
        if (result) {
          this.isGetPdfInvoice = true;

          let dialogRef: any = null;
          this.internalSaleDeatailService.getPdfFile(this.ticket).subscribe((res: any) => {
            if (res.success && res?.result && res?.result?.fileToBytes) {
              const pdfBase64 = 'data:application/pdf;base64,' + res?.result?.fileToBytes;
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = '100%';
              dialogConfig.height = '90%';
              dialogConfig.disableClose = true;
              dialogConfig.data = {
                title: res?.result?.fileName || 'Hóa đơn điện tử',
                pdf: pdfBase64
              };
              dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
              this.isGetPdfInvoice = false;
            } else {
              this.isGetPdfInvoice = false;
              this.commonService.showMessageByName(res.message || 'Không có dữ liệu hóa đơn điện tử');
            }
          }, (err: any) => {
            this.isGetPdfInvoice = false;
            this.commonService.showMessageByName(err);
          });
          return dialogRef;
        } else {
          this.isGetPdfInvoice = false;
        }
      });
  }

  handleGetPDFInvoiceDraft() {
    let title = 'Có lấy PDF HĐĐT nháp cho phiếu này hay không?';

    this.commonService.openDialog(DialogConfirmComponent, { title: title })
      .afterClosed().subscribe(result => {
        if (result) {
          this.isGetPdfInvoice = true;

          let dialogRef: any = null;
          this.internalSaleDeatailService.getPdfFile(this.ticket, 'draft').subscribe((res: any) => {
            if (res.success && res?.result && res?.result?.fileToBytes) {
              const pdfBase64 = 'data:application/pdf;base64,' + res?.result?.fileToBytes;
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = '100%';
              dialogConfig.height = '90%';
              dialogConfig.disableClose = true;
              dialogConfig.data = {
                title: res?.result?.fileName || 'Hóa đơn điện tử',
                pdf: pdfBase64
              };
              dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
              this.isGetPdfInvoice = false;
            } else {
              this.isGetPdfInvoice = false;
              this.commonService.showMessageByName(res.message || 'Không có dữ liệu hóa đơn điện tử');
            }
          }, (err: any) => {
            this.isGetPdfInvoice = false;
            this.commonService.showMessageByName(err);
          });
          return dialogRef;
        } else {
          this.isGetPdfInvoice = false;
        }
      });
  }

  onCreateDraft() {
    this.isCreateDraftInvoice = true;

    this.internalSaleDeatailService.createDraft(this.ticket).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.commonService.showMessageByName(result.message || 'create_draft_invoice_success');
        } else {
          this.commonService.showMessageByName(result.message || 'Unknown_err');
        }
      },
      error: (err) => {
        this.commonService.showMessageByName('Unknown_err');
        console.error('Draft invoice error:', err);
        this.isCreateDraftInvoice = false;
      },
      complete: () => {
        this.isCreateDraftInvoice = false;
      }
    });
  }
  //#endregion

}



