import { BaseEntity, BaseMasterInfoRequest, BaseMerchandiseRequest } from '../common-model/base-entity.model';

export class MerchandiseRequest extends BaseMerchandiseRequest {
    gia_ck = 0;
    gia_ck_nt = 0;
    ck = 0;
    ck_nt = 0;
    km_yn = false;
    no_km_yn = false;
    tien_kmqd = 0;
    imei_mua = '';
    gia_vat = 0;
    gc_td1 = '';
    ma_gd_tcdm = '';
    tien_ht = 0;
    gia_bl = 0;
    gia_bl_vat = 0;
    s4 = 0;
    ma_td3 = '';
    //ma_td2 dùng để lưu mã khai báo
    ma_td2 = '';
    tl_ck09 = 0; // tỉ lệ ck 09
    tien_kb09 = 0; // tiền ck 09
    tien_max09 = 0; // tiền max ck 09
    tien_ck09 = 0; // tiền ck được hưởng 09

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class MerchandiseUsedRequest extends BaseMerchandiseRequest {
    ma_loai = '';
    gia = 0;
    gia_nt = 0;
    tien = 0;
    tien_nt = 0;
    new_imei_yn = false;
    gia0 = 0;
    gc_td1 = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class MasterInfoRequest extends BaseMasterInfoRequest {
    dien_giai = '';
    t_ck = 0;
    t_ck_nt = 0;
    t_da_tra = 0;
    t_con_no = 0;
    tien_dat_coc = 0;
    ma_nvvc = '';
    t_tien_ban = 0;

    //Thu cũ
    t_sl_thu_cu = 0;
    t_tc_tien_nt2 = 0;
    t_tien_thu_cu = 0;
    t_tien_thu_cu_nt = 0;

    email_nhan_key = '';
    ma_ncc = '';
    ma_hang = '';
    tl_tich_diem = 0;
    fnote3 = ''; // xác định có lập hddt ko
    fnote2 = ''; // đối tượng hóa đơn điện tử

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
