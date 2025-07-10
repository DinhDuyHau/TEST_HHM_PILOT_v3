import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, Merchandise, SaleRepurchaseTicket, TAB_NAME } from '@app/sales-management/model/ticket/sale-repurchase/model';
import { CommonService } from '../common/common.service';
import { MerchandiseService } from '../common/merchandise.service';
import { MerchandiseRequest, MasterInfoRequest } from '@app/sales-management/model/ticket/sale-repurchase/request.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { Language } from '../common/language';
import { PaymentService } from '../common/payment.service';
import { getDateFormat } from '@app/_common/commonFunction';
import { Observable } from 'rxjs';
import { ResultNoPaging } from '@app/_models';

@Injectable({
    providedIn: 'root'
})
export class SaleRepurchaseService {
    discountOptions: Discount[] = [];
    isNeedCalcDiscount = true;
    ticket!: SaleRepurchaseTicket;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private imeiApiService: ImeiApiService,
        private merchandiseApiService: MerchandiseApiService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
        private paymentService: PaymentService
    ) {

    }

    //#region setter
    setTicket(ticket: SaleRepurchaseTicket) {
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
        voucherDto.masterInfo = this.convertMasterInfo(this.ticket.masterInfo, MasterInfoRequest);
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.MERCHANDISE, data: this.convertMerchandiseToRequest(this.ticket.merchandise, voucherDto.masterInfo, MerchandiseRequest) }];
        voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.PAYMENT, data: this.paymentService.convertPaymentToRequest(this.ticket.payment, voucherDto.masterInfo) }];
        return voucherDto;
    }

    initTicket(ticket: SaleRepurchaseTicket) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);

        ticket.masterInfo.ma_ct = TICKET_CODE.REPURCHASE;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.REPURCHASE).subscribe(result => {
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
                this.commonService.saveVoucherNumberLocalStorage(ticket.masterInfo.so_ct, TICKET_CODE.REPURCHASE);
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
        this.ticket.masterInfo.email_nhan_key = customer.email_cn;

        //Thông tin khách hàng trên hóa đơn điện tử
        this.ticket.masterInfo.hd_dia_chi = customer.hoadon_diachi || '';
        this.ticket.masterInfo.hd_email = customer.hoadon_email || '';
        this.ticket.masterInfo.hd_mst = customer.hoadon_mst || '';
        this.ticket.masterInfo.hd_ten_kh = customer.hoadon_tenkh || '';
    }

    resetCustomerInfo(ticket: SaleRepurchaseTicket) {
        ticket.masterInfo.ten_kh = '';
        ticket.masterInfo.dia_chi = '';
    }
    //#endregion customer

    // #region imei
    getImeiInStore(imei: string) {
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.REPURCHASE);
    }
    getImeisState(imeis: string[]) {
        return this.imeiApiService.getImeisState(imeis);
    }
    getImeisStateAndItem(imeis: string[]) {
        // return this.imeiApiService.getImeisStateAndItem(imeis);
        return this.imeiApiService.getImeisStateAndItemNoEncode(imeis);

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
        // this.imeiApiService.updateImeiState([merchandise.ma_imei], false, 1).subscribe((result) => {
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

        let merchandiseMoney = this.ticket.merchandise
            .map(e => e.tt)
            .reduce((pre, cur) => pre + cur, 0);
        merchandiseMoney = merchandiseMoney;

        this.ticket.masterInfo.t_tien = merchandiseMoney;
        this.ticket.masterInfo.t_tien_nt = merchandiseMoney;
        this.ticket.masterInfo.t_tt = merchandiseMoney;
        this.ticket.masterInfo.t_tt_nt = merchandiseMoney;
        this.ticket.masterInfo.t_tt_nt = merchandiseMoney;
        this.ticket.masterInfo.t_con_no = merchandiseMoney - this.ticket.masterInfo.t_da_tra || 0;

        // this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);
    }

    // validate ticket before create or update
    validateTicket(ticket: SaleRepurchaseTicket): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ngay_ct) {
            message = this.commonService.getMessage('lbl_invalid_ngay_ct');
        } else if (!ticket.masterInfo.ma_dvcs) {
            message = this.commonService.getMessage('lbl_invalid_ma_dvcs');
        } else if (!ticket.masterInfo.ma_kh && !ticket.masterInfo.ten_kh) {
            message = this.commonService.getMessage('lbl_invalid_ma_kh');
        } else if (ticket.masterInfo.t_tt_nt < 0) {
            message = this.commonService.getMessage('lbl_invalid_tt');
        } else if (ticket.masterInfo.t_tien_nt2 < 0) {
            message = this.commonService.getMessage('lbl_invalid_t_tien');
        }
        return message;
    }

    isInvalidForm(masterInfo: MasterInfo) {
        if (!masterInfo.ma_kh) {
            return true;
        }
        return false;
    }

    // #endregion other
    convertMasterInfo = (masterInfo: any, TCreator: { new(): any; }) => {
        const masterInfoNew = new TCreator();
        Object.keys(masterInfoNew).forEach(key => {
            if (masterInfo.hasOwnProperty(key)) {
                masterInfoNew[key] = masterInfo[key];
            }
        });

        masterInfoNew.t_ck_nt = masterInfoNew.t_ck;
        masterInfoNew.t_tien = masterInfoNew.t_tien_nt2;
        masterInfoNew.t_tien_nt = masterInfoNew.t_tien_nt2;
        masterInfoNew.t_tien2 = masterInfoNew.t_tien_nt2;
        masterInfoNew.t_thue = masterInfoNew.t_thue_nt;
        masterInfoNew.t_tt = masterInfoNew.t_tt_nt;
        masterInfoNew.t_gg_nt = masterInfoNew.t_gg;
        masterInfoNew.t_cp_khac_nt = masterInfoNew.t_cp_khac;
        masterInfoNew.ngay_ct = getDateFormat(new Date(masterInfoNew.ngay_ct));
        masterInfoNew.ngay_lct = masterInfoNew.ngay_ct;
        masterInfoNew.s4 = masterInfoNew.t_tien_ban;
        masterInfoNew.fcode1 = masterInfoNew.fcode1;
        masterInfoNew.fqty1 = masterInfoNew.fqty1;
        masterInfoNew.so_ct0 = masterInfoNew.so_ct0;
        masterInfoNew.so_seri0 = masterInfoNew.so_seri0;
        masterInfoNew.ngay_ct0 = masterInfoNew.ngay_ct0;

        Object.keys(masterInfoNew).forEach(key => {
            if (masterInfoNew[key] === undefined) {
                delete masterInfoNew[key];
            }
        });

        return masterInfoNew;
    };

    convertMerchandiseToRequest = (merchandises: any, masterInfo: any, TCreator: { new(): any; }) => {
        const result = (merchandises as any[]).map(merchandise => {
            // repurchase and renew
            merchandise.gia = merchandise.gia_ban; // giá trước thuế
            merchandise.gia_nt = merchandise.gia_ban;
            merchandise.tien = merchandise.thanh_tien;
            merchandise.tien_nt = merchandise.thanh_tien;

            // merchandise.gia_ban = merchandise.gia_ban;
            merchandise.gia_ban_nt = merchandise.gia_ban;
            merchandise.gia2 = merchandise.gia_ban;
            merchandise.gia_nt2 = merchandise.gia_ban;
            // merchandise.gia_ck = merchandise.gia_ck;
            merchandise.gia_ck_nt = merchandise.gia_ck;
            merchandise.ck = merchandise.tien_ck;
            merchandise.ck_nt = merchandise.tien_ck;
            merchandise.tien2 = merchandise.thanh_tien;
            merchandise.tien_nt2 = merchandise.thanh_tien;
            merchandise.thue = merchandise.tien_thue;
            merchandise.thue_nt = merchandise.tien_thue;
            merchandise.tt = merchandise.tt;
            merchandise.tt_nt = merchandise.tt;
            merchandise.thue_suat = merchandise.thue_suat;
            merchandise.s4 = merchandise.s4;

            const rs = this.merchandiseService.createNewMerchandise(merchandise, TCreator);
            rs.km_yn ? rs.km_yn = 1 : rs.km_yn = 0;
            Object.keys(rs).forEach(key => {
                if (rs[key] === undefined) {
                    delete rs[key];
                }
            });
            return rs;
        });

        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };

    adjustBuyPrice(ngay_ct: Date, ma_ncc: string, ma_loai: string, ma_vt: string, gia_bang_gia: any, gia_dc: any): Observable<ResultNoPaging<any>> | undefined {
        return this.ticketApiService.getRepurchaseAdjustBuyPrice(ngay_ct, ma_ncc, ma_loai, ma_vt, gia_bang_gia, gia_dc);
    }

    getOldProgram(ma_ncc: string, ngay_ct: Date): Observable<ResultNoPaging<any>> | undefined {
        return this.ticketApiService.getOldProgram(ma_ncc, ngay_ct);
    }

    getTypeStock(ma_cttc: string, ma_ncc: string, ngay_ct: Date): Observable<ResultNoPaging<any>> | undefined {
        return this.ticketApiService.getTypeStock(ma_cttc, ma_ncc, ngay_ct);
    }
}
