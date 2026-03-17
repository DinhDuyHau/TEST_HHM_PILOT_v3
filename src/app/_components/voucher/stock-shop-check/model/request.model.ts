import { BaseMasterInfoRequest, BaseMerchandiseRequest } from "@app/sales-management/model/ticket/common-model/base-entity.model";


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
    so_luong_tt = 0;
    ma_imei_tt = '';
    nguon_kk = '0';
    kq_kk = '1';

    fnote2 = '';
    ngay_lct = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}


export class MasterInfoRequest extends BaseMasterInfoRequest {
    ma_nvvc = '';
    t_ck = 0;
    t_ck_nt = 0;
    t_da_tra = 0;
    t_con_no = 0;
    tien_dat_coc = 0;
    email_nhan_key = '';
    dien_giai = '';

    ma_kho = '';
    ten_kho = '';
    ma_gd = '';
    ten_gd = '';
    ma_nvkk01 = '';
    ten_nvkk01 = '';
    ma_nvkk02 = '';
    ten_nvkk02 = '';
    ma_nvkk03 = '';
    ten_nvkk03 = '';
    ma_vt = '';
    nh_vt1 = '';
    nh_vt2 = '';
    nh_vt3 = '';
    nh_vt4 = '';
    t_sl_thuc_te = 0;
    t_chenh_lech = 0;
    loai_gd_n = '';
    so_ct_pn = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}