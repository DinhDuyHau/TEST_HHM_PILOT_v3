import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Payment, TransferDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, Merchandise, ReturnSaleTicketCreate, TAB_NAME } from '@app/sales-management/model/ticket/sale-return/model';
import { CommonService } from '../common/common.service';
import { MerchandiseService } from '../common/merchandise.service';
import { MerchandiseRequest, MasterInfoRequest } from '@app/sales-management/model/ticket/sale-return/request.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { PaymentService } from '../common/payment.service';
import { Language } from '../common/language';
import { Service, ServiceRequest } from '@app/sales-management/model/ticket/common-model/service.model';
import { ServiceForImeiComponent } from '@app/sales-management/component/merchandise-service/service-for-imei/service-for-imei.component';
import { ServiceOfMerchandiseService } from '../common/service.service';


@Injectable({
    providedIn: 'root'
})
export class SaleReturnService {
    ticket!: ReturnSaleTicketCreate;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private imeiApiService: ImeiApiService,
        private merchandiseApiService: MerchandiseApiService,
        private commonService: CommonService,
        private paymentService: PaymentService,
        private merchandiseService: MerchandiseService,
        private serviceOfMerchandiseService: ServiceOfMerchandiseService,
    ) {
    }

    //#region setter
    setTicket(ticket: ReturnSaleTicketCreate) {
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
            switch (e.name.toLocaleLowerCase()) {
                case TAB_NAME.MERCHANDISE:
                    this.merchandiseService.convertFromVoucher(e.data, this.ticket.merchandise, Merchandise);
                    break;
                case TAB_NAME.SERVICE:
                    this.serviceOfMerchandiseService.convertFromVoucher(e.data, this.ticket.service);
                    break;
                case TAB_NAME.ELECTRONIC_BILL:
                    this.ticket.electronic_bill = this.commonService.convertDateOfModelFromVoucher(e.data[0]);
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

        voucherDto.masterInfo = this.commonService.convertMasterInfo(this.ticket.masterInfo, MasterInfoRequest);

        //2024-05-05: bổ sung fcode1 lưu loại trả lại
        voucherDto.masterInfo.fcode1 = this.ticket.masterInfo.fcode1;

        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.MERCHANDISE, data: this.merchandiseService.convertMerchandiseToRequest(this.ticket.merchandise, voucherDto.masterInfo, MerchandiseRequest) }];
        // voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.ELECTRONIC_BILL, data: [] }];
        voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.ELECTRONIC_BILL, data: [this.commonService.convertDateOfModelToRequest(this.ticket.electronic_bill, voucherDto.masterInfo)] }];
        voucherDto.details = [...voucherDto.details, { id: 3, name: TAB_NAME.PAYMENT, data: this.paymentService.convertPaymentToRequest(this.ticket.payment, voucherDto.masterInfo) }];
        voucherDto.details = [...voucherDto.details, { id: 4, name: TAB_NAME.SERVICE, data: this.serviceOfMerchandiseService.convertServiceToRequest(this.ticket.service, voucherDto.masterInfo, ServiceRequest) }];
        return voucherDto;
    }

    initTicket(ticket: ReturnSaleTicketCreate) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);

        ticket.masterInfo.ma_ct = TICKET_CODE.RETURN;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.RETURN).subscribe(result => {
            ticket.masterInfo.so_ct = result.result as any;
        });
    }

    //#endregion init

    //#region customer
    setInfoCustomer(customer: Customer) {
        this.ticket.masterInfo.ma_kh = customer.ma_kh;
        this.ticket.masterInfo.ten_kh = customer.ten_kh;
        this.ticket.masterInfo.dia_chi = customer.dia_chi;

        if (this.ticket.payment.chuyen_khoan.detail.length == 0)
            this.ticket.payment.chuyen_khoan.detail = [new TransferDetail];
        this.ticket.payment.chuyen_khoan.detail[0].ten_ngan_hang = customer.ngan_hang || '';
        this.ticket.payment.chuyen_khoan.detail[0].tk_nh_nhan = customer.tk_nh || '';
        this.ticket.payment.chuyen_khoan.detail[0].ten_nguoi_nhan = customer.ten_kh || '';
    }

    resetCustomerInfo(ticket: ReturnSaleTicketCreate) {
        ticket.masterInfo.ten_kh = '';
        ticket.masterInfo.dia_chi = '';
    }

    //#endregion customer

    // #region imei
    getSoldInfo(imei: string, rate = -1, tien_giam = 0, loai_tra_lai = "") {
        return this.imeiApiService.getSoldInfo(imei, this.ticket.masterInfo.ma_cuahang, this.ticket.masterInfo.ma_ct, rate, tien_giam, loai_tra_lai);
    }

    getMerchandiseInfo(ma_vt: string) {
        return this.merchandiseApiService.getOneById(ma_vt);
    }
    // #endregion imei

    // #region merchandise
    removePromotionMechandise(merchandise: Merchandise) {
        this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        this.ticket.masterInfo.t_tien_tnk += merchandise.tien_kmqd;
        this.calcMoney();
        this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        this.commonService.showMessage(Language.content.Delete_Completed);
        // this.imeiApiService.updateImeiState([merchandise.ma_imei], false, 1).subscribe((result) => {
        //     if (!result.result[0].dat_hang_yn) {
        //         this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        //         this.ticket.masterInfo.t_tien_tnk += merchandise.tien_kmqd;
        //         this.calcMoney();
        //         this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        //         this.commonService.showMessage(Language.content.Delete_Completed);
        //     }
        // });
    }

    removeMerchandise(merchandise: Merchandise) {
        this.merchandiseService.removeMerchandise(merchandise, this.ticket.merchandise);
        this.merchandiseService.removePromotionMerchandiseByOrderImei(merchandise.ma_imei, this.ticket.merchandise);
        this.removeServiceAfterRemoveMerchandise(merchandise)
        this.calcMoney();
        this.commonService.removeImeiFromStorage(merchandise.ma_imei);
        this.commonService.showMessage(Language.content.Delete_Completed);
    }

    // #endregion merchandise

    //#region 
    removeServiceAfterRemoveMerchandise(merchandise: Merchandise) {
        this.serviceOfMerchandiseService.removeServiceAfterRemoveMerchandise(merchandise, this.ticket.service);
        this.calcMoney();
    }
    //#endregion

    //#region other
    calcMoney() {
        this.ticket.masterInfo.t_so_luong = this.ticket.merchandise.length + this.ticket.service.length;

        const merchandiseMoney = this.ticket.merchandise
            .filter(e => !e.km_yn)
            .map(e => e.thanh_tien)
            .reduce((pre, cur) => pre + cur, 0);

        const merchandiseTax = this.ticket.merchandise
            .filter(e => !e.km_yn)
            .map(e => e.tien_thue)
            .reduce((pre, cur) => pre + cur, 0);

        const discountMoney = this.ticket.merchandise
            .filter(e => !e.km_yn)
            .map(e => e.tien_ck)
            .reduce((pre, cur) => pre + cur, 0);

        const incomeMoney = this.ticket.merchandise
            .map(e => e.tien_giam!)
            .reduce((pre, cur) => pre + cur, 0);

        const totalMoney = this.ticket.merchandise
            .map(e => e.thanh_toan)
            .reduce((pre, cur) => pre + cur, 0);

        //service
        const serviceMoney = this.ticket.service.map(e => e.thanh_tien).reduce((pre, cur) => pre + cur, 0);
        const serviceIncomMoney = this.ticket.service.map(e => e.tien_giam).reduce((pre, cur) => pre + cur, 0);
        const seviceDiscountMoney = this.ticket.service.map(e => e.ck_nt).reduce((pre, cur) => pre + cur, 0);
        const serviceTaxMoney = this.ticket.service.map(e => e.tien_thue).reduce((pre, cur) => pre + cur, 0);
        const serviceTotalMoney = this.ticket.service.map(e => e.tong_tien).reduce((pre, cur) => pre + cur, 0);

        this.ticket.masterInfo.t_tien_tnk = incomeMoney + serviceIncomMoney;
        this.ticket.masterInfo.t_ck = discountMoney + seviceDiscountMoney;
        this.ticket.masterInfo.t_thue_nt = merchandiseTax + serviceTaxMoney;
        this.ticket.masterInfo.t_tien_nt2 = merchandiseMoney + serviceMoney;
        this.ticket.masterInfo.t_tt_nt = totalMoney + serviceTotalMoney;
        this.ticket.masterInfo.t_tt_nt = this.commonService.rouding(this.ticket.masterInfo.t_tt_nt);

        this.ticket.masterInfo.t_con_no = this.ticket.masterInfo.t_tt_nt - this.ticket.masterInfo.t_da_tra;

        this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);
    }

    // validate ticket before create or update
    validateTicket(ticket: ReturnSaleTicketCreate): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ma_dvcs) {
            message = this.commonService.getMessage('lbl_invalid_ma_dvcs');
        } else if (!ticket.masterInfo.ma_kh && !ticket.masterInfo.ten_kh) {
            message = this.commonService.getMessage('lbl_invalid_ma_kh');
        } else if (ticket.masterInfo.t_tt_nt < 0) {
            message = this.commonService.getMessage('lbl_invalid_tt');
        } else if (ticket.masterInfo.t_tien_nt2 < 0) {
            message = this.commonService.getMessage('lbl_invalid_t_tien');
        } else if (ticket.masterInfo.t_da_tra < 0 || ticket.masterInfo.t_con_no < 0) {
            message = this.commonService.getMessage('lbl_error_negative_number');
        }

        if (ticket.merchandise && ticket.merchandise.length > 0 && !this.isInvalidMerchandise(ticket.merchandise)) {
            return this.commonService.getMessage('lbl_error_negative_number');
        }
        if (ticket.service && ticket.service.length > 0 && !this.isInvalidService(ticket.service)) {
            return this.commonService.getMessage('lbl_error_negative_number');
        }

        return message;
    }

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
    getImeiInStore(imei: string) {
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.RETAIL);
    }
    getStatusImei(imei: string) {
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.RETAIL);
    }
    // #endregion other
    getListImeiInfo(ma_imei: string[]) {
        return this.imeiApiService.getImeisState(ma_imei);
    }
}