import { BaseEntity, BaseMasterInfoRequest } from '../common-model/base-entity.model';

export class MasterInfoRequest extends BaseMasterInfoRequest {
    dien_giai = '';
    t_ck = 0;
    t_ck_nt = 0;
    t_da_tra = 0;
    t_con_no = 0;
    email_nhan_key = '';

    constructor(obj?: any) {
        super();
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
    tien2 = 0;
    tien_nt2 = 0;
    ma_thue = '';
    thue_suat = 0;
    thue = 0;
    thue_nt = 0;
    tt = 0;
    tt_nt = 0;
    line_nbr = 0;
    gia_vat = 0;
    gia_vat_nt = 0;
    // ma_td1: lưu lý do sửa giá
    ma_td1 = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
