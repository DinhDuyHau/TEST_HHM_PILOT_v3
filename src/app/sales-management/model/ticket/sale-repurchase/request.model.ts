import { BaseEntity, BaseMasterInfoRequest, BaseMerchandiseRequest } from '../common-model/base-entity.model';

export class MerchandiseRequest extends BaseMerchandiseRequest {
    ma_loai = '';
    gia = 0;
    gia_nt = 0;
    tien = 0;
    tien_nt = 0;
    new_imei_yn = false;
    s4 = 0;
    ma_td3 = '';
    ma_td2 = '';
    sl_td1 = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}


export class MasterInfoRequest extends BaseMasterInfoRequest {
    dien_giai = '';
    email_nhan_key = '';
    t_con_no = 0;
    t_da_tra = 0;
    fcode1 = '';
    so_ct0 = '';
    so_seri0 = '';
    ngay_ct0 = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
