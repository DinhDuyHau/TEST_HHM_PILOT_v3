import { BaseEntity } from './base-entity.model';

export const PAYMENT_CODE = {
    CASH: 'TM',
    ATM: 'ATM',
    TRANSFER: 'CHUYENKHOAN',
    VNPAY: 'VNPAY',
    EWALLET: 'VIDT',
    INSTALLMENT: 'TRAGOP',
    DEPOSIT: 'TIENCOC',
    CONVERSION: 'DIEMQD',
    DISCOUNTCODE: 'MAGG',
    DISCOUNTPROGRAMCRM: 'CRM',
    CARDINSTALLMENT: 'QTTG',
    VOUCHERPARNER: 'VOUCHERDOITAC',
};

export const PAYMENT_NAME = {
    CASH: 'Tiền mặt',
    ATM: 'Thẻ ATM',
    TRANSFER: 'Chuyển khoản',
    VNPAY: 'VNPAY',
    EWALLET: 'Ví điện tử',
    INSTALLMENT: 'Trả góp',
    DEPOSIT: 'Tiền đặt cọc',
    CONVERSION: 'Điểm quy đổi',
    DISCOUNTCODE: 'Mã giảm giá',
    DISCOUNTPROGRAMCRM: 'Mã giảm giá của hãng',
    CARDINSTALLMENT: 'Quẹt thẻ trả góp',
    VOUCHERPARNER: 'Voucher của đối tác',
};


export class PaymentRequest extends BaseEntity {
    ma_thanhtoan = '';
    ten_thanhtoan = '';
    ma_nvbh_i = '';
    tien = 0;
    tien_nt = 0;
    so_the_nh = '';
    ma_chuan_chi = '';
    ma_may_pos = '';
    tk_nh_nhan = '';
    so_hd_vnpay = '';
    vi_dien_tu = '';
    so_hd_tragop = '';
    tien_phi_bh = 0;
    ma_dv_tragop = '';
    diem_qd = 0;
    ma_gg = '';
    ma_ctr = '';
    line_nbr = 0;
    ten_nguoi_nhan = '';
    ten_ngan_hang = '';
    stt_rec_pt = '';
    ma_sp = '';
    ma_imei = '';
    ten_vt = '';
    ten_ctr = '';

    phi_quetthe = 0;
    phi_chuyendoi = 0;
    phi_cd_tragop = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class Payment {
    tien_dat_coc: Deposit = new Deposit;
    tien_mat: Cash = new Cash;
    quet_the: Card = new Card;
    chuyen_khoan: Transfer = new Transfer;
    vnpay: VNPay = new VNPay;
    vi_dien_tu: EWallet = new EWallet;
    tra_gop: Installment = new Installment;
    sd_diem: Conversion = new Conversion;
    ma_giam_gia: DiscountCode = new DiscountCode;
    giam_gia_crm: DiscountCodeCRM = new DiscountCodeCRM;
    quet_the_tra_gop: InstallmentCard = new InstallmentCard;
    voucher_doi_tac: VoucherParner = new VoucherParner;
}


export class BaseModelPayment {
    tien = 0;
    tien_nt2 = 0;
    selected = false;
}

export class Deposit extends BaseModelPayment {
    detail: DepositDetail[] = [];
}
export class DepositDetail extends BaseModelPayment {
    stt_rec_pt = '';
    ma_sp = '';
    ma_ctr = '';
}
export class Cash extends BaseModelPayment {
}

export class Card extends BaseModelPayment {
    detail: CardDetail[] = [];
}

export class InstallmentCard extends BaseModelPayment {
    so_the = '';
    ma_chuan_chi = '';
    ma_may_pos = '';
    so_hd_tragop = '';
    ma_dv_tragop = '';
    phi_bao_hiem = 0;
    phi_quetthe = 0;
    phi_chuyendoi = 0;
    tk_nh_nhan = '';
    so_hd_vnpay = '';
}

export class Transfer extends BaseModelPayment {
    detail: TransferDetail[] = [];
}

export class VNPay extends BaseModelPayment {
    // so_hd_vnpay = '';
    detail: VNPayDetail[] = [];
}

export class EWallet extends BaseModelPayment {
    detail: EWalletDetail[] = [];
}

export class Installment extends BaseModelPayment {
    so_hd_tragop = '';
    phi_bao_hiem = 0;
    ma_dv_tragop = '';
    phi_cd_tragop = 0;
    tk_nh_nhan = '';
}


export class Conversion extends BaseModelPayment {
    diem_qd = 0;
}

export class DiscountCode extends BaseModelPayment {
    ma_gg = '';
}

export class VoucherParner extends BaseModelPayment {
    ma_gg = '';
    ma_ctr = '';
    ma_chuan_chi = '';
}

export class DiscountCodeCRM extends BaseModelPayment {
    detail: DiscountCodeCRMDetail[] = [];
}
export class DiscountCodeCRMDetail {
    ma_gg = '';
    ma_ctr = '';
    ma_vt = '';
    ma_imei = '';
    tien_giam = 0;
    ten_vt = '';
    ten_ctr = '';
}
export class CardDetail extends BaseModelPayment {
    so_the = '';
    ma_chuan_chi = '';
    ma_may_pos = '';
    tk_nh_nhan = '';
}
export class TransferDetail extends BaseModelPayment {
    tk_nh_nhan = '';
    ten_nguoi_nhan = '';
    ten_ngan_hang = '';
}
export class EWalletDetail extends BaseModelPayment {
    thong_tin = '';
    so_hd_vnpay = '';
}

export class VNPayDetail extends BaseModelPayment {
    so_hd_vnpay = '';
}