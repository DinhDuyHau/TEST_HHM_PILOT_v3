import { Inject, Injectable, Injector } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Service } from '@app/sales-management/model/ticket/sale-repurchase-service/model';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, ServiceRepurchaseServiceTicket, TAB_NAME } from '@app/sales-management/model/ticket/sale-repurchase-service/model';
import { CommonService } from '../common/common.service';
import { ServiceOfMerchandiseService } from '../common/service.service';
import { PaymentService } from '../common/payment.service';
import { MerchandiseServiceApiService } from '@app/sales-management/api/merchandiseService-api.service';
import { MasterInfoRequest, ServiceRequest } from '@app/sales-management/model/ticket/sale-service/request.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SaleRepurchaseServiceService {
    isNeedCalcDiscount = true;
    ticket!: ServiceRepurchaseServiceTicket;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private merchandiseServiceApiService: MerchandiseServiceApiService,
        private commonService: CommonService,
        private serviceOfMerchandiseService: ServiceOfMerchandiseService,
        private paymentService: PaymentService,
    ) {
    }

    //#region setter
    setTicket(ticket: ServiceRepurchaseServiceTicket) {
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
                case TAB_NAME.SERVICE:
                    this.serviceOfMerchandiseService.convertFromVoucher(e.data, this.ticket.service);
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
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.SERVICE, data: this.serviceOfMerchandiseService.convertServiceToRequest(this.ticket.service, voucherDto.masterInfo, ServiceRequest) }];
        voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.PAYMENT, data: this.paymentService.convertPaymentToRequest(this.ticket.payment, voucherDto.masterInfo) }];

        return voucherDto;
    }

    initTicket(ticket: ServiceRepurchaseServiceTicket) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);
        ticket.masterInfo.ma_ct = TICKET_CODE.REPURCHASE_SERVICE;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ngay_ct = Date();
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.REPURCHASE_SERVICE).subscribe(result => {
            ticket.masterInfo.so_ct = result.result as any;
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
        // this.ticket.masterInfo.hd_dia_chi = customer.hoadon_diachi || '';
        // this.ticket.masterInfo.hd_email = customer.hoadon_email || '';
        // this.ticket.masterInfo.hd_mst = customer.hoadon_mst || '';
        // this.ticket.masterInfo.hd_ten_kh = customer.hoadon_tenkh || '';
    }

    resetCustomerInfo(ticket: ServiceRepurchaseServiceTicket) {
        ticket.masterInfo.ten_kh = '';
        ticket.masterInfo.dia_chi = '';
    }

    //#endregion customer

    // #region service
    setInfoService(service: any, ma_kho: string, buy_price: number) {
        this.merchandiseServiceApiService.getOneById(service.ma_dv).subscribe((result: any) => {
            if (result.success) {
                this.handleAddService(result.result, ma_kho, buy_price);
            }
        });
    }

    handleAddService(service: Service, ma_kho: string, buy_price: number) {
        this.merchandiseServiceApiService.getServicePrice('', service.ma_dv, this.ticket.masterInfo.ma_cuahang).subscribe((result) => {
            if (result.success) {
                const serviceNew = new Service(service);
                serviceNew.ma_thue = (result.result as any).ma_thue;
                serviceNew.gia_vat = buy_price;
                serviceNew.thue_suat = (result.result as any).thue_suat;

                serviceNew.tong_tien = serviceNew.gia_vat * serviceNew.so_luong;
                serviceNew.gia_ban = Math.round(serviceNew.gia_vat / (1 + (serviceNew.thue_suat / 100)));

                serviceNew.thanh_tien = serviceNew.gia_ban * serviceNew.so_luong;
                serviceNew.tien_thue = serviceNew.tong_tien - serviceNew.thanh_tien;

                serviceNew.ma_kho = ma_kho;

                this.serviceOfMerchandiseService.addNewServiceSale([serviceNew], this.ticket.service);
                this.calcMoney();
                return;
            }
            else {
                this.commonService.showMessageByName('lbl_invalid_ma_dv');
            }
        });
    }

    // #endregion service
    // Remove service
    removeService(item: Service, ticket: ServiceRepurchaseServiceTicket) {
        this.serviceOfMerchandiseService.removeService(item, ticket.service);
        this.calcMoney();
        this.commonService.showMessageByNameAdvance('lblSuccessDeleteService', { name: '%ma_dv', value: item.ma_dv });
    }

    //#region other
    calcMoney() {
        this.ticket.masterInfo.t_so_luong = this.ticket.service.map(e => +e.so_luong).reduce((pre, cur) => pre + cur, 0);

        const serviceMoney = this.ticket.service
            .map(e => e.thanh_tien)
            .reduce((pre, cur) => pre + cur, 0);

        this.ticket.masterInfo.t_tien_nt2 = serviceMoney;

        this.ticket.masterInfo.t_thue_nt = this.ticket.service
            .map(e => e.tien_thue)
            .reduce((pre, cur) => pre + cur, 0);
        this.ticket.masterInfo.t_thue_nt = this.ticket.masterInfo.t_thue_nt;

        this.ticket.masterInfo.t_tt_nt = this.ticket.masterInfo.t_tien_nt2 + this.ticket.masterInfo.t_thue_nt;
        this.ticket.masterInfo.t_tt_nt = this.ticket.masterInfo.t_tt_nt;
        this.ticket.masterInfo.t_con_no = this.ticket.masterInfo.t_tt_nt - this.ticket.masterInfo.t_da_tra;
        this.ticket.masterInfo.t_con_no = this.ticket.masterInfo.t_con_no;

        this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);
    }

    // validate ticket before create or update
    validateTicket(ticket: ServiceRepurchaseServiceTicket): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ngay_ct) {
            message = this.commonService.getMessage('lbl_invalid_ngay_ct');
        } else if (!ticket.masterInfo.ma_kh && !ticket.masterInfo.ten_kh) {
            message = this.commonService.getMessage('lbl_invalid_ma_kh');
        } else if (this.validatePayment(ticket.payment)) {
            message = this.commonService.getMessage('lbl_invalid_payment');
        } else if (this.ticket.masterInfo.t_con_no < 0) {
            message = this.commonService.getMessage('lbl_invalid_t_con_no');
        } else if (ticket.masterInfo.t_tt_nt < 0) {
            message = this.commonService.getMessage('lbl_invalid_tt');
        } else if (ticket.masterInfo.t_tien_nt2 < 0) {
            message = this.commonService.getMessage('lbl_invalid_t_tien');
        } else if (ticket.masterInfo.t_da_tra < 0) {
            message = this.commonService.getMessage('lbl_invalid_t_da_tra');
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
}