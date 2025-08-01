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

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}


export class MasterInfoRequest extends BaseMasterInfoRequest {
    job_id = '';
    t_ck = 0;
    t_ck_nt = 0;
    t_da_tra = 0;
    t_con_no = 0;
    tien_dat_coc = 0;
    ma_nvvc = '';
    email_nhan_key = '';
    fnote3 = ''; // xác định có lập hddt ko
    fnote2 = ''; // đối tượng hóa đơn điện tử
    hd_nguoi_mua = '';
    hd_loai_giay_to = '';
    hd_so_giay_to = '';
    xtag = ''; // hiện tên người mua trên HĐĐT hay ko, 1: có 0: ko

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
