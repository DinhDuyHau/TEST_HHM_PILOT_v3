import { BaseEntity, BaseMasterInfoRequest, BaseMerchandiseRequest } from '../common-model/base-entity.model';
import { ServiceRequest } from '../common-model/service.model';

export class MerchandiseRequest extends BaseMerchandiseRequest {
    gia_ck = 0;
    gia_ck_nt = 0;
    ck = 0;
    ck_nt = 0;
    km_yn = false;
    imei_mua = '';

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

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}



export class ServiceChangeRequest extends ServiceRequest {
    ma_imei_tra = '';
    ma_imei_doi = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}