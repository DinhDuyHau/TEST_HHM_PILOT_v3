
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleOnlineEcommerceService } from './sale-online-ecommerce.service';
import { Merchandise, SaleOnlineEcommerceTicket } from '@app/sales-management/model/ticket/sale-online-ecommerce/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../../component/search/serach-dialog.component';
import { CustomerCreateDialogComponent } from '../../../component/customer/customer-create-dialog/customer-create-dialog.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { Service } from '@app/sales-management/model/ticket/common-model/service.model';
import { DiscountSelectComponent } from '@app/sales-management/component/discount/select/discount-select.component';
import { CommonService } from '../../common/common.service';
import { MerchandiseService } from '../../common/merchandise.service';
import { DiscountService } from '../../common/discount.service';
import { MODE, STATUS_LIST } from '@app/sales-management/enum/ticket.enum';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { GuaranteeApiService } from '@app/sales-management/api/guarantee-api.service';
import { CameraComponent } from '@app/sales-management/component/webcam/webcam.component';
import { ViewImageComponent } from '@app/sales-management/component/view-image/view-image.component';
import { Language } from '../../common/language';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { environment } from '@environments/environment';
import { Package } from '@app/sales-management/model/ticket/common-model/package.model';
import { PromotionSelectComponent } from '@app/sales-management/component/promotion/promotion-select.component';
import { InternalSaleDetailService } from '@app/_components/voucher/inventory/internal-sale/create/internal-sale-detail.service';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';
import { PrinterComponent } from '@app/_components/printer/printer.component';

