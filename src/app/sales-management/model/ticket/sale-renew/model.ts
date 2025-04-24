import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseMasterInfo, BaseMerchandise, BaseTicket, Overview, VoucherCode } from '../common-model/base-entity.model';
import { Package } from '../common-model/package.model';


export class RenewSaleTicketCreate {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise_new_sale: Merchandise[] = [];
  merchandise_used: MerchandiseUsed[] = [];
  service: Service[] = [];
  packages: Package[] = [];
  discount: Discount[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
  overview: Overview[] = [];
  voucherCode: VoucherCode[] = [];
}

export type RenewSaleTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE_NEW_SALE: 'd589',
  MERCHANDISE_USED: 'd589htc',
  SERVICE: 'd589dv',
  PACKAGE: 'd589bh',
  DISCOUNT: 'd589ck',
  GUARANTEE: 'ddd',
  PAYMENT: 'd589tt',
  VOUCHERCODE: 'd589ctck'
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
  t_tien_ban = 0;
  s4 = 0;

  //Thu cũ
  t_sl_thu_cu = 0;
  t_tc_tien_nt2 = 0;
  t_tien_thu_cu = 0;
  t_tien_thu_cu_nt = 0;
  email_nhan_key = '';
  //Mã nhà cung cấp thu cũ
  ma_ncc = '';
  ma_hang = '';
  tl_tich_diem = 0;

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
  ma_gd_tcdm = '';
  gia_bl = 0;
  gia_bl_vat = 0;
  tien_ht = 0;
  gc_td1 = '';
  ma_cttc = '';
  ma_td3 = '';
  //ma_td2 dùng để lưu mã khai báo
  ma_td2 = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class MerchandiseUsed extends BaseMerchandise {
  new_imei_yn = false;
  ma_loai = '';
  gia0 = 0;
  gia_dc = 0;
  gc_td1 = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}
