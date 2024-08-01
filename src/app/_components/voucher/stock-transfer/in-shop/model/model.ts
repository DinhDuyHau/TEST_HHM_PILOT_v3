
import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '@app/sales-management/model/ticket/common-model/base-entity.model';


export class StockTransferInShopTicket {
    masterInfo: MasterInfo = new MasterInfo;
    merchandise: Merchandise[] = [];
}

export type TicketList = BaseTicket;

export const TAB_NAME = {
    MERCHANDISE: 'd575',
};

export class MasterInfo extends BaseMasterInfo {
    tien_coc = 0;
    t_ck = 0;
    t_da_tra = 0;
    t_con_no = 0;
    image = '';
    email_nhan_key = '';
    dien_giai = '';

    ten_cuahang = '';
    ma_kho = '';
    ten_kho = '';
    ma_cuahang_x = '';
    ten_cuahang_x = '';
    ma_khox = '';
    ten_khox = '';
    fnote2 = '';
    ngay_lct = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class Merchandise extends BaseMerchandise {
    gia_ck = 0;
    tien_ck = 0;
    tien_ck_qd = 0;
    km_yn = false;
    no_km_yn?: boolean = false;
    tien_kmqd = 0;
    imei_mua = '';

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}