import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket, Overview } from '../common-model/base-entity.model';
import { Package } from '../common-model/package.model';

export class SaleOnlineEcommerceTicket {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];

  //Dịch vụ
  service: Service[] = [];

  //Gói cước
  packages: Package[] = [];

  //Chiết khấu
  discount: Discount[] = [];

  //Thông tin bảo hành
  guarantee: Guarantee[] = [];

  //Thanh toán
  payment: Payment = new Payment;

  //Thông tin sàn thương mại điện tử
  ecommerce: EcommerceInfomation = new EcommerceInfomation;

  //tổng quan
  overview: Overview[] = [];

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

  tien_phi_01 = 0;
  tien_phi_02 = 0;
  tien_phi_03 = 0;
  tien_phi_04 = 0;
  tien_phi_05 = 0;
  tien_phi_06 = 0;
  tien_phi_07 = 0;
  tien_phi_08 = 0;
  tien_phi_09 = 0;
  tien_phi_10 = 0;
  phi_dc_khac = 0
  phi_hoang_ha = 0;
  tong_phi = 0;

  t_phi_san = 0;


  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class Merchandise extends BaseMerchandise {
  status = '0';

  gia_ck = 0;
  tien_ck = 0;
  tien_ck_qd = 0;
  km_yn = false;
  no_km_yn?: boolean = false;
  imei_mua = '';
  tien_kmqd = 0;

  phi_san_01 = 0;
  phi_san_02 = 0;
  phi_san_03 = 0;
  phi_san_04 = 0;
  phi_san_05 = 0;
  phi_san_06 = 0;
  phi_san_07 = 0;
  phi_san_08 = 0;
  phi_san_09 = 0;
  phi_san_10 = 0;
  phi_san_hhm = 0;
  phi_dc_khac = 0;

  tong_phi = 0;
  gia_tmdt = 0;
  gia_tmdt_vat = 0;
  tong_thue = 0;

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

  tien_phi_01 = 0;
  tien_phi_02 = 0;
  tien_phi_03 = 0;
  tien_phi_04 = 0;
  tien_phi_05 = 0;
  tien_phi_06 = 0;
  tien_phi_07 = 0;
  tien_phi_08 = 0;
  tien_phi_09 = 0;
  tien_phi_10 = 0;
  phi_hoang_ha = 0;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
