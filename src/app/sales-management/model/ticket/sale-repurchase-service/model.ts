import { BaseEntity, BaseMasterInfo, BaseTicket } from '../common-model/base-entity.model';
import { Payment } from '../common-model/payment.model';

export class ServiceRepurchaseServiceTicket {
  masterInfo: MasterInfo = new MasterInfo;
  service: Service[] = [];
  payment: Payment = new Payment;
}

export type ServiceTicketList = BaseTicket

export const TAB_NAME = {
  SERVICE: 'd531',
  PAYMENT: 'd531tt'
};

export class MasterInfo extends BaseMasterInfo {
  dien_giai = '';
  t_con_no = 0;
  t_da_tra = 0;
  email_nhan_key = '';
  gia_nhap_mua = 0;

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
  key = '';
  gia_nhap_mua = 0;
  gia = 0;
  so_ct_hd = '';
  ngay_ct_hd = '';
  stt_rec_hd = '';
  stt_rec0hd = '';

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
