import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { Transport } from '../../common/delivery.mode';
import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';
import { Package } from '../common-model/package.model';


export class RetailSaleTicket {
    masterInfo: MasterInfo = new MasterInfo;
    merchandise: Merchandise[] = [];
    service: Service[] = [];
    packages: Package[] = []
    discount: Discount[] = [];
    guarantee: Guarantee[] = [];
    payment: Payment = new Payment;
    transport: Transport = new Transport;
}

export type RetailTicketList = BaseTicket

export const TAB_NAME = {
    MERCHANDISE: 'd562',
    SERVICE: '',
    DISCOUNT: '',
    GUARANTEE: 'ddd',
    PAYMENT: 'd562tt',
    PACKAGE: '',
    TRANSPORT: 'd562'
};

export class MasterInfo extends BaseMasterInfo {
    ma_nvvc = '';
    ten_nvvc = '';
    tien_coc = 0;
    t_ck = 0;
    t_da_tra = 0;
    t_con_no = 0;
    image = '';
    email_nhan_key = '';
    dien_giai = '';

    ma_loaivc = '';
    so_dh_vc = '';
    ma_van_don = '';
    tien_phi_cod = 0;
    ghi_chu_gh = '';

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
