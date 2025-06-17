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
    tl_ck09 = 0; // tỉ lệ ck 09
    tien_kb09 = 0; // tiền ck 09
    tien_max09 = 0; // tiền max ck 09
    tien_ck09 = 0; // tiền ck được hưởng 09

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}


export class MasterInfoRequest extends BaseMasterInfoRequest {
    ma_nvvc = '';
    ten_nvvc = '';
    t_ck = 0;
    t_ck_nt = 0;
    t_da_tra = 0;
    t_con_no = 0;
    tien_dat_coc = 0;
    email_nhan_key = '';
    dien_giai = '';

    ma_loaivc = '';
    so_dh_vc = '';
    ma_van_don = '';
    tien_phi_cod = 0;
    ghi_chu_gh = '';
    ma_hang = '';
    tl_tich_diem = 0;
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

export class TransportRequest extends BaseEntity {
    ma_loaivc = '';
    so_dh_vc = '';
    ma_van_don = '';
    tien_phi_cod = 0;
    ma_nvvc = '';
    ghi_chu_gh = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
