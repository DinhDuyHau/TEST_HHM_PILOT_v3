import { BaseEntity } from "./base-entity.model";

export class VoucherCodeRequest extends BaseEntity {
    ma_ck = '';
    ma_voucher = '';
    ma_nvbh_i = '';
    ma_imei = '';
    ma_vt = '';
    ma_vt_tang = '';
    sl_tang = 0 ;
    sl_vt_tt = 0;
    tl_ck = 0;
    tien_ck = 0;
    tien_ck_nt = 0;
    tien_qd = 0;
    imei_hang_mua = '';
    ma_vt_tt = '';
    line_nbr = 0;
    ma_td1 = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class VoucherCode {
    ma_voucher = '';
    ma_ck = '';
    tien_qd = 0;
    tien_ck = 0;
    tien_ck_nt = 0;
    line_nbr = 0;
    ma_vt = '';
    ma_vt_tang = '';
    sl_tang = 0;
    sl_vt_tt = 0;
    ma_vt_tt = '';
    ma_dv = '';
    type = 0;
    ma_imei = '';
    imei_hang_mua = '';
    details: any;
    ma_td1 = '';

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
