import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';
import { MerchandiseApiService } from '@app/sales-management/api/merchandise-api.service';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { Payment } from '@app/sales-management/model/ticket/common-model/payment.model';
import { TICKET_CODE, TICKET_ENTITY } from '@app/sales-management/model/common/ticket-code.model';
import { MasterInfo, Merchandise, WholeTicketCreate, TAB_NAME, ContractFile } from '@app/sales-management/model/ticket/whole/model';
import { CommonService } from '../common/common.service';
import { MerchandiseService } from '../common/merchandise.service';
import { PaymentService } from '../common/payment.service';
import { GuanranteeService } from '../common/guarantee.service';
import { MerchandiseRequest, MasterInfoRequest } from '@app/sales-management/model/ticket/whole/request.model';
import { TransportService } from '../common/transport.service';
import { Language } from '../common/language';
import { VoucherDto } from '@app/sales-management/model/ticket/common-model/voucher.dto.model';
import { UploadFileApiService } from '@app/sales-management/api/file.service';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { DialogIMEIComponent } from '@app/_components/dialog/dialog-imei/dialog-imei.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MODE } from '@app/sales-management/enum/ticket.enum';

@Injectable({
    providedIn: 'root'
})
export class SaleWholeService {
    ticket!: WholeTicketCreate;

    constructor(
        private customerApiService: CustomerApiService,
        private ticketApiService: TicketApiService,
        private uploadFileApiService: UploadFileApiService,
        private imeiApiService: ImeiApiService,
        private merchandiseApiService: MerchandiseApiService,
        private commonService: CommonService,
        private merchandiseService: MerchandiseService,
        private paymentService: PaymentService,
        private guanranteeService: GuanranteeService,
        private transportService: TransportService,
        private dialog: MatDialog
    ) {
    }

    //#region setter
    setTicket(ticket: WholeTicketCreate) {
        this.ticket = ticket;
    }

    //#endregion setter

    // #region init
    loadData(data: VoucherDto, mode: number = MODE.VIEW) {
        const sub_merchandise: Merchandise[] = [];
        this.ticket.masterInfo = this.commonService.convertMasterInfoFromVoucher(data.masterInfo, MasterInfo);
        this.customerApiService.getOneById(data.masterInfo.ma_kh).subscribe(result => {
            const customer = result.result as any;
            this.ticket.masterInfo.ten_kh = customer.ten_kh;
            this.ticket.masterInfo.dia_chi = customer.dia_chi;
        });

        data.details.forEach(e => {
            switch (e.name) {
                case TAB_NAME.MERCHANDISE:
                    this.merchandiseService.convertFromVoucher(e.data, sub_merchandise, Merchandise);
                    break;
                case TAB_NAME.PAYMENT:
                    this.paymentService.convertPaymentFromVoucher(e.data, this.ticket.payment);
                    break;
                case TAB_NAME.GUARANTEE:
                    this.ticket.guarantee = e.data;
                    break;
                case TAB_NAME.TRANSPORT:
                    this.ticket.contractInfo.so_ct_hd = e.data[0].so_ct_hd;
                    this.ticket.contractInfo.ngay_ct_hd = e.data[0].ngay_ct_hd;
                    this.ticket.contractInfo.stt_rec_hd = e.data[0].stt_rec_hd;
                    this.ticket.contractInfo.ma_co = e.data[0].ma_co;
                    this.ticket.contractInfo.ma_cq = e.data[0].ma_cq;
                    this.ticket.contractInfo.file_co = e.data[0].file_co;
                    this.ticket.contractInfo.file_cq = e.data[0].file_cq;
                    this.ticket.transport = this.transportService.convertFromVoucher(e.data[0]);
                    this.customerApiService.getOneById(this.ticket.transport.hhDelivery.ma_nv_giao).subscribe((result: any) => {
                        if (result && result.success && result.result) {
                            this.ticket.transport.hhDelivery.ten_nv = result.result.ten_kh;
                        }
                    });
                    break;
                default:
                    break;
            }
        });

        if (mode === MODE.CREATE) {
            this.loadDataFromContract(this.ticket.contractInfo.stt_rec_hd, sub_merchandise);
        }
        if (mode === MODE.UPDATE || mode === MODE.VIEW) {
            this.loadDataForUpdate(this.ticket.contractInfo.stt_rec_hd, sub_merchandise);
        }
    }

