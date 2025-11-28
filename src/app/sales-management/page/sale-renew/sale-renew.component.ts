import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleRenewService } from './sale-renew.service';
import { Merchandise, MerchandiseUsed, RenewSaleTicketCreate } from '@app/sales-management/model/ticket/sale-renew/model';
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
import { DomSanitizer } from '@angular/platform-browser';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';
import { VoucherCodeService } from '../common/voucher-code.service';
import { InternalSaleDetailService } from '@app/_components/voucher/inventory/internal-sale/create/internal-sale-detail.service';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { isValidEmail, isValidTaxcode } from '@app/_common/commonFunction';
import { CryptoService, FuncExtendService } from '@app/_utils';

const { DISCOUNT_LIST,
  GUARANTEE_LIST,
  MERCHANDISE_LIST_RENEW,
  MERCHANDISE_THU_CU_LIST,
  SERVICE_LIST,
  PACKAGE_LIST,
  OVERVIEW_LIST,
  VOUCHER_CODE_LIST
} = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-sale-renew',
  templateUrl: './sale-renew.component.html',
  styleUrls: ['./sale-renew.component.scss'],
})
export class SaleRenewComponent implements OnInit, AfterViewInit {
  ticket: RenewSaleTicketCreate = new RenewSaleTicketCreate;
  oldTicketData: RenewSaleTicketCreate = new RenewSaleTicketCreate;
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
  overviewColumns = OVERVIEW_LIST;
  voucherCodeColumns = VOUCHER_CODE_LIST;
  mode!: number;
  submitButtonTitle!: string;
  cancelButtonTitle!: string;
  readonly = false;
  invalid = false;
  invalidMerchandiseInput = { ma_vt: false, gia_nt: false, loai_hh: false, imei_used: false };
  isSaving = false;
  isDisabled = false;
  tabIndex = {
    ma_kh: 'ma_kh',
    nvvc: 'nvvc',
    ma_loai: 'ma_loai',
    ma_vt: 'ma_vt',
    ma_vt_new_sale: 'ma_vt_new_sale',
    gia_nt: 'gia_nt',
    imei_used: 'imei_used',
    imei_new_sale: 'imei_new_sale',
    ten_vt: 'ten_vt',
    ma_ncc: 'ma_ncc',
  };
  disableSelectSatus = false;
  previewImage = '';
  tabIndexFocusFirst = 'ma_kh';
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
  ma_imei = '';
  ma_kh_label = 'Mã khách';
  addOrUpdateCustomer = 'create';
  isValidItemOld = false;
  voucherCode = TICKET_CODE.RENEW;
  voucher_code = ''; // Mã giảm giá
  isCheckingVoucher = false;
  isCreateDraftInvoice = false;
  isGetInvoice = false;
  isGetPdfInvoice = false;
  invoice_model_status = '0';
  current_renew_item: any = null;
  isPublistEInvoice = false;

