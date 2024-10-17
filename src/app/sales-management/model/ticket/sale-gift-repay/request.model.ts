import { BaseEntity, BaseMasterInfoRequest, BaseMerchandiseRequest } from '../common-model/base-entity.model';

export class MerchandiseRequest extends BaseEntity {
    so_ct_hd = '';
    stt_rec_hd = '';
    stt_rec0_hd = '';

    ma_vt = '';
    ten_vt = '';
    ma_imei = '';
    ma_kho = '';
    dvt = '';
    so_luong = 0;
    line_nbr = 0;
    ma_td3 = '';
    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}


export class MasterInfoRequest extends BaseEntity {
    ma_nvbh = '';
    ma_kh = '';
    ma_nt = '';
    ngay_lct = '';
    dien_giai = '';
    ty_gia = 1;
    loai_ct = '2';
    t_so_luong = 0;
    status = '';
    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}