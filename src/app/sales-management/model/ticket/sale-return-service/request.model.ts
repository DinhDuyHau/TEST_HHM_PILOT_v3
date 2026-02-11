import { BaseEntity, BaseMasterInfoRequest } from '../common-model/base-entity.model';
export class MasterInfoRequest extends BaseMasterInfoRequest {
    dien_giai = '';
    email_nhan_key = '';
    so_dh = '';
    t_con_no = 0;
    t_da_tra = 0;
    tien_dat_coc = 0;
    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
export class ServiceRequest extends BaseEntity {
    stt_rec_hd1 = '';
    stt_rec0hd1 = '';
    ma_dv = '';
    ten_dv = '';
    dvt = '';
    he_so = 0;
    so_luong = 0;
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
    gia_ban = 0;
    gia_tra_lai = 0;
    vt_ton_kho = '';
    gia2 = 0;
    gia_nt2 = 0;
    ngay_ct_hd1 = '';
    so_ct_hd1 = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
