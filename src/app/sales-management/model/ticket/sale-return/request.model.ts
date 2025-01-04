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
    gia_vat = 0;
    s5 = 0;
    s6 = 0;

    ma_asm_duyet?: string = '';
    ten_asm_duyet?: string = '';
    ty_le_giam?: number = -1;
    tien_giam?: number = 0;
    giam_gia_yn?: boolean = false;
    gia_tra_lai?: number = 0;
    gc_td1 = '';
    ma_td1 = '';
    gc_td2 = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}


export class MasterInfoRequest extends BaseMasterInfoRequest {
    dien_giai = '';
    t_ck = 0;
    t_ck_nt = 0;
    t_tien_tnk = 0;
    t_con_no = 0;
    tien_dat_coc = 0;
    email_nhan_key = '';
    fcode2 = '';
    fdate2: string = Date();
    stt_rec_hd = '';
    so_dh_vc = ''; // mã đơn hàng
    ma_nvvc = ''; // mã đơn vị vận chuyển
    ma_van_don = ''; // mã vận đơn

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
