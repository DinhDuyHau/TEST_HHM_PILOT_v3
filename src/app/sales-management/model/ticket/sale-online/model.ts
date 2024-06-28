import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { Transport } from '../../common/delivery.mode';
import { BaseEntity, BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';

export class SaleOnlineTicket {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
  service: Service[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
  transport: Transport = new Transport;
}

export type SaleOnlineTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd561',
  SERVICE: 'd561dv',
  DISCOUNT: 'd561ck',
  GUARANTEE: 'd561bh',
  PAYMENT: 'd561tt',
  TRANSPORT: 'm561ext'
};

export class MasterInfo extends BaseMasterInfo {
  ten_nvvc = '';
  ma_nvvc = '';
  tien_coc = 0;
  t_ck = 0;
  t_con_no = 0;
  t_da_tra = 0;
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
  tien_kmqd = 0;
  no_km_yn?: boolean = false;
  imei_mua = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

