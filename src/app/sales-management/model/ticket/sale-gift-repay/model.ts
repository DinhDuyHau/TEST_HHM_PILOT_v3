import { Discount } from '../common-model/discount.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Service } from '../common-model/service.model';
import { Payment } from '../common-model/payment.model';
import { BaseEntity, BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';


export class GiftRepaySaleTicketCreate {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
}

export type GiftRepaySaleTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd583',
};

export class MasterInfo extends BaseEntity {
  ma_kh = '';
  ten_kh = '';
  dia_chi = '';
  dien_giai = '';
  ma_nvbh = '';
  t_so_luong = 0;
  diem_qd = 0;
  he_so_qd = 0;
  status = '';

  hd_mst = '';
  hd_ten_kh = '';
  hd_dia_chi = '';
  hd_httt = '';
  hd_email = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class Merchandise {
  so_ct_hd = '';
  stt_rec_hd = '';
  stt_rec0_hd = '';

  ma_nvbh_i = '';
  ma_vt = '';
  ten_vt = '';
  ma_imei = '';
  ma_kho = '';
  dvt = '';
  so_luong = 1;
  line_nbr = 0;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}