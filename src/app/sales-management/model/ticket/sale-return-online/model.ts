import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';
import { Payment } from '../common-model/payment.model';
import { Service } from '../common-model/service.model';

export class ReturnSaleOnlineTicketCreate {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
  service: Service[] = [];
  payment: Payment = new Payment;
  electronic_bill: electronic_bill = new electronic_bill;
}

export type ReturnSaleOnlineTicketCreateList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd579',
  SERVICE: 'd579dv',
  ELECTRONIC_BILL: 'm579ext',
  PAYMENT: 'd579tt',
};

export class MasterInfo extends BaseMasterInfo {
  dien_giai = '';
  t_ck = 0;
  t_tien_tnk = 0;   // Thu nhập khác
  email_nhan_key = '';

  t_con_no = 0;
  t_da_tra = 0;


  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class Merchandise extends BaseMerchandise {
  stt_rec_hd1 = '';
  gia_ck = 0;
  tien_ck = 0;
  tien_ck_qd = 0;
  km_yn = false;
  no_km_yn?: boolean = false;
  tien_kmqd = 0;
  imei_mua = '';

  gia2 = 0;
  gia_nt2 = 0;
  tien2 = 0;
  tien_nt2 = 0;
  thue = 0;
  thue_nt = 0;
  tt = 0;
  tt_nt = 0;

  ma_asm_duyet?: string = '';
  ten_asm_duyet?: string = '';
  ty_le_giam?: number = -1;
  tien_giam?: number = 0;
  giam_gia_yn?: boolean = false;
  email_nhan_key = '';
  gia_tra_lai = 0;
  s6 = 0;

  constructor(obj?: any) {
    super();
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