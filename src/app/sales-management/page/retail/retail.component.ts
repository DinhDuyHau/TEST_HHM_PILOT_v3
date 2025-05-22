import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RetailService } from './retail.service';
import { Merchandise, RetailSaleTicket, TAB_NAME } from '@app/sales-management/model/ticket/retail/model';
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
import { FileService } from '@app/_services';
import { EInvoiceInfo, EInvoiceInfoOutput } from '@app/sales-management/model/dto/einvoice.dto';
import { environment } from '@environments/environment';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { PromotionSelectComponent } from '@app/sales-management/component/promotion/promotion-select.component';
import { Package } from '@app/sales-management/model/ticket/common-model/package.model';
import { Transport } from '../../model/common/delivery.mode';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';
import { DomSanitizer } from '@angular/platform-browser';
import { VoucherCodeService } from '../common/voucher-code.service';
import { VoucherCode } from '@app/sales-management/model/ticket/common-model/base-entity.model';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';

const {
  DISCOUNT_LIST,
  GUARANTEE_LIST,
  MERCHANDISE_LIST,
  SERVICE_LIST,
  PACKAGE_LIST,
  OVERVIEW_LIST,
  VOUCHER_CODE_LIST
} = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-retail',
  templateUrl: './retail.component.html',
  styleUrls: ['./retail.component.scss'],
})
export class RetailComponent implements OnInit, AfterViewInit {
  ticket: RetailSaleTicket = new RetailSaleTicket;
  statusList: StatusTicket[] = [];
  transport: Transport = new Transport;
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
  voucherCodeColumns = VOUCHER_CODE_LIST;
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
    ma_hh: 'ma_hh',
    imei: 'imei',
  };
  disableSelectStatus = false;
  previewImage = '';
  depositCanApply: any[] = [];
  depositMerchandise: any[] = [];
  depositNameList = '';
  depositTotalPrice = 0;
  imageCutomerFile?: File;
  tabIndexFocusFirst = 'imei';
  eInvoiceInfo: EInvoiceInfo = new EInvoiceInfo();
  conversionPoints = 0;
  list_imei_old: string[] = [];
  option: Option = new Option;
  entity = TICKET_ENTITY.RETAIL;
  action = '';
  shop = '';
  ma_imei = '';
  table_name = '';
  ma_kh_label = 'Mã khách';
  addOrUpdateCustomer = 'create';
  voucherCode = TICKET_CODE.RETAIL;
  voucher_code = ''; // Mã giảm giá
  isCheckingVoucher = false;

  tab_sources: any[] = [
    { label: 'Tổng quan' },
    { label: 'Hàng hoá', name: 'merchandise' },
    { label: 'Dịch vụ', name: 'service' },
    { label: 'Gói cước', name: 'packages' },
    { label: 'Chiết khấu', name: 'discount' },
    { label: 'Mã giảm giá', name: 'voucherCode' },
    { label: 'Vận chuyển', name: null },
    { label: 'HĐĐT', name: null }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private retailService: RetailService,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private deliveryEmployeeApiService: DeliveryEmployeeApiService,
    private imeiApiService: ImeiApiService,
    private ticketApiService: TicketApiService,
    private commonService: CommonService,
    private merchandiseService: MerchandiseService,
    private discountService: DiscountService,
    private guaranteeApiService: GuaranteeApiService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private voucherCodeService: VoucherCodeService
  ) {
    localStorage.setItem('useGridCached', '1');
    this.retailService.setTicket(this.ticket, this.option);
  }

  // get tabList() {
  //   return [
  //     { label: 'Hàng hoá', count: this.ticket?.merchandise?.length ?? 0 },
  //     { label: 'Dịch vụ', count: this.ticket?.service?.length ?? 0 },
  //     { label: 'Gói cước', count: this.ticket?.packages?.length ?? 0 },
  //     { label: 'Chiết khấu', count: this.ticket?.discount?.length ?? 0 },
  //     { label: 'Vận chuyển' },
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
    // // this.onEnterImeiCode('IPV11128B2308016');
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

    // this.onEnterImeiCode('S916BT20240115002');
    // this.onEnterImeiCode('R37W771047ASEB');
    // this.onEnterImeiCode('RFAWA01V2ST');
    // this.onEnterImeiCode('KTYQ490');
    // this.onEnterImeiCode('KTWC555');

  }
  ngAfterViewInit(): void {
    if (!environment.production) {
      // this.testData();
    }
    // this.commonService.focusControl(this.tabIndexFocusFirst);
  }
  dataTransport(result: any) {
    this.ticket.transport.ma_loaivc = result.masterInfo.ma_loaivc;
    this.ticket.transport.cod.ma_nv_giao = result.masterInfo.ma_nvvc;
    this.ticket.transport.cod.ten_nv = result.masterInfo.ten_nvvc;
    this.ticket.transport.cod.so_dh_vc = result.masterInfo.so_dh_vc;
    this.ticket.transport.cod.ma_van_don = result.masterInfo.ma_van_don;
    this.ticket.transport.cod.tien_phi_cod = result.masterInfo.tien_phi_cod;
    this.ticket.transport.cod.ghi_chu_gh = result.masterInfo.ghi_chu_gh;
    this.onEnterDECode(result.masterInfo.ma_nvvc);
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
      this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.RETAIL }]).subscribe(result => {
        this.statusList = result.result.items as StatusTicket[];
      });
    };

    this.route.queryParams.pipe().subscribe((data: any) => {
      if (data.key) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.RETAIL, data.key).subscribe((result) => {
          if (result.result) {
            // set cửa hàng để truyền sang payment tab
            this.shop = (result.result as any).masterInfo.ma_cuahang;

            this.dataTransport(result.result);
            if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.RETAIL.CREATE) {
              this.router.navigate(['/404']);
            }
            const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
            if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
              this.eInvoiceInfo = hddtTable.data[0];
            }
            this.retailService.loadData(result.result as any as VoucherDto, (image: any) => {
              image && this.getImageCustomerFile(image);

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
                    error: () => {}
                  });
                }
              });
            });
            this.list_imei_old = this.ticket.merchandise.map(x => x.ma_imei);
            this.handleGetDeposit();
            this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
            getStatusList();
            this.tabIndexFocusFirst = this.tabIndex.imei;
            this.commonService.getPointRateExchange(this.ticket, this.option);

            this.retailService.getConversionPoint().subscribe(result => {
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

            // if (this.ticket.masterInfo.image) {
            //   this.getImageCustomerFile(this.ticket.masterInfo.image);
            // }
          }
        });
      } else {
        this.retailService.initTicket(this.ticket);
        getStatusList();
        this.tabIndexFocusFirst = this.tabIndex.ma_kh;
        this.commonService.getPointRateExchange(this.ticket, this.option);
      }
    });

    // dùng để truyền sang navigation call api lấy trang prev and next
    this.table_name = TAB_NAME.MERCHANDISE;
  }
  // Lấy file ảnh từ khách hàng
  getImageCustomerFile(image: string) {
    this.fileService.getFileFromUrl(image).subscribe((res: Blob) => {
      if (res != null) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.previewImage = event.target.result;
        };
        reader.readAsDataURL(res);
      }
    });
  }
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
            this.ticket.masterInfo.ma_kh = ma_kh_old;
            return;
          }
          // xóa và reset ck 09 khi xác nhận => reset
          this.resetDiscount09();
        });
    }

    this.commonService.focusControl2(this.tabIndex.nvvc);
    this.retailService.removeDiscountForCustomer();
    this.retailService.setInfoCustomer(customer);
    this.handleGetDeposit();
    this.retailService.setIsNeedCalcDiscount(true);
    this.discountService.resetDiscount(this.ticket.discount);
    this.voucherCodeService.resetVoucherCode(this.ticket);
    this.retailService.calcMoney();

    this.retailService.getConversionPoint().subscribe(result => {
      if (result && result.success && result.result !== null) {
        this.conversionPoints = result.result;
        this.ticket.payment.sd_diem.diem_qd = result.result;
      }
    });
    if (customer.image)
      this.getImageCustomerFile(customer.image);
  }

  handleGetDeposit() {
    this.retailService.getDeposit().subscribe((result: any) => {
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

        this.ticketApiService.getRankCustomer({ ma_kh: customer.ma_kh }).subscribe(result => {
          const { ma_hang, mau_chu, tl_tich_diem } = result.result as any;
          this.ticket.masterInfo.ma_hang = ma_hang || '';
          this.ticket.masterInfo.tl_tich_diem = tl_tich_diem || 0;
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
        this.retailService.resetCustomerInfo(this.ticket);
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
          this.ticket.masterInfo.ma_hang = ma_hang || '';
          this.ticket.masterInfo.tl_tich_diem = tl_tich_diem || 0;
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
        customer && this.retailService.setInfoCustomer(customer);
      });
  }
  //#endregion

  // #region delivery empl
  handleAddDeliveryEmpl(empl: any) {
    this.ticket.masterInfo.ma_nvvc = empl.ma_kh;
    this.ticket.masterInfo.ten_nvvc = empl.ten_kh;
    this.commonService.focusControl2(this.tabIndex.imei);
    this.ticket.transport.cod.ten_nv = empl.ten_kh;
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
        this.retailService.addGuaranteeMerchandise(merchandiseResponse, guarantee);
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
          const discountInDetail = this.ticket.discount.find(x => x.ma_ck.trim() === discount.ma_ck.trim() && x.ma_imei.trim() === discount.ma_imei.trim());
          if (!discountInDetail) {
            this.discountService.addNew([discount], this.ticket.discount);
          }
          else {
            discountInDetail.tien_qd += discount.tien_qd;
          }
          this.retailService.addPromotionMerchandise(discount, merchandiseResponse.ma_imei);
        }
      }
      this.commonService.clearText2([this.tabIndex.imei, this.tabIndex.ma_hh]);
      this.commonService.focusControl2(this.tabIndex.imei);
      this.retailService.setIsNeedCalcDiscount(true);
      this.discountService.resetDiscount(this.ticket.discount);
      this.voucherCodeService.resetVoucherCode(this.ticket);
      this.retailService.calcMoney();
      // khi add imei xử lý ck 09
      this.applyDiscount09ForMerchandise(merchandiseResponse);
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
      //sửa gán thẳng danh sách các đặt cọc có thể áp dụng mà không cần quan tâm đến mã hàng
      //this.depositMerchandise = this.depositCanApply.filter(item => this.ticket.merchandise.some(({ ma_vt }) => item.ma_vt.trim() === '' || item.ma_vt.trim() === ma_vt.trim()));
      this.depositMerchandise = this.depositCanApply;

      this.depositNameList = this.depositMerchandise.map(item => item.ma_vt).join(', ');
      this.depositTotalPrice = this.depositMerchandise.reduce((pre, cur) => pre + cur.cl_nt, 0);
    }
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
    this.retailService.getImeiInStore(ma_imei, ngay_ct).subscribe(result => {
      if (result.success && result.result.length) {
        if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
          return;
        }
        const merchandise = result.result[0];
        this.handleAddImei(merchandise);

        // Khi bắn imei thì bỏ tích nợ khuyến mãi
        this.ticket.merchandise.forEach(item => {
          if (item.ma_vt.trim() === merchandise.ma_vt.trim())
            item.no_km_yn = false
        })
        // this.handleAddGuarantee(merchandise);

        // this.commonService.addImeiToStorage(ma_imei);
        // this.imeiApiService.updateImeiState([ma_imei], true).subscribe(result => {
        //   if (result.success && result.result[0].dat_hang_yn) {
        //     this.handleAddImei(merchandise);
        //     this.handleAddGuarantee(merchandise);
        //     this.commonService.addImeiToStorage(ma_imei);
        //   }
        // });

        document.getElementById('imei')?.focus();

      } else {
        /*
        * Ko đúng imei sẽ mở dialog tìm kiếm
        */
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
    if (!this.ticket.masterInfo.ma_kh || this.ticket.masterInfo.ma_kh === '') {
      this.commonService.showMessage('Cần nhập mã khách trước khi chọn hàng hóa');
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
      this.retailService.removePromotionMechandise(merchandise);
      // tính lại tiền khi xóa hàng khuyến mại
      this.retailService.calcMoney();
    } else {
      this.retailService.removeMerchandise(merchandise);
      this.handleCheckDeposit(merchandise.ma_vt, false);
      this.retailService.setIsNeedCalcDiscount(true);
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
    // let merchandise = this.ticket.merchandise.find(e => e.ma_imei === event.item.ma_imei);
    let index = this.ticket.merchandise.findIndex(e => e === event.item);
    if (index === -1) return; // Không tìm thấy item trong danh sách
    let merchandise = this.ticket.merchandise[index]; // Lấy đúng dòng được chọn
    if (merchandise?.ma_imei !== '') {
      this.commonService.showMessage('Đã nhập imei vật tư. Không thể thay đổi hàng khuyến mại')
      return
    }
    const current_imei = event!.item.imei_mua;
    const current_discount = this.ticket.discount.filter(x => x.ma_imei === current_imei && x.loai_ck === DISCOUNT_TYPE.GIFT) as any;
    if (current_discount && current_discount.length > 0) {
      const ma_ck = current_discount[0].ma_ck.trim();
      const rec = current_discount[0].rec;
      this.commonService.openDialog(PromotionSelectComponent, { ma_vt: event.item.ma_vt, ma_imei: current_imei, ma_ck: ma_ck, rec: rec })
        .afterClosed().subscribe((selected: Merchandise) => {
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
    this.retailService.onChangePromotionalDebt(event, this.ticket);
  }
  // #endregion merchandise

  // #region discount
  openCalcDiscountDialog(isGridItem: boolean = false, event: { item: Merchandise } | null = null, loai_ck: string = '') {
    const openDialog = (dataSource: Discount[], currentItem: Discount[], isGridItem: boolean, currentRow: { item: Merchandise } | null) => {
      this.commonService.openDialog(DiscountSelectComponent, { dataSource: dataSource, currentItem: currentItem })
        .afterClosed().subscribe(discountSelected => {
          if (discountSelected) {
            // const { discountAdded, disocuntRemoved } = this.discountService.getDiscountsCodeRemovedAndSelected(discountSelected, this.ticket.discount);
            // this.retailService.addDiscount(discountAdded);
            // this.retailService.removeDiscount(disocuntRemoved);
            this.retailService.updateDiscount(discountSelected, isGridItem, currentRow ? currentRow!.item : null);
          }
        });
    };

    let discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount);
    if (loai_ck === '04' && event && event!.item.ma_imei !== '') {
      //đối với loại ck 04 (ngoại giao) xử lý lọc selected item theo imei đã chọn áp ck
      discountCurrent = discountCurrent.filter(x => x.ma_imei && x.ma_imei.trim() === event!.item.ma_imei.trim());
    }

    const rs = this.retailService.calcDiscount(loai_ck);
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          // Mảng này dùng để đánh dấu đối với loại chiết khấu 06
          // Lúc chưa chọn thì sẽ chọn chiết khấu nào thì áp dụng với các mã vật tư vào chiết khấu ưu tiên cao nhất để tính ra tiền chiết khấu có lợi nhất cho khách
          // Khi chọn hoặc bỏ chiết khấu thì phải thực hiện tính toán lại tiền chiết khấu tương ứng và tính xem các chiết khấu khác sẽ có áp dụng được không ngay trên lúc thay đổi
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          // const discountsInvalid = this.discountService.getDiscountsInValid(this.discountCanApply, this.ticket.discount);
          // this.retailService.removeDiscount(discountsInvalid);
          openDialog(this.discountCanApply, discountCurrent, isGridItem, event);
        }
      });
    } else {
      openDialog(this.discountCanApply, discountCurrent, isGridItem, event);
    }
  }

  onRemoveDiscount(event: { item: Discount }) {
    if (this.ticket.voucherCode.length > 0 && event.item.loai_ck != DISCOUNT_TYPE.DISCOUNT_VOUCHER_CODE) {
      this.commonService.showMessage('Chỉ được phép xóa chiết khấu mã giảm giá voucher website');
      return;
    }

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
    const rs = this.retailService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          const discountsInvalid = this.discountService.getDiscountsInValid(this.discountCanApply, this.ticket.discount);
          // this.retailService.removeDiscount(discountsInvalid);
          const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
          this.retailService.updateDiscount(discountAfterRemove, false, null, isVoucherDiscount);
        }
        else {
          this.commonService.showMessageByName(result.message);
        }
      });
    }
    else {
      this.commonService.showMessageByName('Runtime_err');
    }

    // this.retailService.updateDiscount(this.ticket.discount.filter(x => x.ma_ck !== event.item.ma_ck));
    // this.retailService.removeDiscount([event.item]);
    // this.retailService.calcMoney();
  }
  // #endregion discount

  // #region service
  onAddService(event: { item: Merchandise }) {
    this.retailService.addServiceForMerchandise(event.item, this.ticket);
  }

  // click button add service
  onRemoveService(event: { item: Service }) {
    if (event.item.km_yn) {
      this.retailService.removePromotionService(event.item);
    } else {
      this.retailService.removeService(event.item, this.ticket);
    }
  }
  // #endregion service


  // #region package
  onAddPackage(event: { item: Merchandise }) {
    this.retailService.addPackageForMerchandise(event.item, this.ticket)
  }

  onRemovePackage(event: { item: Package }) {
    this.retailService.removePackage(event.item, this.ticket)
  }
  // #endregion package

  // #region upload image
  openUploadImage() {
    if (!this.ticket.masterInfo.ma_kh) {
      this.commonService.showMessageByName('lblWarningNotValidCustomer');
      return;
    }
    this.commonService.openDialog(CameraComponent, {}, 'camera-style').afterClosed().subscribe(async result => {
      if (result && result.previewImage) {
        this.previewImage = result.previewImage;
        this.imageCutomerFile = await this.commonService.getFileFromBase64(result.previewImage, 'image');
        const formData = new FormData();
        formData.append('ma_kh', this.ticket.masterInfo.ma_kh);
        if (!this.imageCutomerFile) return;
        formData.append('image', this.imageCutomerFile);
        this.customerApiService.uploadImage(formData).subscribe((res) => {
          if (res.success && res.result) {
            this.commonService.showMessageByContent(Language.content.upload_sucess);
          } else {
            this.commonService.showMessageByContent(Language.content.Runtime_err);
          }
        });
      }
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

  // #endregion upload image

  // Submit
  onSave() {
    // Check âm tiền nợ
    if (this.ticket.masterInfo.t_con_no < 0) {
      this.commonService.showMessage('Tiền nợ không được âm');
      return;
    }

    // check tổng tiền hàng hóa với các tab: hàng hóa, dịch vụ, gói cước
    if (this.validMoneyMerchandise()) {
      this.commonService.showMessage('Tổng tiền hàng chưa đúng, vui lòng kiểm tra lại !');
      return
    }

    // check tổng tiền thanh toán với tiền còn nợ và tổng tiền đã thanh toán
    if (this.validTotalPayment()) {
      this.commonService.showMessage('Tổng thanh toán không khớp với các hình thức thanh toán và tiền nợ !');
      return
    }
    //Check imei trùng trong grid chi tiết
    const mechandise_dup = [];
    const counter: { [key: string]: number } = {};
    for (const item of this.ticket.merchandise) {
      counter[item.ma_imei] = (counter[item.ma_imei] || 0) + 1;
      if (item.ma_imei && item.ma_imei.trim() !== '' && counter[item.ma_imei] > 1) {
        mechandise_dup.push(item.ma_imei);
      }
    }
    if (mechandise_dup && mechandise_dup.length > 0) {
      const duplicate_imeis = mechandise_dup.join(',');
      this.commonService.showMessage(`Các imei xuất hiện nhiều lần trong chi tiết phiếu: ${duplicate_imeis}`);
      return;
    }

    const message = this.retailService.validateTicket(this.ticket);
    this.invalid = this.commonService.isInValidPayment(this.ticket.payment) || this.retailService.isInvalidForm(this.ticket.masterInfo);

    // kiểm tra vận chuyển
    if (!this.validTransport()) return;

    this.ticket.masterInfo.ma_nvvc = this.ticket.transport.cod.ma_nv_giao;
    this.ticket.masterInfo.ten_nvvc = this.ticket.transport.cod.ten_nv;
    this.ticket.masterInfo.ma_loaivc = this.ticket.transport.ma_loaivc;
    this.ticket.masterInfo.so_dh_vc = this.ticket.transport.cod.so_dh_vc;
    this.ticket.masterInfo.ma_van_don = this.ticket.transport.cod.ma_van_don;
    this.ticket.masterInfo.tien_phi_cod = this.ticket.transport.cod.tien_phi_cod;
    this.ticket.masterInfo.ghi_chu_gh = this.ticket.transport.cod.ghi_chu_gh;

    //check valid các trường số lượng và tiền trong grid hàng hóa và dịch vụ
    if (!this.retailService.isInvalidMerchandise(this.ticket.merchandise)) {
      this.commonService.showMessage(Language.content.grid_merchandise_invalid);
      return;
    }
    if (!this.retailService.isInvalidService(this.ticket.service)) {
      this.commonService.showMessage(Language.content.grid_service_invalid);
      return;
    }
    if (this.ticket.masterInfo.ma_loaivc !== '03' && !this.ticket.masterInfo.ma_nvvc) {
      this.commonService.showMessage(Language.content.invalid_ma_nvvc);
      return;
    }
    if (this.ticket.masterInfo.ma_loaivc === '01' && !this.ticket.masterInfo.so_dh_vc) {
      this.commonService.showMessage(Language.content.invalid_so_dh_vc);
      return;
    }
    if (this.ticket.masterInfo.ma_loaivc === '01' && !this.ticket.masterInfo.ma_van_don) {
      this.commonService.showMessage(Language.content.invalid_ma_van_don);
      return;
    }

    this.invalid && this.commonService.showMessage(Language.content.Missing_information);
    if (message) {
      this.commonService.showMessage(message);
    } else if (!this.invalid && !message) {
      const voucherDto = this.retailService.prepareVoucher();
      this.route.queryParams.subscribe((data: any) => {
        if (this.mode === MODE.UPDATE && !this.isSaving) {
          this.isSaving = true;
          this.isDisabled = true;
          this.ticketApiService.updateVoucher(TICKET_ENTITY.RETAIL, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Update_Completed);
              // if (this.ticket.masterInfo.status == '2') {
              //   this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
              //     if (res.success) {
              //       this.commonService.showMessageByName(res.message);
              //     }
              //     this.router.navigate(['sales/retail']);
              //   });
              // }
              // else {
              //   this.router.navigate(['sales/retail']);
              // }
              this.router.navigate(['sales/retail']);
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
          this.ticketApiService.addNewVoucher(TICKET_ENTITY.RETAIL, voucherDto).subscribe(result => {
            this.isSaving = false;
            this.isDisabled = false;
            if (result.success) {
              // this.commonService.clearImeiStorage();
              this.commonService.showMessage(Language.content.Successful_Create);
              this.router.navigate(['sales/retail']);
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
    this.router.navigate(['sales/retail']);
    // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
    // if (imeis.length > 0) {
    //   this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
    //     if (result.success) {
    //       this.router.navigate(['sales/retail']);
    //     } else {
    //       this.commonService.showMessageByName(result.message);
    //     }
    //   });
    // } else {
    //   this.router.navigate(['sales/retail']);
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
    this.retailService.getImeiInStore(this.ma_imei, ngay_ct).subscribe(result => {
      if (result.success && result.result.length) {
        if (this.merchandiseService.checkImeiExistMerchandise(this.ma_imei, this.ticket.merchandise)) {
          this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: this.ma_imei });
          return;
        }
        const merchandise = result.result[0];
        this.handleAddImei(merchandise);

        // Khi bắn imei thì bỏ tích nợ khuyến mãi
        this.ticket.merchandise.forEach(item => {
          if (item.ma_vt.trim() === merchandise.ma_vt.trim())
            item.no_km_yn = false
        })

        document.getElementById('imei')?.focus();

      } else {
        this.commonService.showMessageByNameAdvance(result.message, { name: '%imei', value: this.ma_imei });
      }
    });
  }

  onChangeCheckbox(data: any) {
    if (data.checked == true) {
      this.ticket.packages.filter(e => e.ma_dv == data.item.ma_dv).forEach(e => e.naptien_hh_yn = data.checked)
      this.retailService.calcMoney();
    }
    else {
      this.ticket.packages.filter(e => e.ma_dv == data.item.ma_dv).forEach(e => e.naptien_hh_yn = data.checked)
      this.retailService.calcMoney();
    }
  }

  /*
  * Kiểm tra tổng tiền trong các tab detail
  * với tổng tiền hàng
  */
  validMoneyMerchandise() {
    // tông tiền hàng hóa
    const merchandiseMoney = this.ticket.merchandise
      .map(e => e.thanh_toan)
      .reduce((pre, cur) => pre + cur, 0) || 0;
    // tông tiền dv
    const serviceMoney = this.ticket.service
      .map(e => e.tong_tien)
      .reduce((pre, cur) => pre + cur, 0) || 0;
    // tông tiền gói cước
    const packageMoney = this.ticket.packages
      .filter(e => e.naptien_hh_yn)
      .map(e => e.tong_tien)
      .reduce((pre, cur) => pre + cur, 0) || 0;

    const total = merchandiseMoney + serviceMoney + packageMoney;

    return total != this.ticket.masterInfo.t_tt_nt;
  }

  /*
  * Kiểm tra tổng tiền thanh toán với tiền còn nợ + tổng tiền các hình thức thanh toán
  */
  validTotalPayment() {
    const totalPayment = this.ticket.masterInfo.fqty1;
    const tienDaTra = this.ticket.masterInfo.t_da_tra;
    const tienConNo = this.ticket.masterInfo.t_con_no;

    return totalPayment != (tienConNo + tienDaTra);
  }

  //#region Chiết khấu 09
  applyDiscount09ForMerchandise(merchandiseResponse: any) {
    const ma_kh = this.ticket.masterInfo.ma_kh ? this.ticket.masterInfo.ma_kh.trim() : '';
    const ma_hang = this.ticket.masterInfo.ma_hang ? this.ticket.masterInfo.ma_hang.trim() : '';
    const ngay_ct = new Date(this.ticket.masterInfo.ngay_ct);
    const ma_imei = merchandiseResponse.ma_imei ? merchandiseResponse.ma_imei.trim() : '';
    const ma_vt = merchandiseResponse.ma_vt ? merchandiseResponse.ma_vt.trim() : '';

    this.imeiApiService.getDiscountRankCustomer(ma_kh, ma_hang, ngay_ct, ma_imei, ma_vt, TICKET_CODE.RETAIL).subscribe((res: any) => {
      if (res.success && res.result) {
        const discount = res.result[0] as any;
        // add vào tab ck
        if (discount) {
          this.discountService.addNew([discount], this.ticket.discount);
        }
        // tính lại tiền khi có ck
        this.retailService.calcMoney();
      } else {
        // tính lại tiền khi ko có ck
        this.retailService.calcMoney();
      }
    });

  }

  removeDiscount09(ma_imei: string) {
    this.ticket.discount = this.ticket.discount.filter(item => item.ma_imei.trim().toUpperCase() !== ma_imei.trim().toUpperCase());

    // tính lại tiền
    this.retailService.calcMoney();
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

    this.ticket.merchandise.map(item => {
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
    this.ticket.masterInfo.ma_hang = '';

    this.ticket.merchandise.map(item => {
      if (item.ma_imei && item.ma_imei.trim().toLowerCase() == ma_imei.trim().toLowerCase()) {
        this.applyDiscount09ForMerchandise(item);

        item.tl_ck09 = 0;
        item.tien_kb09 = 0;
        item.tien_max09 = 0;
        item.tien_ck09 = 0;
        item.tl_ck_sau_vat09 = 0;
      }
    })

    // nếu vẫn còn áp dụng ck 09 thì gán ngược lại mã cũ
    this.ticket.masterInfo.ma_hang = ma_hang_backup;
  }
  //#endregion

  validTransport() {
    if (this.ticket.transport.ma_loaivc === '01' && this.ticket.masterInfo.t_con_no === 0) {
      this.commonService.showMessageByName('warning_transport_cod_no_debt');
      return false;
    }
    if (this.ticket.transport.ma_loaivc === '02' && this.ticket.masterInfo.t_con_no !== 0) {
      this.commonService.showMessageByName('warning_transport_non_cod_with_debt');
      return false;
    }
    return true;
  }

  //#region Mã giảm giá
  handleChangeVoucherCode($event: any) {
    if (this.isCheckingVoucher) return;

    this.voucher_code = $event;

    // valid voucher code
    const message = this.voucherCodeService.validVoucherCode(this.ticket);
    if (message) return this.commonService.showMessage(message);

    // Lấy danh sách mã vật tư trong phiếu bán
    const skus = this.ticket.merchandise
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
        //   this.addVoucherCode(validSkus, response, this.ticket);
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
      validMerchandise = this.ticket.merchandise.filter(item =>
        validSkus.includes(item.ma_vt?.trim().toLowerCase())
      );
    } else {
      validMerchandise = [...this.ticket.merchandise]; // Dùng toàn bộ nếu validSkus rỗng
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
    this.retailService.getDiscountVoucherCode(ngay_ct).subscribe(result => {
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
    const rs = this.retailService.calcDiscount();
    if (rs) {
      rs.subscribe(result => {
        if (result.success) {
          this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
          const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
          this.retailService.updateDiscount(discountAfterRemove, false, null, false);

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
  //#endregion
}