  tab_sources: any[] = [
    { label: 'Tổng quan' },
    { label: 'Hàng hoá', name: 'merchandise_new_sale' },
    { label: 'Dịch vụ', name: 'service' },
    { label: 'Gói cước', name: 'packages' },
    { label: 'Chiết khấu', name: 'discount' },
    { label: 'Mã giảm giá', name: 'voucherCode' },
    { label: 'Hàng thu cũ', name: 'merchandise_used' },
    { label: 'Vận chuyển' },
    { label: 'HĐĐT' }
  ];

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
    private lookup_service: LookupApiService,
    private sanitizer: DomSanitizer,
    private voucherCodeService: VoucherCodeService,
    public internalSaleDeatailService: InternalSaleDetailService,
    public funcExtService: FuncExtendService,
    public cryptoService: CryptoService,
  ) {
    localStorage.setItem('useGridCached', '1');
    this.saleRenewService.setTicket(this.ticket, this.option);
  }

  // get tabList() {
  //   return [
  //     { label: 'Hàng hoá', count: this.ticket?.merchandise_new_sale?.length ?? 0 },
  //     { label: 'Dịch vụ', count: this.ticket?.service?.length ?? 0 },
  //     { label: 'Gói cước', count: this.ticket?.packages?.length ?? 0 },
  //     { label: 'Chiết khấu', count: this.ticket?.discount?.length ?? 0 },
  //     { label: 'Hàng thu cũ', count: this.ticket?.merchandise_used?.length ?? 0 },
  //     { label: 'Vận chuyển' },
  //     { label: 'HĐĐT' }
  //   ];
  // }

  get overviewData() {
    const newOverview = [
      ...this.ticket.merchandise_new_sale.map(item => this.commonService.mapToOverview(item, 'Hàng hóa', 'merchandise_new_sale')),
      ...this.ticket.service.map(item => this.commonService.mapToOverview(item, 'Dịch vụ', 'service')),
      ...this.ticket.packages.map(item => this.commonService.mapToOverview(item, 'Gói cước', 'packages')),
      ...this.ticket.merchandise_used.map(item => this.commonService.mapToOverview(item, 'Hàng thu cũ', 'merchandise_used'))
    ];

    if (JSON.stringify(newOverview) !== JSON.stringify(this.ticket.overview)) {
      this.ticket.overview = newOverview;
    }
    return this.ticket.overview || [];
  }

  testData() {
    // this.onEnterCustomerCode('gen');
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

    this.getStatusList();
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

            //set status để xử lý vấn đề in ngay trên màn hình xem chứng từ
            this.invoice_model_status = (result.result as any).masterInfo.status;

            // Chỉ cho phép sửa khi trạng thái là 0, 1, 3
            if (this.mode === MODE.UPDATE &&
              !((result.result as any).masterInfo.status === STATUS_LIST.SALE_RENEW.CREATE
                || (result.result as any).masterInfo.status === STATUS_LIST.SALE_RENEW.PENDING_PAYMENT
                || (result.result as any).masterInfo.status === STATUS_LIST.SALE_RENEW.PENDING_PUBLISH
              )) {
              this.router.navigate(['/404']);
            }

            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.saleRenewService.loadData(result.result as any as VoucherDto, () => {
              // lấy tien_ck_max khi ban đầu load data
              const discountForMerchandise10 = this.ticket.discount.filter((e: any) => e.loai_ck === DISCOUNT_TYPE.DISCOUNT_VOUCHER_CODE);
              discountForMerchandise10.forEach((discount: any) => {
                if (discount && discount.imei_hang_mua) {
                  this.commonService.voucherCheck(discount.imei_hang_mua, '', '', '', []).subscribe({
                    next: (voucherResult: any) => {
                      if (voucherResult?.Info) {
                        discount.tien_ck_max = voucherResult.Info.DiscountPrice || 0;
                      }
                    },
                    error: () => { }
                  });
                }
              });
            });
            this.commonService.addToImeisInVoucher(this.ticket.merchandise_new_sale.filter(e => e.ma_imei).map(e => e.ma_imei));
            this.getStatusList();
            getDefaultStock();
            this.commonService.getPointRateExchange(this.ticket, this.option);

            this.saleRenewService.getConversionPoint().subscribe(result => {
              if (result && result.success && result.result !== null) {
                this.conversionPoints = result.result;
                // this.ticket.payment.sd_diem.diem_qd = result.result;
              }
            });

            this.ticketApiService.getColorRank({ ma_hang: this.ticket.masterInfo.ma_hang }).subscribe(result => {
              if (result && result.success) {
                const { ma_hang, mau_chu } = result.result as any;
                this.generateLabelWithColor(ma_hang, mau_chu);
              }
            });

            this.tabIndexFocusFirst = this.tabIndex.imei_used;
          }

          // nếu action = UPDATE|VIEW: copy data gốc của ticket trước khi thực hiện sửa
          if (this.mode === MODE.UPDATE || this.mode === MODE.VIEW) {
            this.oldTicketData = this.funcExtService.deepCopy(this.ticket);
          }
        });
      } else {
        this.saleRenewService.initTicket(this.ticket);
        this.getStatusList();
        getDefaultStock();
        this.commonService.getPointRateExchange(this.ticket, this.option);
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
      }
    });
  }

  getStatusList = () => {
    this.ticketApiService.getStatusWithOrder([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.RENEW }], 'xorder,status').subscribe(result => {
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

  // #region customer
  handleAddCustomer(customer: Customer) {
    const ma_kh_old = this.ticket.masterInfo.ma_kh ? this.ticket.masterInfo.ma_kh : '';
    const ma_kh_new = customer ? customer.ma_kh : '';
    const msg_confirm_change = 'Có thay đổi mã khách, hệ thống sẽ tự động xóa các chương trình chiết khấu đã áp dụng trên phiếu. Xác nhận thực hiện?';
    const style_css = 'font-size:16px;';
    if (ma_kh_old !== '' && ma_kh_old !== ma_kh_new) {
      this.commonService.openDialog(DialogConfirmComponent, { title: msg_confirm_change, style_css: style_css })
        .afterClosed().subscribe(result => {
          if (!result) {
            //không xác nhận => reset về mã cũ
            this.customerApiService.getOneById(ma_kh_old).subscribe(result => {
              if (result.success && result.result) {
                const customer: any = result.result;
                this.saleRenewService.setInfoCustomer(customer);
                this.ticketApiService.getRankCustomer({ ma_kh: customer.ma_kh }).subscribe(result => {
                  const { ma_hang, mau_chu, tl_tich_diem } = result.result as any;
                  this.ticket.masterInfo.ma_hang = ma_hang || '';
                  this.ticket.masterInfo.tl_tich_diem = tl_tich_diem || 0;
                  this.generateLabelWithColor(ma_hang, mau_chu);
                });
              }
            });
            return;
          }
          // xóa và reset ck 09 khi xác nhận => reset
          this.resetDiscount09();
        });
    }

    this.commonService.focusControl2(this.tabIndex.nvvc);
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

        this.ticketApiService.getRankCustomer({ ma_kh: customer.ma_kh }).subscribe(result => {
          const { ma_hang, mau_chu, tl_tich_diem } = result.result as any;
          this.ticket.masterInfo.ma_hang = ma_hang;
          this.ticket.masterInfo.tl_tich_diem = tl_tich_diem;
          this.generateLabelWithColor(ma_hang, mau_chu);
          this.handleAddCustomer(customer);

          // Kiểm tra điều kiện mở dialog
          if (this.commonService.shouldOpenDialog(customer)) {
            // mở dialog add khách hàng nhưng ở chế độ update
            this.addOrUpdateCustomer = 'update';
            this.openAddCustomerDialog(customer.ma_kh);
          }
        });

      } else {
        this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
        this.saleRenewService.resetCustomerInfo(this.ticket);
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

        customer && this.ticketApiService.getRankCustomer({ ma_kh: customer.ma_kh }).subscribe(result => {
          const { ma_hang, mau_chu, tl_tich_diem } = result.result as any;
          this.ticket.masterInfo.ma_hang = ma_hang;
          this.ticket.masterInfo.tl_tich_diem = tl_tich_diem;
          this.generateLabelWithColor(ma_hang, mau_chu);
          this.handleAddCustomer(customer);

          // Kiểm tra điều kiện mở dialog
          if (this.commonService.shouldOpenDialog(customer)) {
            // mở dialog add khách hàng nhưng ở chế độ update
            this.addOrUpdateCustomer = 'update';
            this.openAddCustomerDialog(customer.ma_kh);
          }
        });

      });
  }

  // click button thêm khách hàng
  openAddCustomerDialog(ma_kh = ''): void {
    this.commonService.openDialog(CustomerCreateDialogComponent, { ma_kh: ma_kh, addOrUpdate: this.addOrUpdateCustomer }, 'fullscreen-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        if (this.addOrUpdateCustomer == 'create') {
          this.ticket.masterInfo.ma_hang = '';
          this.handleAddCustomer(customer);
        }
        customer && this.saleRenewService.setInfoCustomer(customer);
      });
  }
  //#endregion

  // #region delivery empl
  handleAddDeliveryEmpl(empl: any) {
    this.ticket.masterInfo.ma_nvvc = empl.ma_kh;
    this.ticket.masterInfo.ten_nvvc = empl.ten_kh;
    this.commonService.focusControl2(this.tabIndex.imei_used);
  }

  onEnterDECode(ma_nvvc: string) {
    if (!ma_nvvc) {
      this.commonService.focusControl2(this.tabIndex.imei_used);
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
        this.resetDetail();
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
      this.updateImeiSale();
      this.commonService.clearText2([this.tabIndex.imei_new_sale, this.tabIndex.ma_vt_new_sale]);
      this.commonService.focusControl2(this.tabIndex.imei_new_sale);
      this.saleRenewService.setIsNeedCalcDiscount(true);
      this.discountService.resetDiscount(this.ticket.discount);
      this.saleRenewService.calcMoney();
      // khi add imei xử lý ck 09
      this.applyDiscount09ForMerchandise(merchandiseResponse);
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
    this.commonService.clearText2([this.tabIndex.ma_loai, this.tabIndex.ma_vt, this.tabIndex.ten_vt, this.tabIndex.gia_nt]);
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
                this.commonService.clearText2([this.tabIndex.imei_used]);
                this.onRefreshRenew();
              }
            }
            else {
              this.renew.new_imei_yn = true;
              this.addImeiOldMerchandise(ma_imei);
              this.commonService.clearText2([this.tabIndex.imei_used]);
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

          // gán isValidItemOld = false để KHÔNG cho chọn vt khi vt đã có trong hệ thống
          this.isValidItemOld = false;
        } else {
          // gán isValidItemOld = true để cho chọn vt khi vt ko có trong hệ thống
          this.isValidItemOld = true;
        }
      }
    });
  }

  //#region Enter tại ô imei bán ra
  onEnterImeiNewMerchandiseCode(ma_imei: string, isEnterImei: boolean = true) {
    if (this.ticket.masterInfo.ten_kh == '') {
      this.commonService.showMessage('Mã khách hàng không được để trống');
      return;
    }
    if (!ma_imei || ma_imei.length < 5) {
      this.commonService.showMessage('Imei cần ít nhất 5 ký tự để tìm kiếm');
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
      this.onEnterImeiSell(ma_imei, '', '', 0, isEnterImei);
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
                this.commonService.clearText2([this.tabIndex.imei_used]);
                this.onRefreshRenew();
              }
            }
            else {
              this.renew.new_imei_yn = true;
              this.addImeiOldMerchandise(ma_imei);
              this.commonService.clearText2([this.tabIndex.imei_used]);
              this.onRefreshRenew();
            }
          }

          /* add imei hàng bán ra */
          this.onEnterImeiSell(ma_imei, imei_thu_cu, ma_vt_thu_cu, gia_thu_cu, isEnterImei);
        });
      }
    }
    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
  }

  onEnterImeiSell(ma_imei: string, imei_thu_cu: string, ma_vt_thu_cu: string, tien_thu_cu: number = 0, isEnterImei: boolean = true) {
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
        //2025-08-25: KHÓA KHÔNG MỞ DIALOG TÌM KIẾM IMEI GẦN ĐÚNG THEO KÝ TỰ NHẬP
        /*
        if (isEnterImei) {
          /*
          * Ko đúng imei sẽ mở dialog tìm kiếm
          /
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          this.commonService.openDialog(SearchDialogComponent, {
            keyword: ma_imei,
            shop: user.shop,
            componentName: SEARCH_COMPONENT_NAME.IMEI_SEARCH_SALES,
            title: 'Danh sách kết quả tìm kiếm imei',
            isFilter: false
          }, 'search-style-dialog')
            .afterClosed().subscribe(result => {
              if (result && result.ma_imei) {
                this.ma_imei = result.ma_imei;
                this.processRenewSale(this.ma_imei, ma_vt_thu_cu, imei_thu_cu, ngay_ct, tien_ho_tro, tien_thu_cu);
              }
            });
        } else {
          if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise_new_sale)) {
            this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
            return;
          }
          this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: ma_imei });
        }
        */
        // 2025-08-25: code thay thế
        // Hiển thị thông báo không tồn tại imei bán, và reset tab Hàng thu cũ
        if (this.ticket.merchandise_used && this.ticket.merchandise_used.length > 0) {
          this.renew.ma_imei = this.ticket.merchandise_used[0].ma_imei;
          this.renew.ma_vt = this.ticket.merchandise_used[0].ma_vt;
          this.renew.ten_vt = this.ticket.merchandise_used[0].ten_vt;
          this.renew.dvt = this.ticket.merchandise_used[0].dvt;
          this.renew.ma_kho = this.ticket.merchandise_used[0].ma_kho;
          if (this.current_renew_item && this.current_renew_item.ma_loai.trim().toLowerCase() === this.ticket.merchandise_used[0].ma_loai.trim().toLocaleLowerCase()) {
            this.renew.loai_hh = this.current_renew_item.ten_loai;
            this.renew.ma_loai = this.current_renew_item.ma_loai;
            this.renew.gia_nt = this.current_renew_item.gia_nt;
            this.ticket.masterInfo.ma_ncc = this.current_renew_item.ma_kh;
          }
          else {
            this.resetRew();
          }

          //clear items
          this.ticket.merchandise_used.splice(0, this.ticket.merchandise_used.length);
          this.saleRenewService.calcMoney();
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
        /* false: ko phải enter imei */
        this.onEnterImeiNewMerchandiseCode(result.ma_imei, false);
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
            this.current_renew_item = result;

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
    this.ticket.service = [];
    this.saleRenewService.removeUsedMerchandise(event.item);
  }

  handleRemoveMerchandise(merchandise: Merchandise) {
    if (merchandise.km_yn) {
      this.saleRenewService.removePromotionMechandise(merchandise);
    } else {
      this.saleRenewService.removeMerchandise(merchandise);
      this.saleRenewService.setIsNeedCalcDiscount(true);
      this.handleRemoveDiscountProgram(merchandise.ma_imei);
      this.removeDiscount09(merchandise.ma_imei);
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
    if (event.item.loai_ck === DISCOUNT_TYPE.DISCOUNT_CUSTOMER_RANK) {
      this.commonService.showMessage('Không thể xóa chiết khấu hạng khách hàng');
      return;
    }
    let isVoucherDiscount = event.item.loai_ck == DISCOUNT_TYPE.DISCOUNT_VOUCHER_CODE;
    if (isVoucherDiscount) {
      this.ticket.discount = this.ticket.discount.filter(
        x => !(x.ma_ck.trim().toLowerCase() === event.item.ma_ck.trim().toLowerCase() &&
          x.imei_hang_mua.trim().toLowerCase() === event.item.imei_hang_mua.trim().toLowerCase())
      );
      this.ticket.voucherCode = this.ticket.voucherCode.filter(
        (i) => i.ma_voucher.trim().toLowerCase() !== event.item.imei_hang_mua.trim().toLowerCase()
      );
    }
    const discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount.filter(x => x.ma_ck !== event.item.ma_ck));
    const rs = this.saleRenewService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
          this.saleRenewService.updateDiscount(discountAfterRemove, false, null, isVoucherDiscount);
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
    //loại bỏ các mã imei là chuỗi rỗng
    mechandise_dup = mechandise_dup.filter((x: any) => x.ma_imei && x.ma_imei !== '')
    if (mechandise_dup && mechandise_dup.length > 0) {
      const duplicate_imeis = mechandise_dup.join(',');
      this.commonService.showMessage(`Các imei xuất hiện nhiều lần trong chi tiết phiếu: ${duplicate_imeis}`);
      return;
    }

    // Kiểm tra tiền thuế != thành tiền x thuế suất ở các tab hàng hóa, dịch vụ, gói cước
    const invalid_tax_merchandise = this.ticket.merchandise_new_sale.some(x => !(x.tien_thue + 2 > Math.round(x.thanh_tien * x.thue_suat / 100) && x.tien_thue - 2 < Math.round(x.thanh_tien * x.thue_suat / 100)));
    if (invalid_tax_merchandise) {
      this.commonService.showMessage('Tiền thuế của tab "Hàng hóa" không đúng với công thức (tiền thuế = thành tiền x thuế suất)');
      return;
    }
    const invalid_tax_service = this.ticket.service.some(x => !(x.tien_thue + 2 > Math.round(x.thanh_tien * x.thue_suat / 100) && x.tien_thue - 2 < Math.round(x.thanh_tien * x.thue_suat / 100)));
    if (invalid_tax_service) {
      this.commonService.showMessage('Tiền thuế của tab "Dịch vụ" không đúng với công thức (tiền thuế = thành tiền x thuế suất)');
      return;
    }
    const invalid_tax_package = this.ticket.packages.some(x => !(x.tien_thue + 2 > Math.round(x.thanh_tien * x.thue_suat / 100) && x.tien_thue - 2 < Math.round(x.thanh_tien * x.thue_suat / 100)));
    if (invalid_tax_package) {
      this.commonService.showMessage('Tiền thuế của tab "Gói cước" không đúng với công thức (tiền thuế = thành tiền x thuế suất)');
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
              this.commonService.showMessageByName(result.message || Language.content.Update_Completed);
              // if (this.ticket.masterInfo.status == '2') {
              //   this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
              //     if (res.success) {
              //       this.commonService.showMessageByName(res.message);
              //     }
              //     this.router.navigate(['sales/renew']);
              //   });
              // }
              // else {
              //   this.router.navigate(['sales/renew']);
              // }
              this.router.navigate(['sales/renew']);
            } else {
              this.commonService.handleResponseErrorVoucher(result, 'sales/renew');
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
              this.commonService.showMessageByName(result.message || Language.content.Successful_Create);
              this.router.navigate(['sales/renew']);
            } else {
              this.commonService.handleResponseErrorVoucher(result, 'sales/renew');
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
          const sale_item = this.ticket.merchandise_new_sale.find(x => x.ma_imei.toString().toUpperCase().trim() === event.item.gc_td1.toUpperCase().trim());

          // const ngay_ct = new Date(`${this.ticket.masterInfo.ngay_ct}Z`);
          let ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
          const vc_date = formatDate(ngay_ct, 'yyyy/MM/dd', 'en_US');
          ngay_ct = new Date(`${vc_date}Z`);

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

  processRenewSale(
    ma_imei: string,
    ma_vt_thu_cu: string,
    imei_thu_cu: string,
    ngay_ct: Date,
    tien_ho_tro: number,
    tien_thu_cu: number
  ): void {
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
          const foundItem = this.ticket.merchandise_used.find(x => x.gc_td1.trim() === imei_ban);
          if (foundItem) {
            foundItem.ma_kho = ma_kho_nhap;
          }
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

  resetDetail() {
    this.ticket.merchandise_new_sale = [];
    this.ticket.merchandise_used = [];
    this.ticket.discount = [];
    this.ticket.service = [];
    this.ticket.packages = [];
    this.ticket.guarantee = [];
  }

  updateImeiSale() {
    this.ticket.merchandise_new_sale.map(newSaleItem => {
      const correspondingUsedItem = this.ticket.merchandise_used.find(
        usedItem => usedItem.line_nbr === newSaleItem.line_nbr
      );

      if (correspondingUsedItem) {
        correspondingUsedItem.gc_td1 = this.ma_imei || newSaleItem.ma_imei;
      }
    });
  }

  //#region Chiết khấu 09
  applyDiscount09ForMerchandise(merchandiseResponse: any) {
    const ma_kh = this.ticket.masterInfo.ma_kh ? this.ticket.masterInfo.ma_kh.trim() : '';
    const ma_hang = this.ticket.masterInfo.ma_hang ? this.ticket.masterInfo.ma_hang.trim() : '';
    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    const ma_imei = merchandiseResponse.ma_imei ? merchandiseResponse.ma_imei.trim() : '';
    const ma_vt = merchandiseResponse.ma_vt ? merchandiseResponse.ma_vt.trim() : '';

    this.imeiApiService.getDiscountRankCustomer(ma_kh, ma_hang, ngay_ct, ma_imei, ma_vt, TICKET_CODE.RENEW).subscribe((res: any) => {
      if (res.success && res.result) {
        const discount = res.result[0] as any;
        // add vào tab ck
        if (discount) {
          this.discountService.addNew([discount], this.ticket.discount);
        }
        // tính lại tiền khi có ck
        this.saleRenewService.calcMoney();
      } else {
        // tính lại tiền khi ko có ck
        this.saleRenewService.calcMoney();
      }
    });
  }

  removeDiscount09(ma_imei: string) {
    this.ticket.discount = this.ticket.discount.filter(item => item.ma_imei.trim().toUpperCase() !== ma_imei.trim().toUpperCase());

    // tính lại tiền
    this.saleRenewService.calcMoney();
  }

  /*
  * Xử lý label hạng khách hàng
  */
  generateLabelWithColor(ma_hang: any, mau_chu: any) {
    const rankColors = {
      'BRONZE': 'white',
      'DIAMOND': 'white',
      'GOLD': 'white',
      'MEMBER': 'white',
      'STUDENT': 'white',
    };

    let textColor = rankColors[ma_hang as keyof typeof rankColors] || 'black';

    this.ticket.masterInfo.ma_hang = ma_hang;

    const html = ma_hang ? `
          Mã khách (Hạng:
              <span class="bg-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style="background-color: ${mau_chu} !important; color: ${textColor} !important;">
              ${ma_hang}
              </span>
          )` : 'Mã khách';

    this.ma_kh_label = this.sanitizer.bypassSecurityTrustHtml(html) as string;
  }

  resetDiscount09() {
    this.ticket.discount = this.ticket.discount.filter(item => item.loai_ck !== DISCOUNT_TYPE.DISCOUNT_CUSTOMER_RANK);

    this.ticket.merchandise_new_sale.map(item => {
      this.applyDiscount09ForMerchandise(item);

      item.tl_ck09 = 0;
      item.tien_kb09 = 0;
      item.tien_max09 = 0;
      item.tien_ck09 = 0;
      item.tl_ck_sau_vat09 = 0;
    })
  }

  handleRemoveDiscout09(event: { item: string }) {
    const msg_confirm_change = 'Bạn có chắc chắn xóa chiết khấu hạng thành viên !';
    this.commonService.openDialog(DialogConfirmComponent, { title: msg_confirm_change, style_css: 'font-size:16px;' })
      .afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        // xóa ck 09 khi xác nhận
        this.resetDiscount09ByImei(event);
      });
  }

  resetDiscount09ByImei(event: { item: string }) {
    const merchandise = event.item as any;
    const ma_imei = merchandise.ma_imei || '';
    const ma_hang_backup = this.ticket.masterInfo.ma_hang || '';

    this.ticket.discount = this.ticket.discount.filter(item => !(item.loai_ck === DISCOUNT_TYPE.DISCOUNT_CUSTOMER_RANK
      && item.ma_imei && item.ma_imei.trim().toLowerCase() === ma_imei.trim().toLowerCase())
    );

    // set bằng rỗng ma_hang
    // 2025-10-06: bỏ clear mã hạng do chỉ xóa tiền ck09 cho item chỉ định, item khác có thể vẫn giữ ck09
    // this.ticket.masterInfo.ma_hang = '';

    this.ticket.merchandise_new_sale.map(item => {
      if (item.ma_imei && item.ma_imei.trim().toLowerCase() == ma_imei.trim().toLowerCase()) {
        // thực hiện clear ck09 cho item nên chỉ xử lý reset tiền & tỷ lê ck = 0, 
        // không cần gửi request (comment code dưới)
        /*
        this.applyDiscount09ForMerchandise(item);
        */
        item.tl_ck09 = 0;
        item.tien_kb09 = 0;
        item.tien_max09 = 0;
        item.tien_ck09 = 0;
        item.tl_ck_sau_vat09 = 0;
      }
    });

    // tính lại tiền
    this.saleRenewService.calcMoney();

    // nếu vẫn còn áp dụng ck 09 thì gán ngược lại mã cũ
    this.ticket.masterInfo.ma_hang = ma_hang_backup;
  }
  //#endregion

  //#region Mã giảm giá
  handleChangeVoucherCode($event: any) {
    if (this.isCheckingVoucher) return;

    this.voucher_code = $event;

    // valid voucher code
    const message = this.voucherCodeService.validVoucherCode(this.ticket);
    if (message) return this.commonService.showMessage(message);

    // Lấy danh sách mã vật tư trong phiếu bán
    const skus = this.ticket.merchandise_new_sale
      .map(item => item.ma_vt?.trim().toLowerCase())
      .filter(Boolean); // Loại bỏ giá trị undefined/null

    if (!this.voucher_code) return;

    this.isCheckingVoucher = true;

    const member = this.ticket.masterInfo.ma_hang.trim() || 'NEWMEMBER';
    const phone = this.ticket.masterInfo.ma_kh.trim() || '';
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    const stock = userObj['shop'] || '';
    this.commonService.voucherCheck(this.voucher_code, member, phone, stock, skus).subscribe({
      next: result => {
        const response = result as any;
        // tạm thời ko sử dụng phía client
        // const validSkus = this.voucherCodeService.validateVoucherResponse(response, skus);
        // if (validSkus) {
        //   thi.addVoucherCode(validSkus, response, this.ticket);
        // }

        if (!response?.IsValid) return this.commonService.showMessage(response?.Message || 'Mã giảm giá không hợp lệ');
        let validSkus: string[] = [];
        if (response?.Config?.SKU?.IsEnable) {
          // Kiểm tra mã vật tư có trong danh sách hợp lệ không nếu IsEnable = true
          validSkus = (response?.Config?.SKU?.Items || []).map((item: string) => item.trim().toLowerCase());
          if (!skus.some(sku => validSkus.includes(sku))) {
            return this.commonService.showMessage('Mã giảm giá không áp dụng cho mã hàng này');
          }
        }
        // thêm mã voucher vào danh sách mã voucher
        this.addVoucherCode(validSkus, response);
      },
      error: (err) => {
        this.commonService.showMessage('Có lỗi xảy ra khi kiểm tra mã giảm giá');
      },
      complete: () => {
        this.isCheckingVoucher = false;
      }
    });
  }

  addVoucherCode(validSkus: string[], inputResponse: any) {
    // tiền ck & tl ck
    const DiscountPrice = inputResponse?.Info?.DiscountPrice || 0;
    const DiscountRate = inputResponse?.Info?.DiscountRate || 0;
    const SKU = inputResponse?.Config?.SKU;
    const Info = inputResponse?.Info;
    const CampaignID = inputResponse?.Info?.Campaign[0]?.ID || '';
    let ma_imei = '';
    let ma_vt = '';
    let type = 0; // 0: phân bổ hết các vt trong tab hàng hóa, 1: phân bổ theo mã vt được áp dụng, 2: áp dụng vật tư có giá trị cao nhất

    let validMerchandise = [];

    if (validSkus.length > 0) {
      validMerchandise = this.ticket.merchandise_new_sale.filter(item =>
        validSkus.includes(item.ma_vt?.trim().toLowerCase())
      );
    } else {
      validMerchandise = [...this.ticket.merchandise_new_sale]; // Dùng toàn bộ nếu validSkus rỗng
    }

    if (validMerchandise.length === 0) {
      return this.commonService.showMessage('Không có vật tư nào hợp lệ để áp dụng voucher');
    }

    // set vào sessionStorage để sử dụng tình phân bổ cho vật tư
    sessionStorage.setItem('merchandise_apply_voucher', JSON.stringify(validMerchandise));

    // Tìm ra vật tư có giá trị cao nhất trong danh sách được áp dụng
    const maxMerchandise = validMerchandise.reduce((prev, current) =>
      prev.gia_ban > current.gia_ban ? prev : current
    );

    if (SKU.IsEnable && Info.IsAllocation) { // true => áp dụng phân bổ cho các vt thỏa mãn
      // ck phân bổ theo mã vt được áp dụng voucher
      type = 1;

      // nếu ko phải phân bổ: IsEnable = true
      // và ma_vt trong hàng hóa đều giống nhau thì thực hiện ma_imei = '', ma_vt='' để phân bổ tiền ck
      // if (this.ticket.merchandise && this.ticket.merchandise.length > 0) {
      //   const uniqueMaVTs = new Set(this.ticket.merchandise.map(x => x.ma_vt.trim().toLowerCase()));

      //   if (uniqueMaVTs.size === 1) {
      //     ma_imei = '';
      //     ma_vt = '';
      //   }
      // }
    }

    if (!Info.IsAllocation) { // false => ko phân bổ, áp dụng vật tư có giá trị cao nhất
      // set ma_vt mà ma_imei nếu áp dụng cho vật tư có giá cao nhất
      ma_imei = maxMerchandise.ma_imei || '';
      ma_vt = maxMerchandise.ma_vt || '';

      // áp dụng vật tư có giá trị cao nhất
      type = 2;
    }

    // kiểm tra đã add voucher
    if (this.ticket.voucherCode.some(item => item.ma_voucher.trim().toLowerCase() === this.voucher_code.trim().toLowerCase())) {
      // xóa đi nếu ko add được voucher
      sessionStorage.removeItem('merchandise_apply_voucher');
      return this.commonService.showMessage('Mã giảm giá đã được áp dụng');
    }

    // xử lý lấy imei để check campaign
    const duplicated = this.ticket.voucherCode.find(item =>
      item.ma_td1?.trim().toLowerCase() === CampaignID.toString().trim().toLowerCase()
    );
    if (duplicated) {
      // xóa đi nếu ko add được voucher
      sessionStorage.removeItem('merchandise_apply_voucher');
      return this.commonService.showMessage(`Mã giảm giá "${duplicated.ma_voucher}" đã được áp dụng cho chương trình hiện tại với IMEI "${duplicated.ma_imei}".`);
    }

    // cal api lấy ra chiết khấu loại 10
    const ngay_ct = new Date(`${this.ticket.masterInfo.ngay_ct}Z`);
    this.saleRenewService.getDiscountVoucherCode(ngay_ct).subscribe(result => {
      const response = result as any;

      if (response.success && response.result != null) {
        const discountRes = response.result[0] as any;

        const discount = {
          ma_ck: discountRes.ma_ck || 'VOUCHERWEB',
          ma_imei: ma_imei,
          ma_vt: ma_vt,
          loai_ck: discountRes.loai_ck || DISCOUNT_TYPE.DISCOUNT_VOUCHER_CODE,
          ten_ck: discountRes.ten_ck || 'Chết khấu voucher website 2025',
          ten_loai: discountRes.ten_loai || 'Chiết khấu theo mã voucher website',
          imei_hang_mua: this.voucher_code,
          ngay_bd: discountRes.ngay_bd,
          ngay_kt: discountRes.ngay_kt,
          tien_qd: 0,
          tien_ck_max: DiscountPrice,
          tl_ck: DiscountRate,
          campaign_id: CampaignID,
          type: type
        } as Discount;
        this.discountService.addNew([discount], this.ticket.discount);

        this.commonService.showMessage('Thêm mã giảm giá thành công');
        this.handleAfterDiscountAdded(); // call api ck để lấy data tính toán ck sau đó calcMoney lại
        this.voucher_code = ''; // reset input mã giảm giá

      }
    });
  }

  handleAfterDiscountAdded() {
    const discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount.filter(x => x.ma_ck !== ''));
    const rs = this.saleRenewService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
          this.saleRenewService.updateDiscount(discountAfterRemove, false, null, false);

          // mảng voucherCode có dữ liệu thì thực hiện chuyển trạng thái hoàn thành
          if (this.ticket.voucherCode.length > 0) {
            this.ticket.masterInfo.status = "2";
          }
        }
        else {
          this.commonService.showMessageByName(result.message);
        }

        // mảng voucherCode có dữ liệu thì thực hiện chuyển trạng thái hoàn thành
        if (this.ticket.voucherCode.length > 0) {
          this.ticket.masterInfo.status = "2";
        }
      });
    }
  }

  onChangeCheckbox(data: any) {
    if (data.checked == true) {
      this.ticket.packages.filter(e => e.ma_dv == data.item.ma_dv).forEach(e => e.naptien_hh_yn = data.checked)
      this.saleRenewService.calcMoney();
    }
    else {
      this.ticket.packages.filter(e => e.ma_dv == data.item.ma_dv).forEach(e => e.naptien_hh_yn = data.checked)
      this.saleRenewService.calcMoney();
    }
  }
  //#endregion

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

  onPublishEInvoice() {
    //check trạng thái phiếu
    if (this.invoice_model_status !== '2') {
      this.commonService.showMessageByName('Phiếu chưa hoàn thành, không thể phát hành HĐĐT.');
      return;
    }

    //check quyền sys admin
    if (!this.allowAdminEdit()) {
      console.log('Không phải tk sysadmin');
      return;
    }

    let title = `Thực hiện phát hành HĐĐT cho phiếu số: ${this.ticket.masterInfo.so_ct}?`;
    this.commonService.openDialog(DialogConfirmComponent, { title: title })
      .afterClosed().subscribe(result => {
        if (result) {
          this.isPublistEInvoice = true;
          this.internalSaleDeatailService.publishInvoiceBySysAdmin(this.ticket).subscribe({
            next: (result: any) => {
              if (result.success) {
                this.commonService.showMessageByName(result.message || 'create_publish_invoice_success');
              } else {
                this.commonService.showMessageByName(result.message || 'Unknown_err');
              }
            },
            error: (err) => {
              this.commonService.showMessageByName('Unknown_err');
              console.error('Draft invoice error:', err);
              this.isPublistEInvoice = false;
            },
            complete: () => {
              this.isPublistEInvoice = false;
            }
          });
        }
      });
  }

  //#endregion

  //#region Readonly
  isInputDisabled() {
    const voucherList = this.ticket?.voucherCode ?? [];
    const discountList = this.ticket?.discount ?? [];

    const hasSelectedPayment = Object.values(this.ticket?.payment ?? {}).some(p => p?.selected === true);

    const hasReadonlyType10 = voucherList.some(voucher =>
      discountList.some(discount =>
        discount.imei_hang_mua === voucher.ma_voucher &&
        discount.loai_ck === '10'
      ) && voucher.ma_voucher?.length > 0
    );

    return hasSelectedPayment || hasReadonlyType10;
  }

  isInputDisabledStatus(): boolean {
    const hasReadonlyOrDisabled = this.readonly || this.disableSelectSatus;
    return hasReadonlyOrDisabled;
  }

  isDiscountReadonly(): boolean {
    return this.readonly || this.invoice_model_status === '3';
  }

  isInputReadonly() {
    const voucherList = this.ticket?.voucherCode ?? [];
    const discountList = this.ticket?.discount ?? [];

    const isReadonlyFlag = this.readonly;
    const hasSelectedPayment = Object.values(this.ticket?.payment ?? {}).some(p => p?.selected === true);

    const hasReadonlyType10 = voucherList.some(voucher =>
      discountList.some(discount =>
        discount.imei_hang_mua === voucher.ma_voucher &&
        discount.loai_ck === '10'
      ) && voucher.ma_voucher?.length > 0
    );

    return isReadonlyFlag || hasSelectedPayment || hasReadonlyType10;
  }

  isAnyPaymentSelected(): boolean {
    return Object.values(this.ticket.payment).some(p => p?.selected === true);
  }

  allowAdminEdit(): boolean {
    const user_authorization = JSON.parse(localStorage.getItem('authorization')!);

    return user_authorization && user_authorization.sa_yn;
  }
  //#endregion

  onPaymentChange($event: any) {
    this.ticket.masterInfo.t_con_no = $event.t_con_no;
    this.ticket.masterInfo.t_da_tra = $event.t_da_tra;
    this.ticket.masterInfo.t_gg = $event.t_gg;
    this.ticket.masterInfo.nguoi_duyet_ck = $event.nguoi_duyet_ck

    this.ticket.masterInfo.status = $event.status;

    // cập nhật lại trạng thái
    this.getStatusList();
  }

  async onCheckBeforePayment(): Promise<boolean> {
    if (this.mode === MODE.CREATE) return true;

    let is_valid = true;
    if (this.oldTicketData && this.ticket) {
      // Kiểm tra thay đổi dữ liệu tab hàng hóa
      let old_merchandise_md5 = '';
      if (this.oldTicketData.merchandise_new_sale && this.oldTicketData.merchandise_new_sale.length > 0)
        old_merchandise_md5 = this.cryptoService.hashMD5(JSON.stringify(this.oldTicketData.merchandise_new_sale));
      let new_merchandise_md5 = '';
      if (this.ticket.merchandise_new_sale && this.ticket.merchandise_new_sale.length > 0) {
        const new_merchadise_object = this.funcExtService.deepCopy(this.ticket.merchandise_new_sale);
        //Bỏ qua trường tl_ck_sau_vat09
        new_merchadise_object.forEach((x: any) => x.tl_ck_sau_vat09 = 0);
        new_merchandise_md5 = this.cryptoService.hashMD5(JSON.stringify(new_merchadise_object));
      }
      if (old_merchandise_md5 !== '' && old_merchandise_md5 !== new_merchandise_md5) {
        this.commonService.showMessage('Đã có thay đổi trong tab HÀNG HÓA, hãy lưu phiếu trước khi thực hiện thanh toán');
        return false;
      }

      // Kiểm tra thay đổi dữ liệu tab dịch vụ
      let old_service_md5 = '';
      if (this.oldTicketData.service && this.oldTicketData.service.length > 0)
        old_service_md5 = this.cryptoService.hashMD5(JSON.stringify(this.oldTicketData.service));
      let new_service_md5 = '';
      if (this.ticket.service && this.ticket.service.length > 0)
        new_service_md5 = this.cryptoService.hashMD5(JSON.stringify(this.ticket.service));
      if (old_service_md5 !== '' && old_service_md5 !== new_service_md5) {
        this.commonService.showMessage('Đã có thay đổi trong tab DỊCH VỤ, hãy lưu phiếu trước khi thực hiện thanh toán');
        return false;
      }

      // Kiểm tra thay đổi dữ liệu tab gói cước
      let old_packages_md5 = '';
      if (this.oldTicketData.packages && this.oldTicketData.packages.length > 0)
        old_packages_md5 = this.cryptoService.hashMD5(JSON.stringify(this.oldTicketData.packages));
      let new_packages_md5 = '';
      if (this.ticket.packages && this.ticket.packages.length > 0)
        new_packages_md5 = this.cryptoService.hashMD5(JSON.stringify(this.ticket.packages));
      if (old_packages_md5 !== '' && old_packages_md5 !== new_packages_md5) {
        this.commonService.showMessage('Đã có thay đổi trong tab GÓI CƯỚC, hãy lưu phiếu trước khi thực hiện thanh toán');
        return false;
      }
    }
    return is_valid;
  }

}
