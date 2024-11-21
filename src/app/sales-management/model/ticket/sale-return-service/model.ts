import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';

export class ReturnServiceSaleTicketCreate {
  masterInfo: MasterInfo = new MasterInfo;
  service: Service[] = [];
  electronic_bill: electronic_bill = new electronic_bill;
}

export type ReturnServiceSaleTicketCreateList = BaseTicket

export const TAB_NAME = {
  SERVICE: 'd523',
  ELECTRONIC_BILL: 'm523ext',
};

export class MasterInfo extends BaseMasterInfo {
  so_dh = '';
  dien_giai = '';
  email_nhan_key = '';
  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class Service {
  stt_rec_hd1 = '';
  stt_rec0hd1 = '';
  ma_dv = '';
  ten_dv = '';
  dvt = '';
  he_so = 0;
  ma_kho = '';
  ma_thue = '';
  so_luong = 1;
  gia_ban = 0;
  gia_tra_lai = 0;
  thanh_tien = 0;
  thue_suat = 0;
  tien_thue = 0;
  tong_tien = 0;
  ma_imei = '';
  vt_ton_kho = '';
  line_nbr = 0;
  thue = 0;
  gia2 = 0;
  gia_nt2 = 0;
  so_ct = '';
  key = '';
  ngay_ct_hd1 = '';
  so_ct_hd1 = '';

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}

export class electronic_bill {
  bh_mau_hd = '';   // Mẫu hóa đơn
  bh_so_seri = '';   // Số seri
  bh_ngay_hd: any = Date();  // Ngày hóa đơn
  bh_ngay_ky: any = Date();  // Ngày ký
  bh_so_hd = '';   // Số hóa đơn
  bh_status = '';  // Tình trạng hóa đơn
  bh_ma_so_thue = '';  // Mã số thuế
  bh_ma_tra_cuu = '';  // Mã tra cứu

  tl_mau_hd = '';   // Mẫu hóa đơn
  tl_so_seri = '';   // Số seri
  tl_ngay_hd: any = Date();  // Ngày hóa đơn
  tl_ngay_ky: any = Date();  // Ngày ký
  tl_so_hd = '';   // Số hóa đơn
  tl_status = '';  // Tình trạng hóa đơn
  tl_ma_so_thue = '';  // Mã số thuế
  tl_ma_tra_cuu = '';  // Mã tra cứu
}
