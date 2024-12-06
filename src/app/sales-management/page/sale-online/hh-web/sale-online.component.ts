import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleOnlineService } from './sale-online.service';
import { Merchandise, SaleOnlineTicket } from '@app/sales-management/model/ticket/sale-online/model';
import dataFormat from '@app/_common/dataFormat';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '@app/_components/category/customer/customer.model';
import { StatusTicket } from '@app/sales-management/model/common/status.model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../../component/search/serach-dialog.component';
import { CustomerCreateDialogComponent } from '../../../component/customer/customer-create-dialog/customer-create-dialog.component';
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

const { DISCOUNT_LIST,
    GUARANTEE_LIST,
    MERCHANDISE_ONLINE_LIST,
    SERVICE_LIST,
    PACKAGE_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
    selector: 'app-sale-online',
    templateUrl: './sale-online.component.html',
    styleUrls: ['./sale-online.component.scss'],
})
export class SaleOnlineComponent implements OnInit, AfterViewInit {
    ticket: SaleOnlineTicket = new SaleOnlineTicket;
    statusList: StatusTicket[] = [];
    dataFormat = dataFormat;
    title = '';
    discountCanApply: Discount[] = [];
    uploadImageSuccess = false;
    uploading = true;
    merchandiseColumns = MERCHANDISE_ONLINE_LIST;
    serviceColumns = SERVICE_LIST;
    packageColumns = PACKAGE_LIST;
    discountColumns = DISCOUNT_LIST;
    guaranteeColumns = GUARANTEE_LIST;
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
        imei: 'imei',
        ma_vt: 'ma_vt'
    };
    disableSelectStatus = false;
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
    entity = TICKET_ENTITY.ONLINE;
    action = '';
    shop = '';
    ma_imei = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private saleOnlineService: SaleOnlineService,
        public dialog: MatDialog,
        private customerApiService: CustomerApiService,
        private deliveryEmployeeApiService: DeliveryEmployeeApiService,
        private imeiApiService: ImeiApiService,
        private ticketApiService: TicketApiService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
        private discountService: DiscountService,
        private guaranteeApiService: GuaranteeApiService,
    ) {
        localStorage.setItem('useGridCached', '1');
        this.saleOnlineService.setTicket(this.ticket, this.option);
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
            this.ticketApiService.getStatus([{ Name: 'ma_ct', Operator: '=', Value: TICKET_CODE.ONLINE }]).subscribe(result => {
                this.statusList = result.result.items as StatusTicket[];
            });
        };

        this.route.queryParams.subscribe((data: any) => {
            if (data.key) {
                this.ticketApiService.getVoucherByid(TICKET_ENTITY.ONLINE, data.key).subscribe((result) => {
                    if (result.result) {
                        // set cửa hàng để truyền sang payment tab
                        this.shop = (result.result as any).masterInfo.ma_cuahang;

                        if (this.mode === MODE.UPDATE && (result.result as any).masterInfo.status !== STATUS_LIST.SALE_ONLINE.CREATE) {
                            this.router.navigate(['/404']);
                        }

                        const hddtTable = (result.result as any).details.find((item: any) => item.id === 10);
                        if (hddtTable && hddtTable.data && hddtTable.data.length && hddtTable.data[0]) {
                            this.eInvoiceInfo = hddtTable.data[0];
                        }
                        this.saleOnlineService.loadData(result.result as any as VoucherDto);
                        this.handleGetDeposit();
                        this.commonService.addToImeisInVoucher(this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei));
                        getStatusList();
                        this.commonService.getPointRateExchange(this.ticket, this.option);
                        this.saleOnlineService.getConversionPoint().subscribe(result => {
                            if (result && result.success && result.result !== null) {
                                this.conversionPoints = result.result;
                                // this.ticket.payment.sd_diem.diem_qd = result.result;
                            }
                        });

                        this.tabIndexFocusFirst = this.tabIndex.imei;
                    }
                });
            } else {
                this.saleOnlineService.initTicket(this.ticket);
                getStatusList();
                this.commonService.getPointRateExchange(this.ticket, this.option);
                this.tabIndexFocusFirst = this.tabIndex.ma_kh;
            }
        });
    }

    // #region customer
    handleAddCustomer(customer: Customer) {
        this.commonService.focusControl2(this.tabIndex.nvvc);
        this.saleOnlineService.removeDiscountForCustomer();
        this.saleOnlineService.setInfoCustomer(customer);
        this.handleGetDeposit();
        this.saleOnlineService.setIsNeedCalcDiscount(true);
        this.discountService.resetDiscount(this.ticket.discount);
        this.saleOnlineService.calcMoney();
        this.saleOnlineService.getConversionPoint().subscribe(result => {
            if (result && result.success && result.result !== null) {
                this.conversionPoints = result.result;
                this.ticket.payment.sd_diem.diem_qd = result.result;
            }
        });
    }

    handleGetDeposit() {
        this.saleOnlineService.getDeposit().subscribe((result: any) => {
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
            } else {
                this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
                this.saleOnlineService.resetCustomerInfo(this.ticket);
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
                customer && this.saleOnlineService.setInfoCustomer(customer);
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
                this.saleOnlineService.addGuaranteeMerchandise(merchandiseResponse, guarantee);
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
                    this.saleOnlineService.addPromotionMerchandise(discount, merchandiseResponse.ma_imei);
                }
            }
            this.commonService.clearText2([this.tabIndex.imei, this.tabIndex.ma_vt]);
            this.commonService.focusControl2(this.tabIndex.imei);
            this.saleOnlineService.setIsNeedCalcDiscount(true);
            this.discountService.resetDiscount(this.ticket.discount);
            this.saleOnlineService.calcMoney();
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
        if (!this.ticket.masterInfo.ma_kh || this.ticket.masterInfo.ma_kh === '') {
          this.commonService.showMessage('Cần nhập mã khách trước khi nhập imei');
          return;
        }

        if(!ma_imei || ma_imei.length < 5) {
          this.commonService.showMessage('Imei cần ít nhất 5 ký tự để tìm kiếm');
          return;
        }

        this.saleOnlineService.getImeiInStore(ma_imei).subscribe(result => {
          if (result.success && result.result.length) {
              if (this.merchandiseService.checkImeiExistMerchandise(ma_imei, this.ticket.merchandise)) {
                  this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: ma_imei });
                  return;
              }
              const merchandise = result.result[0];
              this.handleAddImei(merchandise);
              // this.handleAddGuarantee(merchandise);
              // this.imeiApiService.updateImeiState([ma_imei], true).subscribe(result => {
              //     if (result.success && result.result[0].dat_hang_yn) {
              //         this.handleAddImei(merchandise);
              //         this.handleAddGuarantee(merchandise);
              //         this.commonService.addImeiToStorage(ma_imei);
              //     }
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
            this.saleOnlineService.removePromotionMechandise(merchandise);
        } else {
            this.saleOnlineService.removeMerchandise(merchandise);
            this.handleCheckDeposit(merchandise.ma_vt, false);
            this.saleOnlineService.setIsNeedCalcDiscount(true);
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
        this.saleOnlineService.onChangePromotionalDebt(event, this.ticket);
    }

    // Đơn hàng
    openCalcOrdertDialog() {
        //
    }
    // #endregion merchandise

    // #region discount
    openCalcDiscountDialog(isGridItem: boolean = false, event: { item: Merchandise } | null = null, loai_ck: string = '') {
        const openDialog = (dataSource: Discount[], currentItem: Discount[], isGridItem: boolean, currentRow: { item: Merchandise } | null) => {
            this.commonService.openDialog(DiscountSelectComponent, { dataSource: dataSource, currentItem: currentItem })
                .afterClosed().subscribe(discountSelected => {
                    if (discountSelected) {
                        this.saleOnlineService.updateDiscount(discountSelected, isGridItem, currentRow ? currentRow!.item : null);
                    }
                });
        };

        let discountCurrent = this.discountService.getDiscountCurrent(this.ticket.discount);
        if (loai_ck === '04' && event && event!.item.ma_imei !== '') {
            //đối với loại ck 04 (ngoại giao) xử lý lọc selected item theo imei đã chọn áp ck
            discountCurrent = discountCurrent.filter(x => x.ma_imei && x.ma_imei.trim() === event!.item.ma_imei.trim());
        }

        const rs = this.saleOnlineService.calcDiscount(loai_ck);
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
        const rs = this.saleOnlineService.calcDiscount();
        if (rs) {
            rs.subscribe(result => {
                if (result.success) {
                    this.discountCanApply = this.discountService.convertDiscountFromList(result.result as any);
                    const discountAfterRemove = this.discountCanApply.filter((item) => discountCurrent.find(x => x.ma_ck == item.ma_ck));
                    this.saleOnlineService.updateDiscount(discountAfterRemove);
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
        this.saleOnlineService.addServiceForMerchandise(event.item, this.ticket);
    }

    onUpdateService(event: { item: Merchandise }) {
        this.saleOnlineService.updateServiceForMerchandise(event.item);
    }

    // click button add service
    onRemoveService(event: { item: Service }) {
        if (event.item.km_yn) {
            this.saleOnlineService.removePromotionService(event.item);
        } else {
            this.saleOnlineService.removeService(event.item, this.ticket);
        }
    }
    // #endregion service

    // #region package
    onAddPackage(event: { item: Merchandise }) {
        this.saleOnlineService.addPackageForMerchandise(event.item, this.ticket)
    }

    onRemovePackage(event: { item: Package }) {
        this.saleOnlineService.removePackage(event.item, this.ticket)
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

        const message = this.saleOnlineService.validateTicket(this.ticket);
        this.invalid = this.commonService.isInValidPayment(this.ticket.payment) || this.saleOnlineService.isInvalidForm(this.ticket.masterInfo);
        this.invalid && this.commonService.showMessage(Language.content.Missing_information);
        if (message) {
            this.commonService.showMessage(message);
        } else if (!this.invalid && !message) {
            const voucherDto = this.saleOnlineService.prepareVoucher();
            this.route.queryParams.subscribe((data: any) => {
                if (this.mode === MODE.UPDATE && !this.isSaving) {
                    this.isSaving = true;
                    this.isDisabled = true;
                    this.ticketApiService.updateVoucher(TICKET_ENTITY.ONLINE, voucherDto).subscribe(result => {
                        this.isSaving = false;
                        this.isDisabled = false;
                        if (result.success) {
                            this.commonService.showMessage(Language.content.Update_Completed);
                            if (this.ticket.masterInfo.status == '2') {
                                this.commonService.sendEmailService(this.ticket.masterInfo.stt_rec).subscribe((res) => {
                                    if (res.success) {
                                        this.commonService.showMessageByName(res.message);
                                    }
                                    this.router.navigate(['sales/web-order']);
                                });
                            }
                            else {
                                this.router.navigate(['sales/web-order']);
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
                    this.ticketApiService.addNewVoucher(TICKET_ENTITY.ONLINE, voucherDto).subscribe(result => {
                        this.isSaving = false;
                        this.isDisabled = false;
                        if (result.success) {
                            this.commonService.showMessage(Language.content.Successful_Create);
                            this.router.navigate(['sales/web-order']);
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
        this.router.navigate(['sales/web-order']);
        // const imeis = this.ticket.merchandise.filter(e => e.ma_imei).map(e => e.ma_imei);
        // if (imeis.length > 0) {
        //     this.imeiApiService.updateImeiState(imeis, false).subscribe(result => {
        //         if (result.success) {
        //             this.router.navigate(['sales/web-order']);
        //         } else {
        //             this.commonService.showMessage('Lỗi update state của hàng hóa');
        //         }
        //     });
        // } else {
        //     this.router.navigate(['sales/web-order']);
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

      this.saleOnlineService.getImeiInStore(this.ma_imei).subscribe(result => {
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
}


