import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';
import { Package } from '../common-model/package.model';


export class TelecomSaleTicket {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
  service: Service[] = [];
  packages: Package[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
}

export type TelecomSaleTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd595',
  SERVICE: 'd595dv',
  PACKAGE: 'd595bh',
  DISCOUNT: 'd595ck',
  GUARANTEE: 'ddd',
  PAYMENT: 'd595tt'
};

export class MasterInfo extends BaseMasterInfo {
  ma_nvvc = '';
  ten_nvvc = '';
  tien_coc = 0;
  t_ck = 0;
  t_da_tra = 0;
  t_con_no = 0;
  email_nhan_key = '';
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
  imei_mua = '';
  tien_kmqd = 0;

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}