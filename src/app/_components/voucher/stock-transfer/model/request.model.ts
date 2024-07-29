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

    fnote2 = '';

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
    ma_khon = '';
    ma_cuahang_n = '';
    fnote2 = '';

    fnote2 = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}