import { BaseEntity, BaseMasterInfoRequest, BaseMerchandiseRequest } from '../common-model/base-entity.model';

export class MasterInfoRequest extends BaseMasterInfoRequest {
    ma_nv = '';
    t_con_no = 0;
    t_da_tra = 0;
    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class MerchandiseRequest extends BaseMerchandiseRequest {
    gia_vat = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class ContractInfo {
    so_ct_hd = '';
    stt_rec_hd = '';
    ngay_ct_hd = '';
    ten_kh = '';
    dia_chi = '';
    ma_co = '';
    file_co = '';
    ma_cq = '';
    file_cq = '';
}
