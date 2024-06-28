

export class Imei {
    ma_imei = '';
    ma_kho?: string = '';
    ma_vt = '';
    ten_vt = '';
    ten_vt2 = '';
    dvt = '';
    gia_ban = 0;
    tien_nt2 = 0;
    ma_thue = '';
    ngay_nhap0 = '';
    ngay_nhap2 = '';
    so_luong = 0;
    thanh_tien = 0;
    thanh_toan = 0;
    thue_suat = 0;
    tien_thue = 0;
    hang_chiet_khau = false;
    nh_vt = '';
    status = '';
    datetime0 = '';
    datetime2 = '';
    user_id0 = 0;
    user_id2 = 0;
    xuat_yn = false;
    dat_hang_yn = false;
    dieu_chuyen_yn = false;
    bao_hanh_yn = false;
    ma_vt2 = '';

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
