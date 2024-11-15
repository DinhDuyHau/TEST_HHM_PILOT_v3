import { BaseEntity } from './base-entity.model';

export class Service {
    ma_dv = '';
    ten_dv = '';
    dvt = '';
    he_so = 0;
    ma_kho = '';
    ma_thue = '';
    vt_ton_kho = '';
    so_luong = 1;
    gia_ck = 0;
    tien_ck = 0;
    gia_ban = 0;
    gia_ban_nt = 0;
    gia_ban0 = 0;
    gia_ban_nt0 = 0;
    thanh_tien = 0;
    thue_suat = 0;
    tien_thue = 0;
    tong_tien = 0;
    ma_imei = '';
    km_yn = false;
    tien_kmqd = 0;
    line_nbr = 0;
    ad_key = false;
    gia_vat = 0;
    gia2 = 0;
    gia_nt2 = 0;
    tien2 = 0;
    tien_nt2 = 0;
    tt = 0;
    tt_nt = 0;
    thue = 0;
    thue_nt = 0;

    //sale return
    tien_giam = 0;
    gia_tra_lai = 0;
    ck_nt = 0;
    ti_le_giam = 0;
    //ma_td1 dùng để lưu lý do sửa giá
    ma_td1 = '';
    noi_dung = '';

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}

export class ServiceRequest extends BaseEntity {
    ma_dv = '';
    ten_dv = '';
    dvt = '';
    he_so = 0;
    so_luong = 0;
    ma_kho = '';
    vt_ton_kho = '';
    gia = 0;
    gia_nt = 0;
    gia2 = 0;
    gia_nt2 = 0;
    tien2 = 0;
    tien_nt2 = 0;
    ma_thue = '';
    thue_suat = 0;
    thue = 0;
    thue_nt = 0;
    tt = 0;
    tt_nt = 0;
    ma_imei = '';
    tien_kmqd = 0;
    line_nbr = 0;
    gia_vat = 0;
    tien_giam = 0;
    gia_tra_lai = 0;
    gia_ban = 0;
    gia_ban_nt = 0;
    gia_ban0 = 0;
    gia_ban_nt0 = 0;

    //sale return 
    ck_nt = 0;
    ti_le_giam = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}