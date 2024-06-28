import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';

export const TAB_NAME = {
  MERCHANDISE_RETURN: 'd582tl',
  MERCHANDISE_CHANGE: 'd582',
  GUARANTEE: 'd582bh',
  PAYMENT: 'd582tt',
  SERVICE: 'd582dv',
};

export class ChangeSaleTicket {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise_return: Merchandise[] = [];
  merchandise_change: Merchandise[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  service: ServiceChange[] = [];
  // payment: Payment = new Payment;
}

export type ChangeSaleTicketList = BaseTicket

export class MasterInfo extends BaseMasterInfo {
  dien_giai = '';
  ma_nvvc = '';
  ten_nvvc = '';
  t_ck = 0;
  t_da_tra = 0;
  t_con_no = 0;
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

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class ServiceChange extends Service {
  ma_imei_tra = '';
  ma_imei_doi = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}