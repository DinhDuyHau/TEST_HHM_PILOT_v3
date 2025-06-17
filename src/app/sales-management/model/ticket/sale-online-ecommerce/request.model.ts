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

    phi_san_01 = 0;
    phi_san_02 = 0;
    phi_san_03 = 0;
    phi_san_04 = 0;
    phi_san_05 = 0;
    phi_san_06 = 0;
    phi_san_07 = 0;
    phi_san_08 = 0;
    phi_san_09 = 0;
    phi_san_10 = 0;
    phi_san_hhm = 0;
    phi_dc_khac = 0;

    tong_phi = 0;
    gia_vat = 0;
    gia_tmdt = 0;
    gia_tmdt_vat = 0;


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
    email_nhan_key = '';
    t_phi_san = 0;

    tien_phi_01 = 0;
    tien_phi_02 = 0;
    tien_phi_03 = 0;
    tien_phi_04 = 0;
    tien_phi_05 = 0;
    tien_phi_06 = 0;
    tien_phi_07 = 0;
    tien_phi_08 = 0;
    tien_phi_09 = 0;
    tien_phi_10 = 0;
    phi_hoang_ha = 0;
    tong_phi = 0;
    fnote3 = ''; // xác định có lập hddt ko
    fnote2 = ''; // đối tượng hóa đơn điện tử
    hd_nguoi_mua = '';
    hd_loai_giay_to = '';
    hd_so_giay_to = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
