import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { DiscountApiService } from '@app/sales-management/api/discount-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { DISCOUNT_TYPE, Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, Merchandise, ChangeSaleTicket, TAB_NAME, ServiceChange } from '@app/sales-management/model/ticket/sale-change/model';
import { Observable, Subject, of } from 'rxjs';
import { CommonService } from '../common/common.service';
import { DiscountService } from '../common/discount.service';
import { MerchandiseService } from '../common/merchandise.service';
import { ResultNoPaging } from '@app/_models/Result';
import { PaymentService } from '../common/payment.service';
import { GuanranteeService } from '../common/guarantee.service';
import { MerchandiseRequest, MasterInfoRequest, ServiceChangeRequest } from '@app/sales-management/model/ticket/sale-change/request.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { Language } from '../common/language';
import { ServiceOfMerchandiseService } from '../common/service.service';

@Injectable({
    providedIn: 'root'
})
export class SaleChangeService {
    discountOptions: Discount[] = [];
    isNeedCalcDiscount = true;
    ticket!: ChangeSaleTicket;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private imeiApiService: ImeiApiService,
        private merchandiseApiService: MerchandiseApiService,
        private discountApiService: DiscountApiService,
        private discountService: DiscountService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
        private paymentService: PaymentService,
        private guanranteeService: GuanranteeService,
        private serviceOfMerchandiseService: ServiceOfMerchandiseService
    ) {

    }

    //#region setter
    setTicket(ticket: ChangeSaleTicket) {
        this.ticket = ticket;
    }
    //#endregion setter

    // #region init
    loadData(data: VoucherDto) {
        this.ticket.masterInfo = this.commonService.convertMasterInfoFromVoucher(data.masterInfo, MasterInfo);
        this.customerApiService.getOneById(data.masterInfo.ma_kh).subscribe(result => {
            const customer = result.result as any;
            this.ticket.masterInfo.ten_kh = customer.ma_kh;
            this.ticket.masterInfo.dia_chi = customer.dia_chi;
        });

        this.customerApiService.getOneById(data.masterInfo.ma_nvvc).subscribe((result: any) => {
            if (result.result) {
                this.ticket.masterInfo.ten_nvvc = result.result.ten_kh;
            }
        });

        data.details.forEach(e => {
            switch (e.name) {
                case TAB_NAME.MERCHANDISE_RETURN:
                    this.merchandiseService.convertFromVoucher(e.data, this.ticket.merchandise_return, Merchandise);
                    break;
                case TAB_NAME.MERCHANDISE_CHANGE:
                    this.merchandiseService.convertFromVoucher(e.data, this.ticket.merchandise_change, Merchandise);
                    break;
                case TAB_NAME.GUARANTEE:
                    this.ticket.guarantee = e.data;
                    break;
                case TAB_NAME.SERVICE:
                    this.serviceOfMerchandiseService.convertFromVoucher(e.data, this.ticket.service, ServiceChange);
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
        voucherDto.masterInfo = this.commonService.convertMasterInfo(this.ticket.masterInfo, MasterInfoRequest);
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.MERCHANDISE_CHANGE, data: this.merchandiseService.convertMerchandiseToRequest(this.ticket.merchandise_change, voucherDto.masterInfo, MerchandiseRequest) }];
        voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.MERCHANDISE_RETURN, data: this.merchandiseService.convertMerchandiseToRequest(this.ticket.merchandise_return, voucherDto.masterInfo, MerchandiseRequest) }];
        voucherDto.details = [...voucherDto.details, { id: 4, name: TAB_NAME.GUARANTEE, data: this.guanranteeService.convertGuanranteeToRequest(this.ticket.guarantee, voucherDto.masterInfo) }];
        voucherDto.details = [...voucherDto.details, { id: 5, name: TAB_NAME.SERVICE, data: this.serviceOfMerchandiseService.convertServiceToRequest(this.ticket.service, voucherDto.masterInfo, ServiceChangeRequest) }];

        return voucherDto;
    }

    initTicket(ticket: ChangeSaleTicket) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);

        ticket.masterInfo.ma_ct = TICKET_CODE.CHANGE;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.CHANGE).subscribe(result => {
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

        //Thông tin khách hàng trên hóa đơn điện tử
        this.ticket.masterInfo.hd_dia_chi = customer.hoadon_diachi || '';
        this.ticket.masterInfo.hd_email = customer.hoadon_email || '';
        this.ticket.masterInfo.hd_mst = customer.hoadon_mst || '';
        this.ticket.masterInfo.hd_ten_kh = customer.hoadon_tenkh || '';
    }

    resetCustomerInfo(ticket: ChangeSaleTicket) {
        ticket.masterInfo.ten_kh = '';
        ticket.masterInfo.dia_chi = '';
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
    getImeiInStore(imei: string) {
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.CHANGE);
    }

    getSoldInfo(imei: string) {
        return this.imeiApiService.getSoldInfo(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.CHANGE);
    }


    getMerchandiseInfo(ma_vt: string) {
        return this.merchandiseApiService.getOneById(ma_vt);
    }

    addPromotionMerchandise(discount: Discount, imei_mua: string, return_or_change: Merchandise[]) {
        const addMerchandise = (result: any) => {
            (result.result as any as Merchandise).imei_mua = imei_mua;
            (result.result as any as Merchandise).km_yn = true;
            this.merchandiseService.addNew(result.result, return_or_change, Merchandise);
            this.calcMoney();
        };
        const subject = new Subject<any>();
        subject.subscribe(({ ma_vt_tang, ma_vt_tt }) => {
            this.getMerchandiseInfo(ma_vt_tang).subscribe(result => {
                if (result.success && result.result) {
                    addMerchandise(result);
                } else {
                    this.getMerchandiseInfo(ma_vt_tt).subscribe(result => {
                        if (result.success && result.result) {
                            addMerchandise(result);
                        } else {
                            this.commonService.showMessage(Language.content.No_promotional_items_found);
                        }
                    });

                }
            });
        });

        this.discountService.getMerchandiseCodeOfPM(discount).map((ma_vt: { ma_vt_tang: string, ma_vt_tt: string }) => {
            subject.next(ma_vt);
            subject.unsubscribe();
        });
    }

    // #endregion imei

    // #region merchandise
    removePromotionMechandise(merchandise: Merchandise, return_or_change: Merchandise[]) { // = return_or_change: Merchandise[] : this.ticket.merchandise_return
        const handleRemove = () => {
            this.merchandiseService.removeMerchandise(merchandise, return_or_change);
            const merchandiseMain = this.merchandiseService.getByImeiBuy(merchandise.imei_mua, return_or_change);
            if (merchandiseMain) {
                const money = this.discountService.getMoneyOfGiftDiscount(merchandise, this.ticket.discount);
                merchandiseMain.tien_ck_qd += money;
                this.calcMoney();
                this.commonService.showMessage(Language.content.Delete_Completed);
            }
        };
        if (merchandise.ma_imei) {
            handleRemove();
            // this.imeiApiService.updateImeiState([merchandise.ma_imei], false).subscribe(result => {
            //     if (result.success && !result.result[0].dat_hang_yn) {
            //         handleRemove();
            //         this.commonService.removeImeiFromStorage(merchandise.ma_imei);
            //     }
            // });
        } else {
            handleRemove();
        }
    }

    removeMerchandiseReturn(merchandise: Merchandise) {
        this.ticket.merchandise_return = this.ticket.merchandise_return.filter(mer => mer.ma_imei !== merchandise.ma_imei);
        this.ticket.service = [];
        this.calcMoney();
        this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        // this.imeiApiService.updateImeiState([merchandise.ma_imei], false, 1).subscribe(result => {
        //     if (result.success && !result.result[0].dat_hang_yn) {
        //         this.ticket.merchandise_return = this.ticket.merchandise_return.filter(mer => mer.ma_imei !== merchandise.ma_imei);
        //         this.calcMoney();
        //         this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        //     }
        // });
    }

    removeMerchandiseChange(merchandise: Merchandise) {
        this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise_change);
        // this.guanranteeService.removeGuarantee(merchandise.ma_imei, this.ticket);
        this.calcMoney();
        this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        this.commonService.showMessage(Language.content.Delete_Completed);
        // this.imeiApiService.updateImeiState([merchandise.ma_imei], false).subscribe((result) => {
        //     if (!result.result[0].dat_hang_yn) {
        //         this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise_change);
        //         this.guanranteeService.removeGuarantee(merchandise.ma_imei, this.ticket);
        //         this.calcMoney();
        //         this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        //         this.commonService.showMessage(Language.content.Delete_Completed);
        //     }
        // });
    }

    changePromotionMerchandise(merchandise: Merchandise, return_or_change: Merchandise[]) {
        const changeMerchandise = (ma_vt: string) => {
            ma_vt && this.getMerchandiseInfo(ma_vt).subscribe(result => {
                if (result.success && result.result) {
                    const merchandiseAlt = this.merchandiseService.createNewMerchandise(result.result, Merchandise);
                    this.merchandiseService.swapMerchandise(merchandise, merchandiseAlt, return_or_change);
                    // this.guanranteeService.removeGuarantee(merchandise.ma_imei, this.ticket);
                    this.commonService.showMessage(Language.content.Successful_Change_Promotion);
                } else {
                    // this.commonService.showMessage("Đổi hàng khuyến mãi thất bại");
                    this.commonService.showMessage(Language.content.Failed_Change_Promotion);
                }
            });
        };
        const ma_vt = this.discountService.getMerchandiseCodeOfPMAlter(merchandise, this.ticket.discount);
        if (ma_vt && merchandise.ma_imei) {
            changeMerchandise(ma_vt);
            // this.imeiApiService.updateImeiState([merchandise.ma_imei], false)
            //     .subscribe(result => {
            //         if (result.success && !result.result[0].dat_hang_yn) {
            //             changeMerchandise(ma_vt);
            //             this.commonService.removeImeiFromStorage(merchandise.ma_imei);
            //         }
            //     });
        } else if (ma_vt) {
            changeMerchandise(ma_vt);
        }
    }

    // handle select no_km
    // #endregion merchandise

    // #region discount

    calcDiscount(return_or_change: Merchandise[]): Observable<ResultNoPaging<Discount>> | undefined {
        const ma_cuahang = this.ticket.masterInfo.ma_cuahang;
        const ma_kh = this.ticket.masterInfo.ma_kh;
        const ngay_lap = formatDate(this.ticket.masterInfo.ngay_ct, 'yyyy/MM/dd', 'en_US');
        const entity = TICKET_ENTITY.CHANGE;
        const merchandise = return_or_change;
        if (this.isNeedCalcDiscount) {
            return this.discountApiService.getDiscountForTicket(entity, merchandise, ma_cuahang, ma_kh, ngay_lap);
        }
        return;
    }

    addDiscount(discounts: Discount[], return_or_change: Merchandise[]) {
        discounts.forEach(discount => {
            if (discount.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE ||
                discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
                discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET) {
                this.discountService.addNew([discount], this.ticket.discount);
                this.calcMoney();
            }
        });
    }

    removeDiscount(discounts: Discount[], return_or_change: Merchandise[]) {
        discounts.forEach(discount => {
            if (discount.loai_ck === DISCOUNT_TYPE.REDUTION_BY_MERCHANDISE_CODE ||
                discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_CUSTOMER ||
                discount.loai_ck === DISCOUNT_TYPE.REDUTION_FOR_TICKET) {
                this.discountService.removeDiscount([discount], this.ticket.discount);
                this.calcMoney();
            }
        });
    }
    // #endregion discount

    //#region other
    calcMoney() {
        this.ticket.masterInfo.t_so_luong = this.ticket.merchandise_change.length + this.ticket.merchandise_return.length;
        this.merchandiseService.updatePriceForMerchandise(this.ticket, this.ticket.merchandise_change);

        const tong_thue_tra = this.ticket.merchandise_return
            .map(e => e.tien_thue)
            .reduce((pre, cur) => pre + cur, 0);

        const tong_thue_doi = this.ticket.merchandise_change
            .map(e => e.tien_thue)
            .reduce((pre, cur) => pre + cur, 0);

        const merchandiseReturnMoney = this.ticket.merchandise_return
            .map(e => e.thanh_toan)
            .reduce((pre, cur) => pre + cur, 0);

        const merchandiseChangeMoney = this.ticket.merchandise_change
            .map(e => e.thanh_toan)
            .reduce((pre, cur) => pre + cur, 0);

        this.ticket.masterInfo.t_tien_nt2 = merchandiseChangeMoney - merchandiseReturnMoney;
        this.ticket.masterInfo.t_thue_nt = this.commonService.rouding(tong_thue_doi - tong_thue_tra);
        this.ticket.masterInfo.t_tt_nt = this.ticket.masterInfo.t_tien_nt2 + this.ticket.masterInfo.t_thue_nt;
        this.ticket.masterInfo.t_tt_nt = this.commonService.rouding(this.ticket.masterInfo.t_tt_nt);

        this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);
    }

    // validate ticket before create or update
    validateTicket(ticket: ChangeSaleTicket): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ngay_ct) {
            message = this.commonService.getMessage('lbl_invalid_ngay_ct');
        } else if (!ticket.masterInfo.ma_dvcs) {
            message = this.commonService.getMessage('lbl_invalid_ma_dvcs');
        } else if (!ticket.masterInfo.ma_kh && !ticket.masterInfo.ten_kh) {
            message = this.commonService.getMessage('lbl_invalid_ma_kh');
        } else if (ticket.merchandise_return.filter(e => !e.km_yn).length === 0) {
            message = this.commonService.getMessage('lbl_invalid_ma_vt_tra');
        } else if (ticket.merchandise_change.filter(e => !e.km_yn).length === 0) {
            message = this.commonService.getMessage('lbl_invalid_ma_vt_doi');
        } else if (ticket.merchandise_return.filter(e => !e.ma_imei && e.km_yn && !e.no_km_yn).length > 0) {
            message = this.commonService.getMessage('lbl_invalid_imei_tra');
        } else if (ticket.merchandise_change.filter(e => !e.ma_imei && e.km_yn && !e.no_km_yn).length > 0) {
            message = this.commonService.getMessage('lbl_invalid_imei_doi');
        }
        else if (this.ticket.merchandise_change.length == 0) {
            message = this.commonService.getMessage('lbl_invalid_merchandise_change');
        }
        else if (this.ticket.merchandise_return.length == 0) {
            message = this.commonService.getMessage('lbl_invalid_merchandise_return');
        }
        else if (this.ticket.merchandise_return.length != 1 || this.ticket.merchandise_return.length != 1) {
            message = this.commonService.getMessage('lbl_invalid_merchandise_return_change');
        }
        return message;
    }

    isValidMerchandise() {
        const val1 = this.ticket.merchandise_change.map(e => e.ma_vt);
        const val2 = this.ticket.merchandise_return.map(e => e.ma_vt);

        for (const item of this.ticket.merchandise_change) {
            if (!val2.includes(item.ma_vt)) {
                return false;
            }
        }

        for (const item of this.ticket.merchandise_return) {
            if (!val1.includes(item.ma_vt)) {
                return false;
            }
        }

        return true;
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

}
