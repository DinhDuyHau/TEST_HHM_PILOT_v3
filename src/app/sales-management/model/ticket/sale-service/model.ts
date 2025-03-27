import { BaseEntity, BaseMasterInfo, BaseTicket } from '../common-model/base-entity.model';
import { Payment } from '../common-model/payment.model';

export class ServiceSaleTicket {
  masterInfo: MasterInfo = new MasterInfo;
  service: Service[] = [];
  payment: Payment = new Payment;
}

export type ServiceTicketList = BaseTicket

export const TAB_NAME = {
  SERVICE: 'd521',
  PAYMENT: 'd521tt'
};

export class MasterInfo extends BaseMasterInfo {
  dien_giai = '';
  t_con_no = 0;
  t_da_tra = 0;
  email_nhan_key = '';
  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class Service {
  ma_dv = '';
  ten_dv = '';
  dvt = '';
  he_so = 0;
  ma_kho = '';
  ma_thue = '';
  vt_ton_kho = '';
  so_luong = 1;
  gia_ban = 0;
  thanh_tien = 0;
  thue_suat = 0;
  tien_thue = 0;
  tong_tien = 0;
  line_nbr = 0;
  gia_vat = 0;
  // ma_td1: lưu lý do sửa giá
  ma_td1 = '';
  noi_dung = '';
  key = '';
  ad_key = false;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
