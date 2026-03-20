import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { Transport } from '../../common/delivery.mode';
import { BaseMasterInfo, BaseMerchandise, BaseTicket, Overview, VoucherCode } from '../common-model/base-entity.model';
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
    overview: Overview[] = [];
    voucherCode: VoucherCode[] = [];
}

export type RetailTicketList = BaseTicket

export const TAB_NAME = {
    MERCHANDISE: 'd581',
    SERVICE: 'd581dv',
    DISCOUNT: 'd581ck',
    GUARANTEE: 'ddd',
    PAYMENT: 'd581tt',
    PACKAGE: 'd581bh',
    TRANSPORT: 'd581',
    VOUCHERCODE: 'd581ctck'
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
    ma_hang = '';
    tl_tich_diem = 0;
    fnote3 = ''; // xác định có lập hddt ko
    fnote2 = ''; // đối tượng hóa đơn điện tử
    xtag = ''; // hiện tên người mua trên HĐĐT hay ko, 1: có 0: ko
    fcode3 = '';

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
