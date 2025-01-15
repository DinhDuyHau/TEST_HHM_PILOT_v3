import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { Service, ServiceRequest } from '@app/sales-management/model/ticket/common-model/service.model';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, Merchandise, RetailSaleTicket, TAB_NAME } from '@app/sales-management/model/ticket/retail/model';
import { Observable, Subject, of } from 'rxjs';
import { CommonService } from '../common/common.service';
import { DiscountService } from '../common/discount.service';
import { ServiceForImeiComponent } from '@app/sales-management/component/merchandise-service/service-for-imei/service-for-imei.component';
import { MerchandiseService } from '../common/merchandise.service';
import { ResultNoPaging } from '@app/_models/Result';
import { ServiceOfMerchandiseService } from '../common/service.service';
import { PaymentService } from '../common/payment.service';
import { GuanranteeService } from '../common/guarantee.service';
import { MerchandiseRequest, MasterInfoRequest } from '@app/sales-management/model/ticket/retail/request.model';
import { Language } from '../common/language';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { Option } from '@app/sales-management/model/ticket/common-model/option.model';
import { ServiceApiService } from '@app/sales-management/api/service-api.service';
import { PackageForImeiComponent } from '@app/sales-management/component/merchandise-service/package-for-imei/package-for-imei.component';
import { PackageOfMerchandiseService } from '../common/package.service';
import { Package, PackageRequest } from '@app/sales-management/model/ticket/common-model/package.model';
import { PromotionSelectComponent } from '@app/sales-management/component/promotion/promotion-select.component';
import { TransportService } from '../common/transport.service';

