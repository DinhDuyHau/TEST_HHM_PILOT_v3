import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';
import { Package } from '../common-model/package.model';

export class SaleOnlineEcommerceTicket {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
  service: Service[] = [];
  packages: Package[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
  ecommerce: EcommerceInfomation = new EcommerceInfomation;
}


export type SaleOnlineEcommerceTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd593',
  SERVICE: 'd593dv',
  PACKAGE: 'd593bh',
  DISCOUNT: 'd593ck',
  GUARANTEE: 'ddd',
  PAYMENT: 'd593tt',
  ECOMMERCE: 'm593ext',
};

export class MasterInfo extends BaseMasterInfo {
  ten_nvvc = '';
  ma_nvvc = '';
  tien_coc = 0;
  t_ck = 0;
  t_da_tra = 0;
  t_con_no = 0;
  ma_kh_tmdt = '';
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
  no_km_yn?: boolean = false;
  imei_mua = '';
  tien_kmqd = 0;

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class EcommerceInfomation {
  ma_kh_tmdt = '';
  ma_dh = '';
  doanh_thu = 0;
  giam_gia_tmdt = 0;
  giam_gia_hhm = 0;
  thanh_tien = 0;
  ma_dvvc = '';
  // ngay_nhan_hang: string = new Date(Date.now()).toISOString();
  ngay_nhan_hang: string = new Date(new Date().getTime() + 86400000).toISOString();
  phi_vc = 0;
  nguoi_nhan_hang = '';
  ma_van_don = '';

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}