    loadDataFromContract(stt_rec_hd: string, sub_merchandise: Merchandise[]) {
        this.ticketApiService.getVoucherByid(TICKET_ENTITY.CONTRACT, stt_rec_hd).subscribe((data: any) => {
            if (data && data.success) {
                const merchandiseList = data.result.details[0];
                this.ticket.merchandise = merchandiseList.data.map((item: any) => {
                    const merchandiseItem = new Merchandise(item);

                    const merchandiseByContract = sub_merchandise.filter(mer => mer.ma_vt === merchandiseItem.ma_vt);

                    merchandiseItem.ma_imei = merchandiseByContract.map(mer => mer.ma_imei).join(', ');

                    merchandiseItem.so_luong_imei = merchandiseByContract.length;

                    merchandiseItem.thanh_tien = merchandiseByContract.reduce((pre, cur) => pre + cur.thanh_tien, 0);
                    merchandiseItem.tien_thue = merchandiseByContract.reduce((pre, cur) => pre + cur.tien_thue, 0);
                    merchandiseItem.thanh_toan = merchandiseByContract.reduce((pre, cur) => pre + cur.thanh_toan, 0);
                    return merchandiseItem;
                });
            }
        });
    }

    loadDataForUpdate(stt_rec_hd: string, sub_merchandise: Merchandise[]) {
        this.ticket.merchandise = sub_merchandise;
    }

    loadDataMerchandiseFromContract(data: any) {
        this.ticket.contractInfo.so_ct_hd = data.masterInfo.so_ct;
        this.customerApiService.getOneById(data.masterInfo.ma_kh).subscribe(result => {
            if (result.success && result.result) {
                const customer: any = result.result;
                this.ticket.masterInfo.ma_kh = customer.ma_kh;
                this.ticket.masterInfo.ten_kh = customer.ten_kh;
                this.ticket.masterInfo.dia_chi = customer.dia_chi;
            }
        });
        this.setContactInfo(data.masterInfo);

        data.details.forEach((e: any) => {
            switch (e.name) {
                case TAB_NAME.MERCHANDISE_FROM_CONTRACT:
                    this.merchandiseService.convertFromVoucher(e.data, this.ticket.merchandise, Merchandise);
                    break;
                default:
                    break;
            }
        });
    }

    setContactInfo(data: any) {
        this.ticket.contractInfo.so_ct_hd = data.so_ct;
        this.ticket.contractInfo.stt_rec_hd = data.stt_rec;
        this.ticket.contractInfo.ngay_ct_hd = data.ngay_ct;
    }

    // create or update
    prepareVoucher(): VoucherDto {
        const voucherDto: VoucherDto = new VoucherDto;
        voucherDto.details = [];
        voucherDto.masterInfo = this.commonService.convertMasterInfo(this.ticket.masterInfo, MasterInfoRequest);
        voucherDto.details = [...voucherDto.details, { id: 1, name: TAB_NAME.MERCHANDISE, data: this.merchandiseService.convertMerchandiseToRequest(this.handleConvertMerchandise(this.ticket.merchandise), voucherDto.masterInfo, MerchandiseRequest) }];
        voucherDto.details = [...voucherDto.details, { id: 2, name: TAB_NAME.PAYMENT, data: this.paymentService.convertPaymentToRequest(this.ticket.payment, voucherDto.masterInfo) }];
        voucherDto.details = [...voucherDto.details, { id: 3, name: TAB_NAME.GUARANTEE, data: this.guanranteeService.convertGuanranteeToRequest(this.ticket.guarantee, voucherDto.masterInfo) }];
        voucherDto.details = [...voucherDto.details, { id: 4, name: TAB_NAME.TRANSPORT, data: [{ ...this.transportService.convertToRequest(this.ticket.transport, voucherDto.masterInfo), ...this.ticket.contractInfo }] }];
        return voucherDto;
    }