const { DISCOUNT_LIST,
  GUARANTEE_LIST,
  ECOMMERCE_LIST,
  SERVICE_LIST,
  PACKAGE_LIST,
  OVERVIEW_LIST
} = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-online',
  templateUrl: './sale-online-ecommerce.component.html',
  styleUrls: ['./sale-online-ecommerce.component.scss'],
})
export class SaleOnlineEcommerceComponent implements OnInit, AfterViewInit {
  ticket: SaleOnlineEcommerceTicket = new SaleOnlineEcommerceTicket;
  statusList: StatusTicket[] = [];
  dataFormat = dataFormat;
  title = '';
  discountCanApply: Discount[] = [];
  uploadImageSuccess = false;
  uploading = true;
  ecommerceColumns = ECOMMERCE_LIST;
  serviceColumns = SERVICE_LIST;
  discountColumns = DISCOUNT_LIST;
  packageColumns = PACKAGE_LIST;
  guaranteeColumns = GUARANTEE_LIST;
  overviewColumns = OVERVIEW_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    ma_kh_tmdt: 'ma_kh_tmdt',
    ma_kh: 'ma_kh',
    imei: 'imei',
    ma_vt: 'ma_vt'
  };

  disableSelectStatus = false;
  previewImage = '';
  depositCanApply: any[] = [];
  depositMerchandise: any[] = [];
  depositNameList = '';
  depositTotalPrice = 0;
  tabIndexFocusFirst = 'ma_kh_tmdt';
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  conversionPoints = 0;
  eInvoiceInfoOutput: EInvoiceInfoOutput = new EInvoiceInfoOutput();
  option: Option = new Option;
  entity = TICKET_ENTITY.ONLINE_ECOMMERCE;
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
    { label: 'Gói cước', name: 'packages' },
    { label: 'Chiết khấu', name: 'discount' },
    { label: 'Thông tin đơn TMĐT' },
    { label: 'HĐĐT' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleOnlineEcommerceService: SaleOnlineEcommerceService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private discountService: DiscountService,
    private guaranteeApiService: GuaranteeApiService,
    public internalSaleDeatailService: InternalSaleDetailService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleOnlineEcommerceService.setTicket(this.ticket, this.option);
  }

  // get tabList() {
  //   return [
  //     { label: 'Hàng hoá', count: this.ticket?.merchandise?.length ?? 0 },
  //     { label: 'Dịch vụ', count: this.ticket?.service?.length ?? 0 },
  //     { label: 'Gói cước', count: this.ticket?.packages?.length ?? 0 },
  //     { label: 'Chiết khấu', count: this.ticket?.discount?.length ?? 0 },
  //     { label: 'Thông tin đơn TMĐT' },
  //     { label: 'HĐĐT' }
  //   ];
  // }

  get overviewData() {
    const newOverview = [
      ...this.ticket.merchandise.map(item => this.commonService.mapToOverview(item, 'Hàng hóa', 'merchandise')),
      ...this.ticket.service.map(item => this.commonService.mapToOverview(item, 'Dịch vụ', 'service')),
      ...this.ticket.packages.map(item => this.commonService.mapToOverview(item, 'Gói cước', 'packages'))
    ];

    if (JSON.stringify(newOverview) !== JSON.stringify(this.ticket.overview)) {
      this.ticket.overview = newOverview;
    }
    return this.ticket.overview || [];
  }

  testData() {
    // this.onEnterCustomerCode('001098025044');
    // this.onEnterImeiCode('11SC662VNA00009');
    // this.onEnterImeiCode('11SC664VNA001');
    // this.onEnterImeiCode('0100270081A00015');
    // this.onEnterImeiCode('0100270080A00004');
    // this.onEnterImeiCode('IPV11128B2308016');
    // this.onEnterImeiCode('1030VNA00008');

    // this.onEnterImeiCode('CLFP12MA0001');
    // this.onEnterImeiCode('CSXMA0001');
    // this.onEnterImeiCode('G4S22AA0001');
    // this.onEnterImeiCode('MTIP12NA0001 ');
    // this.onEnterImeiCode('SBAG20A0001');
    // this.onEnterImeiCode('ZEE15CL1A0001');

    // this.onEnterImeiCode('CLFP12MA0002');
    // this.onEnterImeiCode('CSXMA0002');
    // this.onEnterImeiCode('G4S22AA0002');
    // this.onEnterImeiCode('MTIP12NA0002 ');
    // this.onEnterImeiCode('SBAG20A0002');
    // this.onEnterImeiCode('ZEE15CL1A0002');

    // this.onEnterImeiCode('CLFP12MA0003');
    // this.onEnterImeiCode('MTIP12NA0003 ');
    // this.onEnterImeiCode('SBAG20A0003');

  }
  ngAfterViewInit(): void {
    if (!environment.production) {
      // this.testData();
    }
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
      this.ticketApiService.getStatusWithOrder([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.ONLINE_ECOMMERCE }], 'xorder,status').subscribe(result => {
        const allItems = result.result.items as StatusTicket[];
        const currentStatus = this.ticket.masterInfo.status;

        if (currentStatus === '1') {
          // Nếu là "Chờ thanh toán" → loại bỏ "Lập chứng từ", "Hoàn thành"
          this.statusList = allItems.filter(item => item.status !== '0' && item.status !== '2');
        } else if (currentStatus === '0') {
          // Nếu là "Lập chứng từ" → loại bỏ "Chờ thanh toán", "Hoàn thành"
          this.statusList = allItems.filter(item => item.status !== '1' && item.status !== '2');
        } else if (currentStatus === '3') {
          // Nếu là "Chờ phát hành" → chỉ hiện "Chờ phát hành", "Hoàn thành"
          this.statusList = allItems.filter(item => item.status === '3' || item.status === '2');
        }
        else {
          if (this.mode === MODE.VIEW) {
            this.statusList = allItems.filter(item => item.status === currentStatus);
          }
          else
            // Các trạng thái khác → giữ nguyên
            this.statusList = allItems;
        }
      });
    };


    this.route.queryParams.subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.ONLINE_ECOMMERCE, data.key).subscribe((result) => {
          if (result.result) {
            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            //set status để xử lý vấn đề in ngay trên màn hình xem chứng từ
            this.invoice_model_status = (result.result as any).masterInfo.status;

            // Chỉ cho phép sửa khi trạng thái là 0, 1, 3
            if (this.mode === MODE.UPDATE &&
              !((result.result as any).masterInfo.status === STATUS_LIST.SALE_ONLINE_ECOMMERCE.CREATE
                || (result.result as any).masterInfo.status === STATUS_LIST.SALE_ONLINE_ECOMMERCE.PENDING_PAYMENT
                || (result.result as any).masterInfo.status === STATUS_LIST.SALE_ONLINE_ECOMMERCE.PENDING_PUBLISH
              )) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.saleOnlineEcommerceService.loadData(result.result as any as VoucherDto);
            this.handleGetDeposit();
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.tabIndexFocusFirst = this.tabIndex.imei;
            this.commonService.getPointRateExchange(this.ticket, this.option);
            this.saleOnlineEcommerceService.getConversionPoint().subscribe(result => {
              if (result && result.success && result.result !== null) {
                this.conversionPoints = result.result;
                // this.ticket.payment.sd_diem.diem_qd = result.result;
              }
            });

            console.log('end here');

          }
        });
      } else {
        this.saleOnlineEcommerceService.initTicket(this.ticket);
        getStatusList();
        this.commonService.getPointRateExchange(this.ticket, this.option);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh_tmdt;
      }
    });
  }

  // #region customer
  handleAddCustomer(customer: Customer) {
    this.commonService.focusControl2(this.tabIndex.ma_vt);
    this.saleOnlineEcommerceService.removeDiscountForCustomer();
    this.saleOnlineEcommerceService.setInfoCustomer(customer);
    this.handleGetDeposit();
    this.saleOnlineEcommerceService.setIsNeedCalcDiscount(true);
    this.discountService.resetDiscount(this.ticket.discount);
    this.saleOnlineEcommerceService.calcMoney();
    this.saleOnlineEcommerceService.getConversionPoint().subscribe(result => {
      if (result && result.success && result.result !== null) {
        this.conversionPoints = result.result;
        this.ticket.payment.sd_diem.diem_qd = result.result;
      }
    });
  }

  handleGetDeposit() {
    this.saleOnlineEcommerceService.getDeposit().subscribe((result: any) => {
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
        this.saleOnlineEcommerceService.resetCustomerInfo(this.ticket);
        this.addOrUpdateCustomer = 'create';
        this.openAddCustomerDialog(ma_kh);
      }
    });
  }
  onEnterCustomerCodeTMDT(ma_kh: string) {
    this.customerApiService.getOneById(ma_kh).subscribe(result => {
      if (result.success && result.result) {
        const customer: any = result.result;
        this.ticket.masterInfo.ma_kh_tmdt = customer.ma_kh;
        this.ticket.ecommerce.ma_kh_tmdt = customer.ma_kh;
      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleOnlineEcommerceService.resetCustomerInfo(this.ticket);
        this.openAddCustomerDialog(ma_kh, true);
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
  openSearchCustomerTMDTDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.E_COMMERCIAL, title: this.getLabel('tlt_customer_list') }, 'search-style-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => customer && (this.ticket.masterInfo.ma_kh_tmdt = customer.ma_kh) && (this.ticket.ecommerce.ma_kh_tmdt = customer.ma_kh));
  }
  // click button thêm khách hàng
  openAddCustomerDialog(ma_kh = '', isTMDTCode = false): void {
    if (!isTMDTCode) {
      this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh, addOrUpdate: this.addOrUpdateCustomer, ma_ct: TICKET_CODE.ONLINE_ECOMMERCE }, 'fullscreen-dialog')
        .afterClosed()
        .subscribe((customer: Customer) => {
          customer && this.saleOnlineEcommerceService.setInfoCustomer(customer);
        });
    }
  }

  //#endregion

  // #region Guarantee
  handleAddGuarantee(merchandiseResponse: any) {
    this.guaranteeApiService.getOneById(TICKET_ENTITY.RETAIL, { ma_vt: merchandiseResponse.ma_vt, ma_kho: merchandiseResponse.ma_kho }).subscribe(result => {
      if (result && result.success && result?.result?.length) {
        const guarantee = result.result[0];
        this.saleOnlineEcommerceService.addGuaranteeMerchandise(merchandiseResponse, guarantee);
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
          this.saleOnlineEcommerceService.addPromotionMerchandise(discount, merchandiseResponse.ma_imei);
        }
      }

      //mapping các loại phí sàn
      this.handleECommFeeMapping(merchandiseResponse);
      this.commonService.clearText2([this.tabIndex.imei, this.tabIndex.ma_vt]);
      this.commonService.focusControl2(this.tabIndex.imei);
      this.saleOnlineEcommerceService.setIsNeedCalcDiscount(true);
      this.discountService.resetDiscount(this.ticket.discount);
      this.saleOnlineEcommerceService.calcMoney();
    }
  }

  handleECommFeeMapping(ecommerce: any) {
    if (!ecommerce.ecomm_fee) return;
    const detail_item = this.ticket.merchandise.find(x => x.ma_imei.trim() === ecommerce.ma_imei.trim());
    if (!detail_item) return;
    const arr_fee: any[] = ecommerce.ecomm_fee;
    for (let item of arr_fee) {
      if (item.ma_loai === '01') detail_item.phi_san_01 += item.tien_phi_san;
      if (item.ma_loai === '02') detail_item.phi_san_02 += item.tien_phi_san;
      if (item.ma_loai === '03') detail_item.phi_san_03 += item.tien_phi_san;
      if (item.ma_loai === '04') detail_item.phi_san_04 += item.tien_phi_san;
      if (item.ma_loai === '05') detail_item.phi_san_05 += item.tien_phi_san;
      if (item.ma_loai === '06') detail_item.phi_san_06 += item.tien_phi_san;
      if (item.ma_loai === '07') detail_item.phi_san_07 += item.tien_phi_san;
      if (item.ma_loai === '08') detail_item.phi_san_08 += item.tien_phi_san;
      if (item.ma_loai === '09') detail_item.phi_san_09 += item.tien_phi_san;
      if (item.ma_loai === '10') detail_item.phi_san_10 += item.tien_phi_san;
      detail_item.tong_phi += item.tien_phi_san;


      //phí hoàng hà
      if (item.tl_phi !== 0 && item.tien_phi_san !== 0) detail_item.phi_san_hhm += item.phi_hoang_ha;
    }
    detail_item.tong_phi += detail_item.phi_dc_khac;
    detail_item.tong_phi = Math.round(detail_item.tong_phi);
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
    //check nhập mã sàn TMĐT
    if (!this.ticket.masterInfo.ma_kh_tmdt || this.ticket.masterInfo.ma_kh_tmdt.trim() === '') {
      this.commonService.showMessage('Chưa nhập thông tin sàn TMĐT');
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
    this.saleOnlineEcommerceService.getImeiInStore(ma_imei, this.ticket.masterInfo.ma_kh_tmdt, ngay_ct).subscribe(result => {
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
        //     this.commonService.addImeiToStorage(ma_imei);
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
    //check nhập mã sàn TMĐT
    if (!this.ticket.masterInfo.ma_kh_tmdt || this.ticket.masterInfo.ma_kh_tmdt.trim() === '') {
      this.commonService.showMessage('Chưa nhập thông tin sàn TMĐT');
      return;
    }

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
      this.saleOnlineEcommerceService.removePromotionMechandise(merchandise);
    } else {
      this.saleOnlineEcommerceService.removeMerchandise(merchandise);
      this.handleCheckDeposit(merchandise.ma_vt, false);
      this.saleOnlineEcommerceService.setIsNeedCalcDiscount(true);
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
    this.saleOnlineEcommerceService.onChangePromotionalDebt(event, this.ticket);
  }
  // #endregion merchandise

  // #region discount
  openCalcDiscountDialog() {
    // if (!this.ticket.masterInfo.ma_kh) {
    //   this.commonService.showMessageByName('invalid_cus_discount');
    //   return;
    // }
    const openDialog = (dataSource: Discount[], currentItem: Discount[]) => {
      this.commonService.openDialog(DiscountSelectComponent, { dataSource: dataSource, currentItem: currentItem })
        .afterClosed().subscribe(discountSelected => {
          if (discountSelected) {
            // const { discountAdded, disocuntRemoved } = this.discountService.getDiscountsCodeRemovedAndSelected(discountSelected, this.ticket.discount);
            // this.retailService.addDiscount(discountAdded);
            // this.retailService.removeDiscount(disocuntRemoved);
            this.saleOnlineEcommerceService.updateDiscount(discountSelected);
          }
        });
    };

    const discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount);
    const rs = this.saleOnlineEcommerceService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          // Mảng này dùng để đánh dấu đối với loại chiết khấu 06
          // Lúc chưa chọn thì sẽ chọn chiết khấu nào thì áp dụng với các mã vật tư vào chiết khấu ưu tiên cao nhất để tính ra tiền chiết khấu có lợi nhất cho khách
          // Khi chọn hoặc bỏ chiết khấu thì phải thực hiện tính toán lại tiền chiết khấu tương ứng và tính xem các chiết khấu khác sẽ có áp dụng được không ngay trên lúc thay đổi
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          // const discountsInvalid = this.discountService.getDiscountsInValid(this.discountCanApply, this.ticket.discount);
          // this.retailService.removeDiscount(discountsInvalid);
          openDialog(this.discountCanApply, discountCurrent);
        }
      });
    } else {
      openDialog(this.discountCanApply, discountCurrent);
    }
  }

  onRemoveDiscount(event: { item: Discount }) {
    if (event.item.loai_ck === DISCOUNT_TYPE.GIFT) {
      this.commonService.showMessageByName('lblWarningNotDeleteDiscountGift');
      return;
    }
    const discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount.filter(x => x.ma_ck !== event.item.ma_ck));
    const rs = this.saleOnlineEcommerceService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
          this.saleOnlineEcommerceService.updateDiscount(discountAfterRemove);
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
    this.saleOnlineEcommerceService.addServiceForMerchandise(event.item, this.ticket);
  }

  onUpdateService(event: { item: Merchandise }) {
    this.saleOnlineEcommerceService.updateServiceForMerchandise(event.item);
  }


  // click button add service
  onRemoveService(event: { item: Service }) {
    if (event.item.km_yn) {
      this.saleOnlineEcommerceService.removePromotionService(event.item);
    } else {
      this.saleOnlineEcommerceService.removeService(event.item, this.ticket);
    }
  }
  // #endregion service

  // #region package
  onAddPackage(event: { item: Merchandise }) {
    this.saleOnlineEcommerceService.addPackageForMerchandise(event.item, this.ticket)
  }

  onRemovePackage(event: { item: Package }) {
    this.saleOnlineEcommerceService.removePackage(event.item, this.ticket)
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

  onChangeEcommFee() {
    this.saleOnlineEcommerceService.calcTotalMoney();
  }

  // Submit
  onSave() {
    // Check âm tiền nợ
    if (this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
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

    const message = this.saleOnlineEcommerceService.validateTicket(this.ticket);
    this.invalid = this.commonService.isInValidPayment(this.ticket.payment) || this.saleOnlineEcommerceService.isInvalidForm(this.ticket.masterInfo);
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.saleOnlineEcommerceService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.ONLINE_ECOMMERCE, voucherDto).subscribe(result => {
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
              //     this.router.navigate(['sales/online']);
              //   });
              // }
              // else {
              //   this.router.navigate(['sales/online']);
              // }
              this.router.navigate(['sales/online']);
            } else {
              this.commonService.handleResponseErrorVoucher(result, 'sales/online');
            }
          });
        } else if (this.mode === MODE.CREATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.ONLINE_ECOMMERCE, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessageByName(result.message || Language.content.Successful_Create);
              this.router.navigate(['sales/online']);
            } else {
              this.commonService.handleResponseErrorVoucher(result, 'sales/online');
            }
          });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['sales/online']);
    // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/online']);
    //     } else {
    //       this.commonService.showMessage('Lỗi update state của hàng hóa');
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/online']);
    // }

  }

  getLabel(label: string) {
    return this.commonService.getMessage(label);
  }

  onChange_dien_giai(event: any) {
    this.ticket.masterInfo.dien_giai = event;
  }

  handleProcessImei(ma_imei: string) {
    this.ma_imei = ma_imei;

    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    this.saleOnlineEcommerceService.getImeiInStore(this.ma_imei, this.ticket.masterInfo.ma_kh_tmdt, ngay_ct).subscribe(result => {
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
      const { hd_mst, hd_ten_kh, hd_dia_chi, hd_nguoi_mua } = this.ticket.masterInfo;

      if (objEinvoice == '0' && (!hd_nguoi_mua)) {
        this.commonService.showMessageByName('invoice_individuals_info');
        return;
      }
      if (objEinvoice == '1' && (!hd_mst || !hd_ten_kh || !hd_dia_chi)) {
        this.commonService.showMessageByName('invoice_bussiness_info');
        return;
      }
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
    if (this.ticket.masterInfo.status === '0' || this.allowAdminEdit()) {
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

  //#region Readonly
  isInputDisabled() {
    const discountList = this.ticket?.discount ?? [];

    const hasSelectedPayment = Object.values(this.ticket?.payment ?? {}).some(p => p?.selected === true);
    return hasSelectedPayment || this.invoice_model_status === '1' || this.invoice_model_status === '3';
  }

  isDiscountReadonly(): boolean {
    return this.readonly || this.invoice_model_status === '3';
  }

  isInputDisabledStatus(): boolean {
    const hasReadonlyOrDisabled = this.readonly || this.disableSelectStatus;
    return hasReadonlyOrDisabled;
  }

  isInputReadonly() {
    const discountList = this.ticket?.discount ?? [];

    const isReadonlyFlag = this.readonly;
    const hasSelectedPayment = Object.values(this.ticket?.payment ?? {}).some(p => p?.selected === true);

    return isReadonlyFlag || hasSelectedPayment || this.invoice_model_status === '3';
  }

  //#endregion

  allowAdminEdit(): boolean {
    const user_authorization = JSON.parse(localStorage.getItem('authorization')!);

    return user_authorization && user_authorization.sa_yn;
  }

}