@Injectable({
    providedIn: 'root'
})
export class RetailService {
    discountOptions: Discount[] = [];
    isNeedCalcDiscount = true;
    ticket!: RetailSaleTicket;
    option!: Option;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private imeiApiService: ImeiApiService,
        private merchandiseApiService: MerchandiseApiService,
        private serviceApiService: ServiceApiService,
        private discountApiService: DiscountApiService,
        private discountService: DiscountService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
        private serviceOfMerchandiseService: ServiceOfMerchandiseService,
        private paymentService: PaymentService,
        private guanranteeService: GuanranteeService,
        private packageOfMerchandiseService: PackageOfMerchandiseService,
        private transportService: TransportService,
    ) {

    }

    //#region setter
    setTicket(ticket: RetailSaleTicket, option: Option) {
        this.ticket = ticket;
        this.option = option;
    }

    setIsNeedCalcDiscount(value: boolean) {
        this.isNeedCalcDiscount = value;
    }
    //#endregion setter

    // #region init
    loadData(data: VoucherDto, callback: any) {
        this.ticket.masterInfo = this.commonService.convertMasterInfoFromVoucher(data.masterInfo, MasterInfo);

        this.customerApiService.getOneById(data.masterInfo.ma_kh).subscribe(result => {
            const customer = result.result as any;
            this.ticket.masterInfo.ten_kh = customer.ten_kh;
            this.ticket.masterInfo.dia_chi = customer.dia_chi;
            this.ticket.masterInfo.image = customer.image;
            callback(customer.image);
        });

        this.customerApiService.getOneById(data.masterInfo.ma_nvvc).subscribe((result: any) => {
            if (result.result) {
                this.ticket.masterInfo.ten_nvvc = result.result.ten_kh;
            }
        });

        data.details.forEach(e => {
            switch (e.name) {
                case TAB_NAME.MERCHANDISE:
                    this.merchandiseService.convertFromVoucher(e.data, this.ticket.merchandise, Merchandise);
                    break;
                case TAB_NAME.SERVICE:
                    this.serviceOfMerchandiseService.convertFromVoucher(e.data, this.ticket.service);
                    break;
                case TAB_NAME.PACKAGE:
                    this.packageOfMerchandiseService.convertFromVoucher(e.data, this.ticket.packages);
                    break;
                case TAB_NAME.DISCOUNT:
                    this.discountService.convertDiscountFromVoucher(e.data, this.ticket.discount);
                    break;
                case TAB_NAME.TRANSPORT:
                    this.ticket.transport = this.transportService.convertFromVoucher(e.data[0]);
                    this.customerApiService.getOneById(this.ticket.transport.hhDelivery.ma_nv_giao).subscribe((result: any) => {
                        if (result && result.success && result.result) {
                            this.ticket.transport.hhDelivery.ten_nv = result.result.ten_kh;
                        }
                    });
                    break;
                case TAB_NAME.PAYMENT:
                    this.paymentService.convertPaymentFromVoucher(e.data, this.ticket.payment);
                    break;
                default:
                    break;
            }
        });

    }

    // create or update
    prepareVoucher(): VoucherDto {
        const voucherDto: VoucherDto = new VoucherDto;
        voucherDto.details = [];
        //console.log(this.ticket.masterInfo);
        voucherDto.masterInfo = this.commonService.convertMasterInfo(this.ticket.masterInfo, MasterInfoRequest);
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.MERCHANDISE, data: this.merchandiseService.convertMerchandiseToRequest(this.ticket.merchandise, voucherDto.masterInfo, MerchandiseRequest) }];
        voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.SERVICE, data: this.serviceOfMerchandiseService.convertServiceToRequest(this.ticket.service, voucherDto.masterInfo, ServiceRequest) }];
        voucherDto.details = [...voucherDto.details, { id: 3, name: TAB_NAME.DISCOUNT, data: this.discountService.convertDiscountToRequest(this.ticket.discount, voucherDto.masterInfo) }];
        voucherDto.details = [...voucherDto.details, { id: 4, name: TAB_NAME.PAYMENT, data: this.paymentService.convertPaymentToRequest(this.ticket.payment, voucherDto.masterInfo) }];
        voucherDto.details = [...voucherDto.details, { id: 6, name: TAB_NAME.TRANSPORT, data: [this.transportService.convertToRequest(this.ticket.transport, voucherDto.masterInfo)] }];
        voucherDto.details = [...voucherDto.details, { id: 5, name: TAB_NAME.PACKAGE, data: this.packageOfMerchandiseService.convertPackageToRequest(this.ticket.packages, voucherDto.masterInfo, PackageRequest) }];
        return voucherDto;
    }

    initTicket(ticket: RetailSaleTicket) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);

        ticket.masterInfo.ma_ct = TICKET_CODE.RETAIL;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.RETAIL).subscribe(result => {
            ticket.masterInfo.so_ct = result.result as any;
        });
        this.ticketApiService.getVoucherDate().subscribe(result => {
          ticket.masterInfo.ngay_ct = result?.result as any || Date();
        });
    }

    //#endregion init

    //#region customer
    setInfoCustomer(customer: Customer) {
        this.ticket.masterInfo.ma_kh = customer.ma_kh;
        this.ticket.masterInfo.ten_kh = customer.ten_kh;
        this.ticket.masterInfo.dia_chi = customer.dia_chi;
        this.ticket.masterInfo.email_nhan_key = customer.email_cn;

        //Thông tin khách hàng trên hóa đơn điện tử
        this.ticket.masterInfo.hd_dia_chi = customer.hoadon_diachi || '';
        this.ticket.masterInfo.hd_email = customer.hoadon_email || '';
        this.ticket.masterInfo.hd_mst = customer.hoadon_mst || '';
        this.ticket.masterInfo.hd_ten_kh = customer.hoadon_tenkh || '';
    }

    resetCustomerInfo(ticket: RetailSaleTicket) {
        ticket.masterInfo.ten_kh = '';
        ticket.masterInfo.dia_chi = '';
    }

    getDeposit() {
        const ngay_ct = formatDate(this.ticket.masterInfo.ngay_ct, 'yyyy/MM/dd', 'en_US');
        const { ma_kh, ma_dvcs } = this.ticket.masterInfo;
        return this.customerApiService.getDeposit(ma_kh, ma_dvcs, ngay_ct);
    }

    getConversionPoint() {
        const ngay_ct = formatDate(this.ticket.masterInfo.ngay_ct, 'yyyy/MM/dd', 'en_US');
        const { ma_kh } = this.ticket.masterInfo;
        return this.customerApiService.getConversionPoint(ma_kh, ngay_ct);
    }

    // remove discount type for customer
    removeDiscountForCustomer() {
        const { money, discounts } = this.discountService.getMoneyOfDiscountForCustomer(this.ticket.masterInfo.ma_kh, this.ticket.discount);
        this.ticket.masterInfo.t_ck -= money;
        this.discountService.removeDiscount(discounts, this.ticket.discount);
    }

    //#endregion customer

    // #region guarantee
    addGuaranteeMerchandise(merchandise: any, guarantee: any) {
        if (merchandise && merchandise.ma_vt && merchandise.ma_imei) {
            this.guanranteeService.addNewGuaranteeNew(merchandise.ma_vt, merchandise.ma_imei, guarantee, this.ticket.guarantee);
        }
    }
    // #endregion guarantee

    // #region imei
    getImeiInStore(imei: string, ngay_ct: Date | null = null) {
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.RETAIL, ngay_ct);
    }

    getMerchandiseInfo(ma_vt: string) {
        return this.merchandiseApiService.getOneById(ma_vt);
    }


    getServiceInfo(ma_dv: string) {
        return this.serviceApiService.getOneById(ma_dv);
    }

    addPromotionMerchandise(discount: Discount, imei_mua: string) {
        const addMerchandise = (result: any) => {
            (result.result as any as Merchandise).imei_mua = imei_mua;
            (result.result as any as Merchandise).km_yn = true;
            this.merchandiseService.addNew(result.result, this.ticket.merchandise, Merchandise);
            this.calcMoney(1);
        };
        const addService = (result: any) => {
            (result.result as any as Service).ma_imei = imei_mua;
            (result.result as any as Service).km_yn = true;
            this.serviceOfMerchandiseService.addNew(imei_mua, [result.result], this.ticket.service);

            this.calcMoney(1);
        };
        const subject = new Subject<any>();
        subject.subscribe(({ ma_vt_tang, ma_vt_tt, tien_kmqd, ma_dv, sd_vt_tang, no_km_yn }) => {
            if (ma_vt_tang && ma_vt_tang.trim()) {
                if (sd_vt_tang || no_km_yn) {

                    this.getMerchandiseInfo(ma_vt_tang).subscribe(result => {
                        if (result.success && result.result) {
                            (result.result as any).tien_kmqd = tien_kmqd;
                            if (no_km_yn) {
                                (result.result as any).no_km_yn = true;
                            }
                            addMerchandise(result);
                        }
                        else {
                            // this.commonService.showMessage("Không tìm thấy thông tin hàng khuyến mãi");
                            this.commonService.showMessage(Language.content.No_promotional_items_found);
                        }
                    });
                }
                else {
                    this.getMerchandiseInfo(ma_vt_tt).subscribe(result => {
                        if (result.success && result.result) {
                            (result.result as any).tien_kmqd = tien_kmqd;
                            addMerchandise(result);
                        } else {
                            // this.commonService.showMessage("Không tìm thấy thông tin hàng khuyến mãi");
                            this.commonService.showMessage(Language.content.No_promotional_items_found);
                        }
                    });
                }
            }
            else if (ma_dv) {
                this.getServiceInfo(ma_dv).subscribe(result => {
                    if (result.success && result.result) {
                        (result.result as any).tien_kmqd = tien_kmqd;
                        addService(result);
                    }
                });
            }
        });

        this.discountService.getMerchandiseCodeOfPM(discount).map((ma_vt: { ma_vt_tang: string, ma_vt_tt: string, tien_kmqd: number, ma_dv: string, sd_vt_tang: boolean, no_km_yn: boolean }) => {
            subject.next(ma_vt);
        });
    }

    // addPromotionMerchandise(discount: Discount, imei_mua: string) {
    //     const addMerchandise = (result: any) => {
    //         (result.result as any as Merchandise).imei_mua = imei_mua;
    //         (result.result as any as Merchandise).km_yn = true;
    //         this.merchandiseService.addNew(result.result, this.ticket.merchandise, Merchandise);
    //         this.calcMoney(1);
    //     };
    //     const addService = (result: any) => {
    //         (result.result as any as Service).ma_imei = imei_mua;
    //         (result.result as any as Service).km_yn = true;
    //         this.serviceOfMerchandiseService.addNew(imei_mua, [result.result], this.ticket.service);

    //         this.calcMoney(1);
    //     };
    //     const subject = new Subject<any>();
    //     subject.subscribe(({ ma_vt_tang, ma_vt_tt, tien_kmqd, ma_dv }) => {
    //         if (ma_vt_tang && ma_vt_tang.trim()) {
    //             this.getMerchandiseInfo(ma_vt_tang).subscribe(result => {
    //                 if (result.success && result.result) {
    //                     (result.result as any).tien_kmqd = tien_kmqd;
    //                     addMerchandise(result);
    //                 } else {
    //                     this.getMerchandiseInfo(ma_vt_tt).subscribe(result => {
    //                         if (result.success && result.result) {
    //                             (result.result as any).tien_kmqd = tien_kmqd;
    //                             addMerchandise(result);
    //                         } else {
    //                             // this.commonService.showMessage("Không tìm thấy thông tin hàng khuyến mãi");
    //                             this.commonService.showMessage(Language.content.No_promotional_items_found);
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //         else if (ma_dv) {
    //             this.getServiceInfo(ma_dv).subscribe(result => {
    //                 if (result.success && result.result) {
    //                     (result.result as any).tien_kmqd = tien_kmqd;
    //                     addService(result);
    //                 }
    //             });
    //         }
    //     });

    //     this.discountService.getMerchandiseCodeOfPM(discount).map((ma_vt: { ma_vt_tang: string, ma_vt_tt: string, tien_kmqd: number, ma_dv: string }) => {
    //         subject.next(ma_vt);
    //     });
    // }

    // #endregion imei

    // #region merchandise
    removePromotionMechandise(merchandise: Merchandise) {
        const flag = this.merchandiseService.removePromotionMechandise(merchandise, this.ticket.merchandise, this.ticket.discount, this.option);
        if (flag) {
            this.calcMoney(1);
            // this.commonService.showMessage("Xóa hàng khuyến mãi thành công");
            this.commonService.showMessage(Language.content.Delete_Completed);
        }

        // const handleRemove = () => {
        //     this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        //     const merchandiseMain = this.merchandiseService.getByImeiBuy(merchandise.imei_mua, this.ticket.merchandise);
        //     if (merchandiseMain) {
        //         merchandiseMain.tien_ck_qd += merchandise.tien_kmqd;
        //         merchandiseMain.tien_ck += merchandiseMain.tien_ck_qd;
        //         merchandiseMain.gia_ck = merchandiseMain.gia_ban - merchandiseMain.tien_ck;
        //         merchandiseMain.thanh_tien = (merchandiseMain.gia_ban - merchandiseMain.tien_ck) * merchandiseMain.so_luong;
        //         merchandiseMain.tien_thue = this.commonService.rouding(merchandiseMain.thanh_tien * merchandiseMain.thue_suat / 100, this.option);
        //         merchandiseMain.thanh_toan = merchandiseMain.thanh_tien + merchandiseMain.tien_thue;
        //         const discount = this.ticket.discount.find(x => {
        //             return x.ma_imei && merchandise.imei_mua && x.ma_imei.trim() == merchandise.imei_mua.trim();
        //         });
        //         if (discount) {
        //             discount.tien_ck = discount.tien_qd;
        //             discount.tien_ck_nt = discount.tien_qd;
        //         }
        //         //Không tính lại chiết khấu khi xoá hàng được tặng
        //         this.calcMoney(1);
        //         // this.commonService.showMessage("Xóa hàng khuyến mãi thành công");
        //         this.commonService.showMessage(Language.content.Delete_Completed);
        //     }
        // };
        // handleRemove();
    }

    removeMerchandise(merchandise: Merchandise) {
        this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        const discounts = this.discountService.getDiscountsOfMerchandise(merchandise.ma_imei, this.ticket.discount);
        this.discountService.removeDiscount(discounts, this.ticket.discount);
        this.guanranteeService.removeGuarantee(merchandise.ma_imei, this.ticket);
        this.merchandiseService.removePromotionMerchandiseByOrderImei(merchandise.ma_imei, this.ticket.merchandise);
        this.discountService.resetDiscount(this.ticket.discount, false, merchandise, false, true);
        this.removeServiceAfterRemoveMerchandise(merchandise);
        this.calcMoney();
        // this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        this.commonService.showMessage(Language.content.Delete_Completed);
    }

    changePromotionMerchandise(merchandise: Merchandise) {




        // const changeMerchandise = (ma_vt: string) => {
        //     ma_vt && this.getMerchandiseInfo(ma_vt).subscribe(result => {
        //         if (result.success && result.result) {
        //             const merchandiseAlt = this.merchandiseService.createNewMerchandise(result.result, Merchandise);
        //             this.merchandiseService.swapMerchandise(merchandise, merchandiseAlt, this.ticket.merchandise);
        //             this.guanranteeService.removeGuarantee(merchandise.ma_imei, this.ticket);
        //             // this.commonService.showMessage("Đổi thành công hàng khuyến mãi");
        //             this.commonService.showMessage(Language.content.Successful_Change_Promotion);
        //         } else {
        //             // this.commonService.showMessage("Đổi hàng khuyến mãi thất bại");
        //             this.commonService.showMessage(Language.content.Failed_Change_Promotion);
        //         }
        //     });
        // };
        // const ma_vt = this.discountService.getMerchandiseCodeOfPMAlter(merchandise, this.ticket.discount);
        // if (ma_vt && merchandise.ma_imei) {
        //     changeMerchandise(ma_vt);
        //     // this.imeiApiService.updateImeiState([merchandise.ma_imei], false)
        //     //     .subscribe(result => {
        //     //         changeMerchandise(ma_vt);
        //     //         if (result.success && !result.result[0].dat_hang_yn) {
        //     //             // this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        //     //         }
        //     //     });
        // } else if (ma_vt) {
        //     changeMerchandise(ma_vt);
        // }
    }

    // handle select no_km
    onChangePromotionalDebt(event: { item: Merchandise, index: number, checked: boolean, columnName: string }, ticket: RetailSaleTicket) {
        if (event.columnName === 'no_km_yn') {
            const merchandise = ticket.merchandise[event.index];
            if (merchandise && merchandise.km_yn) {
                merchandise.no_km_yn = event.checked;
            } else {
                delete merchandise.no_km_yn;
            }
        }
    }
    // #endregion merchandise

    // #region discount

    calcDiscount(loai_ck = ''): Observable<ResultNoPaging<Discount>> | undefined {
        const ma_cuahang = this.ticket.masterInfo.ma_cuahang;
        const ma_kh = this.ticket.masterInfo.ma_kh;
        const ngay_lap = formatDate(this.ticket.masterInfo.ngay_ct, 'yyyy/MM/dd', 'en_US');
        const entity = TICKET_ENTITY.RETAIL;
        const merchandise = this.ticket.merchandise.filter(x => !x.km_yn);
        const service = this.ticket.service;
        if (this.isNeedCalcDiscount) {
            return this.discountApiService.getDiscountForTicket(entity, merchandise, ma_cuahang, ma_kh, ngay_lap, service, loai_ck, TICKET_CODE.RETAIL);
        }
        return;
    }

    getAllGiftPromotionsForImei(ma_imei: string, ma_ck: string) {
        return this.discountApiService;
    }

    // Hàm này sẽ xử lý chung cho cả 2 trường hợp là thêm chiết khấu và xoá chiết khấu
    // --> Do không lưu chi tiết giá trị từng chiết khấu được hưởng với loại chiết khấu giảm giá hàng và chiết khấu bán kèm
    //      --> Cho nên khi thực hiện xoá hay thêm mới call lại api tính chiết khấu và lấy lại những loại chiết khấu đã chọn và thực hiện tính lại chiết khấu từ đầu
    updateDiscount(discounts: Discount[], isGridItem = false, row_item: Merchandise | null = null, isGridDiscount = false) {
        this.discountService.resetDiscount(this.ticket.discount, isGridItem, row_item, isGridDiscount);
        discounts.forEach(discount => {
            if (discount.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE ||
                discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
                discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET ||
                discount.loai_ck === DISCOUNT_TYPE.CROSS_SELLING ||
                discount.loai_ck === DISCOUNT_TYPE.ACCESSORY_COMBO ||
                discount.loai_ck === DISCOUNT_TYPE.SERVICE_DISCOUNT ||
                discount.loai_ck === '09'
            ) {
                if (discount.loai_ck == DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER && row_item) {
                    //Nếu chọn chiết khấu ngoại giao thì cần phải chọn dòng trong grid hàng hóa để áp dụng ck
                    //add ma_imei cho ck ngoại giao sẽ áp dụng
                    discount.ma_imei = row_item!.ma_imei;
                }

                this.discountService.addNew([discount], this.ticket.discount);
            }
        });

        //Kiểm tra nếu không tồn tại chiết khấu ngoại giao => loại bỏ người duyệt ck
        const exists_ckng = this.ticket.discount.find(x => x.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER)
        if (!exists_ckng) this.ticket.masterInfo.nguoi_duyet_ck = '';

        this.calcMoney();
    }

    /* Loại bỏ cách tính chiết khấu khi thêm mới hoặc xoá bỏ của team cũ làm --> thay bằng hàm updateDiscount
        addDiscount(discounts: Discount[]) {
            discounts.forEach(discount => {
                if (discount.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE ||
                    discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
                    discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET) {
                    this.discountService.addNew([discount], this.ticket.discount);
                    this.calcMoney();
                }
                if (discount.loai_ck == DISCOUNT_TYPE.CROSS_SELLING) {
                    if (discount.type == 0) {
                        this.discountService.addNew([discount], this.ticket.discount);
                        this.calcMoney();
                    }
                    else {
                        // const temp = { ...discount };
                        // delete temp.details;
                        // const discount05 = discount.details.map((item: any) => {
                        //     return { ...temp, tien_ck: item.tien_ck || item.tien_ck_tl };
                        // });
                        this.ticket.merchandise.forEach((item) => {
                            const ck = discount.details.find((x: any) => x.ma_vt_ad.trim() == item.ma_vt.trim() && x.hangban_yn == false);
                            if (ck) {
                                item.tien_ck = ck.tien_ck || ck.tien_ck_tl;
                            }
                        });
                        //
                        this.discountService.addNew([discount], this.ticket.discount);
                        this.calcMoney();
                    }
                }
            });
        }

        removeDiscount(discounts: Discount[]) {
            discounts.forEach(discount => {
                if (discount.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE ||
                    discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
                    discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET) {
                    this.discountService.removeDiscount([discount], this.ticket.discount);
                    this.calcMoney();
                } else if (discount.loai_ck === DISCOUNT_TYPE.GIFT) {
                    this.commonService.showMessageByName('lblWarningNotDeleteDiscountGift');
                } else if (discount.loai_ck === DISCOUNT_TYPE.CROSS_SELLING) {
                    if (discount.type == 0) {
                        this.discountService.removeDiscount([discount], this.ticket.discount);
                        this.calcMoney();
                    }
                    else {
                        this.ticket.merchandise.forEach((item) => {
                            const ck = discount.details.find((x: any) => x.ma_vt_ad.trim() == item.ma_vt.trim() && x.hangban_yn == false);
                            if (ck) {
                                item.tien_ck = 0;
                            }
                        });
                        this.calcMoney();
                    }
                }
            });
        }
    */

    // #endregion discount

    // #region service
    addServiceForMerchandise(item: Merchandise, ticket: RetailSaleTicket) {
        this.commonService.openDialog(ServiceForImeiComponent, { ma_imei: item.ma_imei, gia_ban: item.gia_ban, ma_vt: item.ma_vt, gia_vat: item.gia_vat }, 'service-imei-style')
            .afterClosed().subscribe(result => {
                if (result) {
                    this.serviceOfMerchandiseService.addNew(item.ma_imei, result, ticket.service);
                    this.discountService.resetDiscount(this.ticket.discount);
                    this.setIsNeedCalcDiscount(true);
                    // Thêm dịch vụ thì phải tính lại chiết khấu
                    this.calcMoney();
                }
            });
    }

    // Remove service
    removeService(item: Service, ticket: RetailSaleTicket) {
        this.serviceOfMerchandiseService.removeService(item, ticket.service);
        this.discountService.resetDiscount(this.ticket.discount);
        this.setIsNeedCalcDiscount(true);
        this.calcMoney();
        this.commonService.showMessageByNameAdvance('lblSuccessDeleteService', { name: '%ma_dv', value: item.ma_dv });
    }

    //Remove service
    removeServiceAfterRemoveMerchandise(merchandise: Merchandise) {
        this.serviceOfMerchandiseService.removeServiceAfterRemoveMerchandise(merchandise, this.ticket.service);
        this.calcMoney();
    }

    removePromotionService(service: Service) {
        const flag = this.serviceOfMerchandiseService.removePromotionService(service, this.ticket.service, this.ticket.merchandise, this.ticket.discount, this.option);
        if (flag) {
            this.calcMoney(1);
            // this.commonService.showMessage("Xóa hàng khuyến mãi thành công");
            this.commonService.showMessage(Language.content.Delete_Completed);
        }
    }
    // #endregion service

    //#region package
    addPackageForMerchandise(item: Merchandise, ticket: RetailSaleTicket) {
        this.commonService.openDialog(PackageForImeiComponent, { ma_imei: item.ma_imei, ma_vt: item.ma_vt, gia_vat: item.gia_vat }, 'service-imei-style')
            .afterClosed().subscribe(result => {
                if (result) {
                    this.packageOfMerchandiseService.addNew(item.ma_imei, result, ticket.packages);
                    this.calcMoney();
                }
            });
    }

    removePackage(item: Package, ticket: RetailSaleTicket) {
        this.packageOfMerchandiseService.removePackage(item, ticket.packages);
        this.calcMoney();
    }
    //#endregion package

    //#region other
    // + Nếu type = 0 thì sẽ tính lại chiết khấu và thực hiện cập nhật lại giá, tiền cho tất cả các vật tư trong chi tiết
    // + Nếu type = 1 thì sẽ không tính lại chiết khấu --> áp dụng khi xoá mặt hàng khuyến mãi --> chỉ cập nhật riêng cho hàng được khuyễn mãi
    calcMoney(type = 0) {
        // Cập nhật tổng số lượng cuối phiếu
        this.ticket.masterInfo.t_so_luong = this.ticket.merchandise.length + this.ticket.service.length;

        if (type == 0) {
            // Thực hiện cập nhật tiền cho chi tiết vật tư, chi tiết dịch vụ (bao gồm giá, chiết khấu, thuế, thành tiền)
            this.merchandiseService.updatePriceForMerchandise(this.ticket, this.ticket.merchandise, this.ticket.service);
        }

        // Tính tổng tiền của chi tiết vật tư
        const merchandiseMoney = this.ticket.merchandise
            .filter(e => !e.km_yn)
            .map(e => e.thanh_tien)
            .reduce((pre, cur) => pre + cur, 0) || 0;
        // Tính tổng tiền của chi tiết dịch vụ
        const serviceMoney = this.ticket?.service?.map(e => e.thanh_tien).reduce((pre, cur) => pre + cur, 0) || 0;

        //lấy tiền gói cước
        let packages_thanh_tien = 0;
        let packages_tien_thue = 0;
        let packages_tong_tien = 0;
        this.ticket.packages.forEach(item => {
            if (item.naptien_hh_yn == true) {
                packages_thanh_tien += item.thanh_tien;
                packages_tien_thue += item.tien_thue;
                packages_tong_tien += item.tong_tien;
            }
        })

        // Tính tổng tiền thuế của chi tiết dịch vụ
        const serviceTax = this.ticket.service.map(e => e.tien_thue || 0).reduce((pre, cur) => pre + cur, 0) || 0;

        // Tính tổng tiền thuế của chi tiết vật tư
        const merchandiseTax = this.ticket.merchandise
            .filter(e => !e.km_yn)
            .map(e => e.tien_thue || 0)
            .reduce((pre, cur) => pre + cur, 0) || 0;

        this.ticket.masterInfo.t_tien_nt2 = merchandiseMoney + serviceMoney + packages_thanh_tien;
        // this.ticket.masterInfo.t_thue_nt = this.commonService.rouding(serviceTax + merchandiseTax, option_thue);
        this.ticket.masterInfo.t_thue_nt = serviceTax + merchandiseTax + packages_tien_thue;
        this.ticket.masterInfo.t_ck = this.ticket.discount.map(e => e.tien_ck).reduce((pre, cur) => pre + cur, 0);
        this.ticket.masterInfo.t_tt_nt = this.ticket.masterInfo.t_tien_nt2 + this.ticket.masterInfo.t_thue_nt;
        // this.ticket.masterInfo.t_tt_nt = this.commonService.rouding(this.ticket.masterInfo.t_tt_nt, this.option);
        this.ticket.masterInfo.fqty1 = this.ticket.masterInfo.t_tt_nt + this.ticket.masterInfo.t_cp_khac;

        this.ticket.masterInfo.t_con_no = this.ticket.masterInfo.t_tt_nt - this.ticket.masterInfo.t_da_tra - this.ticket.masterInfo.tien_coc;
        // this.ticket.masterInfo.t_con_no = this.commonService.rouding(this.ticket.masterInfo.t_con_no, this.option);

        this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);

    }

    // validate ticket before create or update
    validateTicket(ticket: RetailSaleTicket): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ngay_ct) {
            message = this.commonService.getMessage('lbl_invalid_ngay_ct');
        } else if (!ticket.masterInfo.ma_dvcs) {
            message = this.commonService.getMessage('lbl_invalid_ma_dvcs');
        } else if (this.validatePayment(ticket.payment)) {
            message = this.commonService.getMessage('lbl_invalid_payment');
        } else if (ticket.merchandise.filter(e => !e.km_yn).length === 0) {
            message = this.commonService.getMessage('lbl_invalid_detail');
        } else if (ticket.merchandise.filter(e => !e.ma_imei && e.km_yn && !e.no_km_yn).length > 0) {
            message = this.commonService.getMessage('lbl_invalid_imei_detail');
        } else if (ticket.masterInfo.t_tt_nt < 0) {
            message = this.commonService.getMessage('lbl_invalid_tt');
        } else if (ticket.masterInfo.t_tien_nt2 < 0) {
            message = this.commonService.getMessage('lbl_invalid_t_tien');
        } else if (ticket.masterInfo.t_da_tra < 0) {
            message = this.commonService.getMessage('lbl_invalid_t_da_tra');
        }
        else if (ticket.discount.find(x => x.loai_ck == DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER) && ((!ticket.masterInfo.nguoi_duyet_ck) || (ticket.masterInfo.nguoi_duyet_ck.trim() === ''))) {
            message = this.commonService.getMessage('lbl_invalid_ck04');
        }
        return message;
    }

    isInvalidForm(masterInfo: MasterInfo) {
        if (!masterInfo.ma_kh) {
            return true;
        }
        return false;
    }

    validatePayment(payment: Payment): boolean {
        return false;
        if (!payment.tien_mat?.selected &&
            !payment.quet_the?.selected &&
            !payment.chuyen_khoan?.selected &&
            !payment.vnpay?.selected &&
            !payment.tra_gop?.selected &&
            !payment.vi_dien_tu?.selected) {
            return true;
        }
        return false;
    }

    // #endregion other

    isInvalidMerchandise(items: Merchandise[]): boolean {
        for (const item of items) {
            if (item.so_luong < 0 || item.gia_ban < 0 || item.gia_ck < 0 || item.thanh_tien < 0 || item.tien_thue < 0 || item.thanh_toan < 0)
                return false;
        }
        return true;
    }

    isInvalidService(items: Service[]): boolean {
        for (const item of items) {
            if (item.so_luong < 0 || item.gia_ban < 0 || item.gia_ck < 0 || item.thanh_tien < 0 || item.tien_thue < 0 || item.tong_tien < 0)
                return false;
        }
        return true;
    }


}