    initTicket(ticket: WholeTicketCreate) {
        const userJson = localStorage.getItem('user');
        const userObj = userJson !== null && JSON.parse(userJson);

        ticket.masterInfo.ma_ct = TICKET_CODE.WHOLE;
        ticket.masterInfo.ma_cuahang = userObj['shop'];
        ticket.masterInfo.status = '0';
        ticket.masterInfo.ma_ca = userObj['shift'];
        ticket.masterInfo.ngay_ct = Date();
        ticket.masterInfo.ma_nvbh = userObj['username'];
        ticket.masterInfo.ma_dvcs = userObj['unit'];
        this.ticketApiService.getVoucherNumber(TICKET_ENTITY.WHOLE).subscribe(result => {
            ticket.masterInfo.so_ct = result.result as any;
        });
    }

    //#endregion init

    // file Contract
    handleUploadFileContract() {
        this.ticket.contractFile.ngay_ct = this.ticket.masterInfo.ngay_ct;
        this.ticket.contractFile.so_ct = this.ticket.masterInfo.so_ct;
        const file = this.commonService.convertFileFromObject(this.ticket.contractFile);
        return this.uploadFileApiService.uploadFileContract(file);
    }

    // #region merchandise
    //convert merchandise
    handleConvertMerchandise(merchandise_list: Merchandise[]) {
        return merchandise_list.map(merchandise => {
            if (merchandise.ma_imei) {
                const arr_imei = merchandise.ma_imei.split(', ');
                return arr_imei.map((imei: any) => {
                    const mer = { ...merchandise };
                    mer.ma_imei = imei;
                    mer.thanh_tien = mer.gia_ban;
                    mer.tien_thue = mer.thanh_tien * mer.thue_suat / 100;
                    mer.thanh_toan = mer.thanh_tien + mer.tien_thue;
                    return mer;
                });
            }
            return [];
        }).flat();
    }

    // #endregion merchandise

    //#region customer
    setInfoCustomer(ma_kh: string) {
        this.ticket.masterInfo.ma_kh = ma_kh;
        this.customerApiService.getOneById(ma_kh).subscribe(result => {
            if (result.success && result.result) {
                const customer: any = result.result;
                this.ticket.masterInfo.ma_kh = customer.ma_kh;
                this.ticket.masterInfo.ten_kh = customer.ten_kh;
                this.ticket.masterInfo.dia_chi = customer.dia_chi;
                this.ticket.contractInfo.ten_kh = this.ticket.masterInfo.ten_kh;
                this.ticket.contractInfo.dia_chi = this.ticket.masterInfo.dia_chi;

                //Thông tin khách hàng trên hóa đơn điện tử ==> Phần này sẽ phải call đến api lấy mã số thuế
                if (customer.ma_kh) {
                    this.handleChangeTaxCode(customer.ma_kh);
                }
                // this.ticket.masterInfo.hd_dia_chi = customer.hoadon_diachi || '';
                // this.ticket.masterInfo.hd_email = customer.hoadon_email || '';
                // this.ticket.masterInfo.hd_mst = customer.hoadon_mst || '';
                // this.ticket.masterInfo.hd_ten_kh = customer.hoadon_tenkh || '';

            } else {
                this.commonService.showMessageByContent(Language.content.exists_customer_yn_no, ma_kh);
            }
        });
    }

