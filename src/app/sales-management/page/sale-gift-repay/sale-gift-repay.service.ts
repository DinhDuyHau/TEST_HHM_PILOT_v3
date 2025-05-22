import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, Merchandise, GiftRepaySaleTicketCreate, TAB_NAME } from '@app/sales-management/model/ticket/sale-gift-repay/model';
import { CommonService } from '../common/common.service';
import { DiscountService } from '../common/discount.service';
import { MerchandiseService } from '../common/merchandise.service';
import { MerchandiseRequest, MasterInfoRequest } from '@app/sales-management/model/ticket/sale-gift-repay/request.model';
import { Language } from '../common/language';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';

@Injectable({
    providedIn: 'root'
})
export class SaleGiftRepayService {
    discountOptions: Discount[] = [];
    isNeedCalcDiscount = true;
    ticket!: GiftRepaySaleTicketCreate;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private imeiApiService: ImeiApiService,
        private merchandiseApiService: MerchandiseApiService,
        private discountService: DiscountService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
    ) {

    }
    //#region setter
    setTicket(ticket: GiftRepaySaleTicketCreate) {
        this.ticket = ticket;
    }
    //#endregion setter

    // #region init
    loadData(data: VoucherDto) {
        this.ticket.masterInfo = this.commonService.convertMasterInfoFromVoucher(data.masterInfo, MasterInfo);
        this.customerApiService.getOneById(data.masterInfo.ma_kh).subscribe(result => {
            const customer = result.result as any;
            this.ticket.masterInfo.ten_kh = customer.ten_kh;
            this.ticket.masterInfo.dia_chi = customer.dia_chi;
        });

        data.details.forEach(e => {
            switch (e.name) {
                case TAB_NAME.MERCHANDISE:
                    this.merchandiseService.convertFromVoucher(e.data, this.ticket.merchandise, Merchandise);
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
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.MERCHANDISE, data: this.merchandiseService.convertMerchandiseToRequest(this.ticket.merchandise, voucherDto.masterInfo, MerchandiseRequest) }];
        return voucherDto;
    }

    initTicket(ticket: GiftRepaySaleTicketCreate) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);

        ticket.masterInfo.ma_ct = TICKET_CODE.GIFT_REPAY;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.GIFT_REPAY).subscribe(result => {
            // ticket.masterInfo.so_ct = result.result as any;
            const newSoCT = result.result as any;
            const voucherCheckJson = localStorage.getItem("voucherNumberCheck");
            const voucherNumberCheck = voucherCheckJson ? JSON.parse(voucherCheckJson) : {};
            const current_soct = voucherNumberCheck.so_ct || "";
            if (current_soct === newSoCT) {
                this.initTicket(ticket);
            } else {
                ticket.masterInfo.so_ct = newSoCT;
                voucherNumberCheck[ticket.masterInfo.ma_ct] = newSoCT;
                localStorage.setItem("voucherNumberCheck", JSON.stringify(voucherNumberCheck));
                this.commonService.saveVoucherNumberLocalStorage(ticket.masterInfo.so_ct, TICKET_CODE.RETAIL);
            }
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


        this.ticket.merchandise = [];
    }

    resetCustomerInfo(ticket: GiftRepaySaleTicketCreate) {
        ticket.masterInfo.ten_kh = '';
        ticket.masterInfo.dia_chi = '';
    }


    //#endregion customer

    // #region imei
    getImeiInStore(imei: string, ngay_ct: Date | null = null) {
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.GIFT_REPAY, ngay_ct);
    }

    getMerchandiseInfo(ma_vt: string) {
        return this.merchandiseApiService.getOneById(ma_vt);
    }
    // #endregion imei

    // #region merchandise

    removeMerchandise(merchandise: Merchandise) {
        this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        this.calcMoney();
        this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        this.commonService.showMessage(Language.content.Delete_Completed);
        // this.imeiApiService.updateImeiState([merchandise.ma_imei], false).subscribe((result) => {
        //     if (!result.result[0].dat_hang_yn) {
        //         this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        //         this.calcMoney();
        //         this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        //         this.commonService.showMessage(Language.content.Delete_Completed);
        //     }
        // });
    }
    // #endregion merchandise

    //#region other
    calcMoney() {
        this.ticket.masterInfo.t_so_luong = this.ticket.merchandise.length;

        this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);
    }

    // validate ticket before create or update
    validateTicket(ticket: GiftRepaySaleTicketCreate): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ngay_ct) {
            message = this.commonService.getMessage('lbl_invalid_ngay_ct');
        } else if (!ticket.masterInfo.ma_dvcs) {
            message = this.commonService.getMessage('lbl_invalid_ma_dvcs');
        } else if (!ticket.masterInfo.ma_kh && !ticket.masterInfo.ten_kh) {
            message = this.commonService.getMessage('lbl_invalid_ma_kh');
        } else if (ticket.merchandise.length === 0) {
            message = this.commonService.getMessage('lbl_invalid_detail');
        } else if (ticket.merchandise.find(mer => !mer.ma_imei)) {
            message = this.commonService.getMessage('lbl_invalid_imei_detail');
        } else if (ticket.masterInfo.dien_giai.length > 250) {
            message = 'Diễn giải không được vượt quá 250 ký tự';
        }

        return message;
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
