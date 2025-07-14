import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket, Overview } from '../common-model/base-entity.model';
import { Package } from '../common-model/package.model';

export class SaleAffiliateceTicket {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
  packages: Package[] = [];
  service: Service[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
  overview: Overview[] = [];
}

export type AffiliateTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd594',
  SERVICE: 'd594dv',
  PACKAGE: 'd594bh',
  DISCOUNT: 'd594ck',
  GUARANTEE: 'ddd',
  PAYMENT: 'd594tt'
};

export class MasterInfo extends BaseMasterInfo {
  ma_nvvc = '';
  ten_nvvc = '';
  tien_coc = 0;
  t_ck = 0;
  t_da_tra = 0;
  t_con_no = 0;
  lap_dh_lk = 0;
  email_nhan_key = '';
  dien_giai = '';
  fnote3 = ''; // xác định có lập hddt ko
  fnote2 = ''; // đối tượng hóa đơn điện tử
  xtag = ''; // hiện tên người mua trên HĐĐT hay ko, 1: có 0: ko

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
  tien_kmqd = 0;
  no_km_yn?: boolean = false;
  imei_mua = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}
