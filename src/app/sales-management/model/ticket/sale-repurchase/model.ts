import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';
import { Payment } from '../common-model/payment.model';

export class SaleRepurchaseTicket {
    masterInfo: MasterInfo = new MasterInfo;
    merchandise: Merchandise[] = [];
    payment: Payment = new Payment;
}

export type SaleRepurchaseTicketList = BaseTicket

export const TAB_NAME = {
    MERCHANDISE: 'd577',
    PAYMENT: 'd577tt'
};

export class MasterInfo extends BaseMasterInfo {
    ten_nv = '';
    t_tien = 0;
    t_tien_nt = 0;
    t_tt = 0;
    t_con_no = 0;
    t_da_tra = 0;
    dien_giai = '';
    gia_nhap_mua = 0;
    email_nhan_key = '';
    fcode1 = '';
    so_ct0 = '';
    so_seri0 = '';
    ngay_ct0: string = Date();
    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}

export class Merchandise extends BaseMerchandise {
    new_imei_yn = false;
    ma_loai = '';
    imei_mua = '';
    tt = 0;

    constructor(obj?: any) {
        super();
        Object.assign(this, obj);
    }
}
