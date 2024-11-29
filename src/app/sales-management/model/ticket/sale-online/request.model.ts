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
    s4 = 0;
    s5 = 0;
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
    //Mã nhân viên telesale
    fcode1 = '';

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
    ma_nv_giao = '';
    ghi_chu_gh = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
