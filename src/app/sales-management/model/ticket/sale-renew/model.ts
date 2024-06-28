import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';


export class RenewSaleTicketCreate {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise_new_sale: Merchandise[] = [];
  merchandise_used: MerchandiseUsed[] = [];
  service: Service[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
}

export type RenewSaleTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE_NEW_SALE: 'd589',
  MERCHANDISE_USED: 'd589htc',
  SERVICE: 'd589dv',
  DISCOUNT: 'd589ck',
  GUARANTEE: 'd589bh',
  PAYMENT: 'd589tt'
};

export interface DetailDto {
  id: number,
  name: string,
  data: any
}

export class MasterInfo extends BaseMasterInfo {
  dien_giai = '';
  ma_nvvc = '';
  ten_nvvc = '';
  t_ck = 0;
  t_tien = 0;
  t_thue = 0;
  t_da_tra = 0;
  t_tt = 0;
  t_con_no = 0;
  gia_nhap_mua = 0;

  //Thu cũ
  t_sl_thu_cu = 0;
  t_tc_tien_nt2 = 0;
  t_tien_thu_cu = 0;
  t_tien_thu_cu_nt = 0;
  email_nhan_key = '';
  //Mã nhà cung cấp thu cũ
  ma_ncc = '';
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

export class MerchandiseUsed extends BaseMerchandise {
  new_imei_yn = false;
  ma_loai = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}