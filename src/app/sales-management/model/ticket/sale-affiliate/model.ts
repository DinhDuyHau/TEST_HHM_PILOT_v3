import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';

export class SaleAffiliateceTicket {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
  service: Service[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
}

export type AffiliateTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd594',
  SERVICE: 'd594dv',
  DISCOUNT: 'd594ck',
  GUARANTEE: 'd594bh',
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