import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Discount } from '@app/sales-management/model/ticket/common-model/discount.model';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, ReturnServiceSaleTicketCreate, Service, TAB_NAME } from '@app/sales-management/model/ticket/sale-return-service/model';
import { CommonService } from '../common/common.service';
import { MasterInfoRequest, ServiceRequest } from '@app/sales-management/model/ticket/sale-return-service/request.model';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { ServiceOfMerchandiseService } from '../common/service.service';

@Injectable({
    providedIn: 'root'
})
export class SaleReturnServiceService {
    discountOptions: Discount[] = [];
    isNeedCalcDiscount = true;
    ticket!: ReturnServiceSaleTicketCreate;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private commonService: CommonService,
        private serviceOfMerchandiseService: ServiceOfMerchandiseService,
    ) {

    }

    //#region setter
    setTicket(ticket: ReturnServiceSaleTicketCreate) {
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
                    this.convertFromVoucher(e.data, this.ticket.service);
                    break;
                case TAB_NAME.ELECTRONIC_BILL:
                    this.ticket.electronic_bill = this.commonService.convertDateOfModelFromVoucher(e.data[0]);
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
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.SERVICE, data: this.convertVoucher(voucherDto.masterInfo) }];
        voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.ELECTRONIC_BILL, data: [this.commonService.convertDateOfModelToRequest(this.ticket.electronic_bill, voucherDto.masterInfo)] }];


        return voucherDto;
    }
    convertFromVoucher(src: any[], des: any[]) {
        const rs = src.map((e: any, i: number) => {
            const serviceNew = new Service();
            Object.keys(serviceNew).map((key: string) => {
                if (e.hasOwnProperty(key)) {
                    (serviceNew as any)[key] = e[key];
                }
            });
            serviceNew.thanh_tien = e.tien2;
            serviceNew.tien_thue = e.thue;
            serviceNew.tong_tien = e.tt;
            serviceNew.key = e.stt_rec_hd1 + e.stt_rec0hd1;
            serviceNew.line_nbr = i;
            return serviceNew;
        });
        rs.map((e, i) => { e.line_nbr = i; });
        des.push(...rs);
    }
    convertVoucher(masterInfo: any) {
        const res: ServiceRequest[] = [];
        this.ticket.service.forEach((item, index) => {
            const returnService = new ServiceRequest();
            returnService.stt_rec_hd1 = item.stt_rec_hd1;
            returnService.stt_rec0hd1 = item.stt_rec0hd1;
            returnService.ma_dv = item.ma_dv;
            returnService.ten_dv = item.ten_dv;
            returnService.dvt = item.dvt;
            returnService.he_so = item.he_so;
            returnService.so_luong = item.so_luong;
            returnService.gia = item.gia_tra_lai;
            returnService.gia_nt = item.gia_tra_lai;
            returnService.tien2 = item.thanh_tien;
            returnService.tien_nt2 = item.thanh_tien;
            returnService.ma_thue = item.ma_thue;
            returnService.thue_suat = item.thue_suat;
            returnService.thue = item.tien_thue;
            returnService.thue_nt = item.tien_thue;
            returnService.tt = item.tong_tien;
            returnService.tt_nt = item.tong_tien;
            returnService.line_nbr = index + 1;
            returnService.gia_ban = item.gia_ban;
            returnService.gia_tra_lai = item.gia_tra_lai;
            returnService.stt_rec = masterInfo.stt_rec;
            returnService.stt_rec0 = '';
            returnService.ma_ct = masterInfo.ma_ct;
            returnService.ngay_ct = masterInfo.ngay_ct;
            returnService.so_ct = masterInfo.so_ct;
            returnService.ma_cuahang = masterInfo.ma_cuahang;
            returnService.ma_ca = masterInfo.ma_ca;
            returnService.ma_dvcs = masterInfo.ma_dvcs;
            returnService.vt_ton_kho = item.vt_ton_kho;
            returnService.gia2 = item.gia2;
            returnService.gia_nt2 = item.gia_nt2;
            returnService.ngay_ct_hd1 = item.ngay_ct_hd1;
            returnService.so_ct_hd1 = item.so_ct_hd1;
            res.push(returnService);
        });
        return res;
    }

    initTicket(ticket: ReturnServiceSaleTicketCreate) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);

        ticket.masterInfo.ma_ct = TICKET_CODE.RETURN_SERVICE;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.RETURN_SERVICE).subscribe(result => {
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
    }

    resetCustomerInfo(ticket: ReturnServiceSaleTicketCreate) {
        ticket.masterInfo.ten_kh = '';
        ticket.masterInfo.dia_chi = '';
    }

    //#endregion customer

    // Lấy thông tin đơn hàng (ticket) đã bán ra
    getDataByOrderNumber(order: string) {
        const params = {
            so_ct: order,
            ma_cuahang: this.ticket.masterInfo.ma_cuahang
        };
        return this.ticketApiService.getSoldServiceOrder(params);
    }

    getDataByCustomer(ma_kh: string) {
        const params = {
            ma_kh: ma_kh,
            ma_cuahang: this.ticket.masterInfo.ma_cuahang
        };
        return this.ticketApiService.getSoldServiceOrders(params);
    }

    //#region other
    calcMoney() {
        // số lượng
        this.ticket.masterInfo.t_so_luong = this.ticket.service.length;
        // tiền thuế
        const serviceTax = this.ticket.service.map(e => e.thue).reduce((pre, cur) => pre + cur, 0);
        this.ticket.masterInfo.t_thue_nt = Math.round(serviceTax);
        // thành tiền
        this.ticket.masterInfo.t_tien_nt2 = Math.round(this.ticket.service.map(e => e.thanh_tien).reduce((pre, cur) => pre + cur, 0));
        // tổng thanh toán
        this.ticket.masterInfo.t_tt_nt = this.ticket.masterInfo.t_tien_nt2 + this.ticket.masterInfo.t_thue_nt;
        // điểm quy đổi
        this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);
    }

    // validate ticket before create or update
    validateTicket(ticket: ReturnServiceSaleTicketCreate): string {
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
        }
        return message;
    }

    // #endregion other

}
