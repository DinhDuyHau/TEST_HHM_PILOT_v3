import { BaseEntity } from './base-entity.model';

export class DiscountRequest extends BaseEntity {
    ma_ck = '';
    ten_ck = '';
    ngay_bd = '';
    ngay_kt = '';
    tl_ck = 0;
    tien_ck = 0;
    tien_ck_nt = 0;
    ma_nvbh_i = '';
    gio_bd = '';
    gio_kt = '';
    loai_ck = '';
    ten_loai = '';
    ma_vt = '';
    ma_vt_tang = '';
    sl_tang = 0;
    sl_vt_tt = 0;
    ma_vt_tt = '';
    tien_qd = 0;
    ma_imei = '';
    line_nbr = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class Discount {
    ma_ck = '';
    ten_ck = '';
    ngay_bd = '';
    ngay_kt = '';
    gio_bd = '';
    gio_kt = '';
    loai_ck = '';
    ten_loai = '';
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
    details: any;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}

export class BaseDiscountDetail {
}

export class GiveMerchandiseDiscountDetail {
    ma_vt = '';
    so_luong = '';
    ma_vt_tang = '';
    sl_tang = 0;
    ma_vt_tt = '';
    ma_dv = '';
    sl_vt_tt = 0;
    tien_qd = 0;
    sd_vt_tang = true;
    no_km_yn = false;
    ma_imei = '';

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}

export class DiscountForCustomerDetail {
    ma_kh = '';
    ma_td1 = '';
    ma_td2 = '';
    ma_td3 = '';
    tien_ck = 0;
    tien_ck_tl = 0;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}

export class DiscountForTicketDetail {
    sl_tu = 0;
    sl_den = 0;
    ma_td1 = '';
    ma_td2 = '';
    ma_td3 = '';
    tien_ck = 0;
    tl_ck = 0;
    tien_ck_tl = 0;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}

export class DiscountForMerchandiseDetail extends BaseDiscountDetail {
    ma_vt = '';
    sl_tu = 0;
    sl_den = 0;
    ma_td1 = '';
    ma_td2 = '';
    ma_td3 = '';
    tien_ck = 0;
    tl_ck: any;
    tien_ck_tl = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}



export const DISCOUNT_TYPE = {
    REDUTION_BY_MERCHANDISE_CODE: '01',
    REDUTION_FOR_TICKET: '02',
    GIFT: '03',
    REDUTION_FOR_CUSTOMER: '04',
    CROSS_SELLING: '05',
    ACCESSORY_COMBO: '06',
    SERVICE_DISCOUNT: '08',
    DISCOUNT_CUSTOMER_RANK: '09'
};