    handleChangeTaxCode(event: string) {
        this.commonService.getCustomerInfoByTax(event).subscribe((result: any) => {
            if (result.success) {
                this.ticket.masterInfo.hd_dia_chi = result.result.dia_chi || '';
                this.ticket.masterInfo.hd_email = result.result.email || '';
                this.ticket.masterInfo.hd_mst = event || '';
                this.ticket.masterInfo.hd_ten_kh = result.result.ten_kh || '';
            }
            else {
                this.commonService.showMessageByName(result.message);
            }
        });
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
        return this.imeiApiService.getImeiInStore(imei, this.ticket.masterInfo.ma_cuahang, TICKET_CODE.WHOLE);
    }

    getMerchandiseInfo(ma_vt: string) {
        return this.merchandiseApiService.getOneById(ma_vt);
    }
    getConversionPoint() {
        const ngay_ct = formatDate(this.ticket.masterInfo.ngay_ct, 'yyyy/MM/dd', 'en_US');
        const { ma_kh } = this.ticket.masterInfo;
        return this.customerApiService.getConversionPoint(ma_kh, ngay_ct);
    }
    // #endregion imei

    //#region other
    calcMoneyMerchandise(merchandise: Merchandise) {
        merchandise.so_luong_imei += 1;
        merchandise.thanh_tien = merchandise.gia_ban * merchandise.so_luong_imei;
        merchandise.tien_thue = merchandise.thanh_tien * merchandise.thue_suat / 100;
        merchandise.thanh_toan = merchandise.thanh_tien + merchandise.tien_thue;
    }

    calcMoney() {
        this.ticket.masterInfo.t_so_luong = this.ticket.merchandise.reduce((pre, cur) => pre + cur.so_luong_imei, 0);

        const merchandiseMoney = this.ticket.merchandise
            .map(e => { return { gia: e.gia_ban, soluong: e.so_luong_imei }; })
            .reduce((pre, cur) => pre + cur.gia * cur.soluong, 0);

        const merchandiseTax = this.ticket.merchandise
            .map(e => e.tien_thue)
            .reduce((pre, cur) => pre + cur, 0);

        this.ticket.masterInfo.t_tien_nt2 = merchandiseMoney;
        this.ticket.masterInfo.t_thue_nt = this.commonService.rouding(merchandiseTax);
        this.ticket.masterInfo.t_tt_nt = this.ticket.masterInfo.t_tien_nt2 + this.ticket.masterInfo.t_thue_nt;
        this.ticket.masterInfo.t_tt_nt = this.commonService.rouding(this.ticket.masterInfo.t_tt_nt);
        this.ticket.masterInfo.t_con_no = this.ticket.masterInfo.t_tt_nt - this.ticket.masterInfo.t_da_tra;
        this.ticket.masterInfo.t_con_no = this.commonService.rouding(this.ticket.masterInfo.t_con_no);

        this.ticket.masterInfo.diem_qd = this.commonService.calcPointRateExchange(this.ticket);
    }

    // validate ticket before create or update
    validateTicket(ticket: WholeTicketCreate): string {
        let message = '';
        if (!ticket.masterInfo.so_ct) {
            message = this.commonService.getMessage('lbl_invalid_so_ct');
        } else if (!ticket.masterInfo.ngay_ct) {
            message = this.commonService.getMessage('lbl_invalid_ngay_ct');
        } else if (!ticket.masterInfo.ma_dvcs) {
            message = this.commonService.getMessage('lbl_invalid_ma_dvcs');
        } else if (!ticket.merchandise.some(e => e.ma_imei)) {
            message = this.commonService.getMessage('lbl_invalid_ma_imei');
        } else if (this.validatePayment(ticket.payment)) {
            message = this.commonService.getMessage('lbl_invalid_payment');
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

    openDialogIMEI(data: any): Observable<any> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '800px';
        dialogConfig.height = '650px';
        //Xuất điều chuyển type = 2
        data.type = 2;
        dialogConfig.data = data;
        // dialogConfig.disableClose = true;
        const dialogRef = this.dialog.open(DialogIMEIComponent, dialogConfig);
        return dialogRef.afterClosed();
    }

    // #endregion other

}