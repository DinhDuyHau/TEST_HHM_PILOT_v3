import { BaseMasterInfoRequest, BaseMerchandiseRequest } from '../common-model/base-entity.model';

export class MerchandiseRequest extends BaseMerchandiseRequest {
    stt_rec_hd1 = '';
    gia_ck = 0;
    gia_ck_nt = 0;
    ck = 0;
    ck_nt = 0;
    km_yn = false;
    no_km_yn = false;
    tien_kmqd = 0;
    imei_mua = '';

    ma_asm_duyet?: string = '';
    ten_asm_duyet?: string = '';
    ty_le_giam?: number = -1;
    tien_giam?: number = 0;
    giam_gia_yn?: boolean = false;
    gia_tra_lai?: number = 0;
    hd_so = '';
    s7 = '';
    ma_td1 = '';
    gc_td1 = '';
    gc_td2 = '';
    stt_rec_hd = '';
    stt_rec0hd = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}


export class MasterInfoRequest extends BaseMasterInfoRequest {
    dien_giai = '';
    ma_nvvc = '';
    t_ck = 0;
    t_ck_nt = 0;
    t_tien_tnk = 0;
    t_con_no = 0;
    tien_dat_coc = 0;
    email_nhan_key = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
