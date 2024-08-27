import { Injectable } from '@angular/core';
import { CardDetail, DepositDetail, DiscountCodeCRMDetail, EWalletDetail, PAYMENT_CODE, PAYMENT_NAME, Payment, TransferDetail, VNPayDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { PaymentRequest } from '@app/sales-management/model/ticket/common-model/payment.model';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(private commonService: CommonService) { }
    comparePaymenCode(val1: string, val2: string) {
        return val1.replace(/\s+/g, '') === val2.replace(/\s+/g, '');
    }

    convertPaymentFromVoucher = (src: PaymentRequest[], des: Payment) => {
        let depositDetail = new DepositDetail;
        let discountCodeCRMDetail = new DiscountCodeCRMDetail;
        let cardDetail = new CardDetail;
        let eWalletDetail = new EWalletDetail;
        let vnpayDetail = new VNPayDetail;
        let transferDetail = new TransferDetail;
        src.forEach(e => {
            const ma_thanhtoan = e.ma_thanhtoan.replace(/\s+/g, '');
            switch (ma_thanhtoan) {
                case PAYMENT_CODE.DEPOSIT:
                    des.tien_dat_coc.tien += e.tien;
                    des.tien_dat_coc.selected = true;
                    depositDetail = new DepositDetail;
                    depositDetail.stt_rec_pt = e.stt_rec_pt;
                    depositDetail.ma_sp = e.ma_sp;
                    depositDetail.tien = e.tien;
                    depositDetail.tien_nt2 = e.tien_nt;
                    depositDetail.ma_ctr = e.ma_ctr;
                    depositDetail.selected = true;
                    des.tien_dat_coc.detail.push(depositDetail);
                    break;
                case PAYMENT_CODE.CASH:
                    des.tien_mat.tien = e.tien;
                    des.tien_mat.selected = true;
                    break;
                case PAYMENT_CODE.ATM:
                    des.quet_the.tien += e.tien;
                    cardDetail = new CardDetail;
                    cardDetail.so_the = e.so_the_nh;
                    cardDetail.ma_chuan_chi = e.ma_chuan_chi;
                    cardDetail.ma_may_pos = e.ma_may_pos;
                    cardDetail.tien = e.tien;
                    cardDetail.tk_nh_nhan = e.tk_nh_nhan;
                    des.quet_the.detail.push(cardDetail);
                    des.quet_the.selected = true;

                    break;
                case PAYMENT_CODE.TRANSFER:
                    des.chuyen_khoan.tien += e.tien;
                    transferDetail = new TransferDetail;
                    transferDetail.tk_nh_nhan = e.tk_nh_nhan;
                    transferDetail.ten_ngan_hang = e.ten_ngan_hang;
                    transferDetail.ten_nguoi_nhan = e.ten_nguoi_nhan;
                    transferDetail.tien = e.tien;
                    des.chuyen_khoan.detail.push(transferDetail);
                    des.chuyen_khoan.selected = true;
                    break;
                case PAYMENT_CODE.VNPAY:
                    des.vnpay.tien += e.tien;
                    vnpayDetail = new VNPayDetail;
                    vnpayDetail.so_hd_vnpay = e.so_hd_vnpay;
                    vnpayDetail.tien = e.tien;
                    des.vnpay.detail.push(vnpayDetail);
                    des.vnpay.selected = true;
                    break;
                case PAYMENT_CODE.EWALLET:
                    des.vi_dien_tu.tien += e.tien;
                    eWalletDetail = new EWalletDetail;
                    eWalletDetail.thong_tin = e.vi_dien_tu;
                    eWalletDetail.so_hd_vnpay = e.so_hd_vnpay;
                    eWalletDetail.tien = e.tien;
                    des.vi_dien_tu.detail.push(eWalletDetail);
                    des.vi_dien_tu.selected = true;
                    break;
                case PAYMENT_CODE.INSTALLMENT:
                    des.tra_gop.tien = e.tien;
                    des.tra_gop.so_hd_tragop = e.so_hd_tragop;
                    des.tra_gop.phi_bao_hiem = e.tien_phi_bh;
                    des.tra_gop.ma_dv_tragop = e.ma_dv_tragop;
                    des.tra_gop.phi_cd_tragop = e.phi_cd_tragop;
                    des.tra_gop.selected = true;
                    break;
                case PAYMENT_CODE.CONVERSION:
                    des.sd_diem.tien = e.tien;
                    des.sd_diem.diem_qd = e.diem_qd;
                    des.sd_diem.selected = true;
                    break;
                case PAYMENT_CODE.DISCOUNTCODE:
                    des.ma_giam_gia.tien = e.tien;
                    des.ma_giam_gia.ma_gg = e.ma_gg;
                    des.ma_giam_gia.selected = true;
                    break;
                case PAYMENT_CODE.DISCOUNTPROGRAMCRM:
                    des.giam_gia_crm.tien += e.tien;
                    des.giam_gia_crm.selected = true;
                    discountCodeCRMDetail = new DiscountCodeCRMDetail;
                    discountCodeCRMDetail.ma_ctr = e.ma_ctr;
                    discountCodeCRMDetail.ma_vt = e.ma_sp;
                    discountCodeCRMDetail.ten_vt = e.ten_vt;
                    discountCodeCRMDetail.ten_ctr = e.ten_ctr;
                    discountCodeCRMDetail.tien_giam = e.tien;
                    discountCodeCRMDetail.ma_imei = e.ma_imei;
                    discountCodeCRMDetail.ma_gg = e.ma_gg;
                    des.giam_gia_crm.detail.push(discountCodeCRMDetail);
                    break;
                case PAYMENT_CODE.CARDINSTALLMENT:
                    des.quet_the_tra_gop.tien = e.tien;
                    des.quet_the_tra_gop.so_hd_tragop = e.so_hd_tragop;
                    des.quet_the_tra_gop.phi_bao_hiem = e.tien_phi_bh;
                    des.quet_the_tra_gop.ma_dv_tragop = e.ma_dv_tragop;
                    des.quet_the_tra_gop.phi_chuyendoi = e.phi_chuyendoi;
                    des.quet_the_tra_gop.phi_quetthe = e.phi_quetthe;
                    des.quet_the_tra_gop.ma_may_pos = e.ma_may_pos;
                    des.quet_the_tra_gop.ma_chuan_chi = e.ma_chuan_chi;
                    des.quet_the_tra_gop.so_the = e.so_the_nh;
                    des.quet_the_tra_gop.tk_nh_nhan = e.tk_nh_nhan;
                    // des.quet_the_tra_gop.so_hd_vnpay = e.so_hd_vnpay;
                    des.quet_the_tra_gop.selected = true;
                    break;
                case PAYMENT_CODE.VOUCHERPARNER:
                    des.voucher_doi_tac.tien = e.tien;
                    des.voucher_doi_tac.ma_ctr = e.ma_ctr;
                    des.voucher_doi_tac.ma_gg = e.ma_gg;
                    des.voucher_doi_tac.ma_chuan_chi = e.ma_chuan_chi;
                    des.voucher_doi_tac.selected = true;
                    break;
                default:
                    break;
            }
        });
    };

    convertPaymentRequest = (src: Payment) => {
        let des: PaymentRequest[] = [];
        if (src.tien_dat_coc.selected) {
            src.tien_dat_coc.detail.forEach(element => {
                //
                des = [
                    ...des,
                    new PaymentRequest({
                        ma_thanhtoan: PAYMENT_CODE.DEPOSIT,
                        ten_thanhtoan: PAYMENT_NAME.DEPOSIT,
                        tien: element.tien,
                        tien_nt: element.tien_nt2 || 0,
                        stt_rec_pt: element.stt_rec_pt,
                        ma_sp: element.ma_sp,
                        ma_ctr: element.ma_ctr,
                    }),
                ];
            });
        }
        if (src.tien_mat.selected) {
            des = [
                ...des,
                new PaymentRequest({
                    ma_thanhtoan: PAYMENT_CODE.CASH,
                    ten_thanhtoan: PAYMENT_NAME.CASH,
                    tien: src.tien_mat.tien,
                    tien_nt: src.tien_mat.tien_nt2 || 0
                }),
            ];
        }
        if (src.chuyen_khoan.selected) {
            src.chuyen_khoan.detail.forEach(element => {
                //
                des = [
                    ...des,
                    new PaymentRequest({
                        ma_thanhtoan: PAYMENT_CODE.TRANSFER,
                        ten_thanhtoan: PAYMENT_NAME.TRANSFER,
                        tien: element.tien,
                        tien_nt: element.tien_nt2,
                        tk_nh_nhan: element.tk_nh_nhan,
                        ten_nguoi_nhan: element.ten_nguoi_nhan,
                        ten_ngan_hang: element.ten_ngan_hang,
                    }),
                ];
            });
        }
        if (src.quet_the.selected) {
            src.quet_the.detail.forEach(element => {
                //
                des = [
                    ...des,
                    new PaymentRequest({
                        ma_thanhtoan: PAYMENT_CODE.ATM,
                        ten_thanhtoan: PAYMENT_NAME.ATM,
                        tien: element.tien,
                        tien_nt: element.tien_nt2,
                        so_the_nh: element.so_the,
                        ma_chuan_chi: element.ma_chuan_chi,
                        ma_may_pos: element.ma_may_pos,
                        tk_nh_nhan: element.tk_nh_nhan
                    }),
                ];
            });
        }
        if (src.quet_the_tra_gop.selected) {
            des = [
                ...des,
                new PaymentRequest({
                    ma_thanhtoan: PAYMENT_CODE.CARDINSTALLMENT,
                    ten_thanhtoan: PAYMENT_NAME.CARDINSTALLMENT,
                    tien: src.quet_the_tra_gop.tien,
                    tien_nt: src.quet_the_tra_gop.tien_nt2,
                    so_hd_tragop: src.quet_the_tra_gop.so_hd_tragop,
                    ma_dv_tragop: src.quet_the_tra_gop.ma_dv_tragop,
                    tien_phi_bh: src.quet_the_tra_gop.phi_bao_hiem,
                    phi_chuyendoi: src.quet_the_tra_gop.phi_chuyendoi,
                    phi_quetthe: src.quet_the_tra_gop.phi_quetthe,
                    ma_may_pos: src.quet_the_tra_gop.ma_may_pos,
                    so_the_nh: src.quet_the_tra_gop.so_the,
                    ma_chuan_chi: src.quet_the_tra_gop.ma_chuan_chi,
                    tk_nh_nhan: src.quet_the_tra_gop.tk_nh_nhan,
                    so_hd_vnpay: src.quet_the_tra_gop.so_hd_vnpay
                })
            ];
        }
        if (src.vnpay.selected) {
            src.vnpay.detail.forEach(element => {
                //
                des = [
                    ...des,
                    new PaymentRequest({
                        ma_thanhtoan: PAYMENT_CODE.VNPAY,
                        ten_thanhtoan: PAYMENT_NAME.VNPAY,
                        tien: element.tien,
                        tien_nt: element.tien_nt2,
                        so_hd_vnpay: element.so_hd_vnpay,
                    }),
                ];
            });
        }
        if (src.vi_dien_tu.selected) {
            src.vi_dien_tu.detail.forEach(element => {
                //
                des = [
                    ...des,
                    new PaymentRequest({
                        ma_thanhtoan: PAYMENT_CODE.EWALLET,
                        ten_thanhtoan: PAYMENT_NAME.EWALLET,
                        tien: element.tien,
                        tien_nt: element.tien_nt2,
                        vi_dien_tu: element.thong_tin,
                        so_hd_vnpay: element.so_hd_vnpay,
                    }),
                ];
            });
        }
        if (src.tra_gop.selected) {
            des = [
                ...des,
                new PaymentRequest({
                    ma_thanhtoan: PAYMENT_CODE.INSTALLMENT,
                    ten_thanhtoan: PAYMENT_NAME.INSTALLMENT,
                    tien: src.tra_gop.tien,
                    tien_nt: src.tra_gop.tien_nt2,
                    so_hd_tragop: src.tra_gop.so_hd_tragop,
                    ma_dv_tragop: src.tra_gop.ma_dv_tragop,
                    tien_phi_bh: src.tra_gop.phi_bao_hiem,
                    phi_cd_tragop: src.tra_gop.phi_cd_tragop
                })
            ];
        }
        if (src.sd_diem.selected) {
            des = [
                ...des,
                new PaymentRequest({
                    ma_thanhtoan: PAYMENT_CODE.CONVERSION,
                    ten_thanhtoan: PAYMENT_NAME.CONVERSION,
                    tien: src.sd_diem.tien,
                    tien_nt: src.sd_diem.tien_nt2,
                    diem_qd: src.sd_diem.diem_qd
                })
            ];
        }
        if (src.ma_giam_gia.ma_gg) {
            des = [
                ...des,
                new PaymentRequest({
                    ma_thanhtoan: PAYMENT_CODE.DISCOUNTCODE,
                    ten_thanhtoan: PAYMENT_NAME.DISCOUNTCODE,
                    tien: src.ma_giam_gia.tien,
                    tien_nt: src.ma_giam_gia.tien_nt2,
                    ma_gg: src.ma_giam_gia.ma_gg
                })
            ];
        }
        if (src.giam_gia_crm.selected) {
            src.giam_gia_crm.detail.forEach(element => {
                //
                des = [
                    ...des,
                    new PaymentRequest({
                        ma_thanhtoan: PAYMENT_CODE.DISCOUNTPROGRAMCRM,
                        ten_thanhtoan: PAYMENT_NAME.DISCOUNTPROGRAMCRM,
                        tien: element.tien_giam,
                        tien_nt: element.tien_giam || 0,
                        ma_sp: element.ma_vt,
                        ma_ctr: element.ma_ctr,
                        ma_gg: element.ma_gg,
                        ma_imei: element.ma_imei,
                    }),
                ];
            });
        }
        if (src.voucher_doi_tac.ma_gg) {
            des = [
                ...des,
                new PaymentRequest({
                    ma_thanhtoan: PAYMENT_CODE.VOUCHERPARNER,
                    ten_thanhtoan: PAYMENT_NAME.VOUCHERPARNER,
                    tien: src.voucher_doi_tac.tien,
                    tien_nt: src.voucher_doi_tac.tien_nt2,
                    ma_gg: src.voucher_doi_tac.ma_gg,
                    ma_ctr: src.voucher_doi_tac.ma_ctr,
                    ma_chuan_chi: src.voucher_doi_tac.ma_chuan_chi
                })
            ];
        }
        des.map(e => {
            e.tien_nt = e.tien;
        });
        return des;
    };

    convertPaymentToRequest = (payment: any, masterInfo: any) => {
        const result = this.convertPaymentRequest(payment);
        this.commonService.updateBaseInfo(masterInfo, result);
        return result;
    };
}