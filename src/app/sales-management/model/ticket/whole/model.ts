import { BaseMasterInfo, BaseMerchandise, BaseTicket } from '../common-model/base-entity.model';
import { Guarantee } from '../common-model/guarantee.model';
import { Payment } from '../common-model/payment.model';
import { Transport } from '../../common/delivery.mode';
import { ContractInfo } from './request.model';


export class WholeTicketCreate {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
  guarantee: Guarantee[] = [];
  payment: Payment = new Payment;
  transport: Transport = new Transport;
  contractInfo: ContractInfo = new ContractInfo;
  contractFile: ContractFile = new ContractFile;
}

export type RetailTicketList = BaseTicket

export const TAB_NAME = {
  MERCHANDISE: 'd592',
  MERCHANDISE_FROM_CONTRACT: 'd564',
  GUARANTEE: 'd592bh',
  PAYMENT: 'd592tt',
  TRANSPORT: 'm592ext'
};

export class MasterInfo extends BaseMasterInfo {
  t_da_tra = 0;
  t_con_no = 0;
  tien_thue = 0;
  thanh_toan = 0;
  ong_ba = '';
  dien_giai = '';
  fnote3 = ''; // xác định có lập hddt ko
  fnote2 = ''; // đối tượng hóa đơn điện tử
  xtag = ''; // hiện tên người mua trên HĐĐT hay ko, 1: có 0: ko

  fcode1 = '';    //Mã hoa hồng tổng đơn
  fcode2 = '';    //Loại hoa hồng (00 - Không hoa hồng, 01 - HH tổng đơn, 02 - HH chi tiết)
  fcode3 = '';    //Đối tượng ghi nhận hạch toán tiền hoa hồng (nhân viên đàm phán ký hợp đồng bán buôn)

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class Merchandise extends BaseMerchandise {
  so_luong_imei = 0;
  override ma_imei: any;

  tien2 = 0;
  tien_nt2 = 0;
  tt = 0;
  tt_nt = 0;
  gia2 = 0;
  gia_nt2 = 0;

  ma_td1 = '';
  ma_td2 = '';
  ma_td3 = '';

  sl_td1 = 0;
  sl_td2 = 0;
  s1 = '';

  constructor(obj?: any) {
    super();
    Object.assign(this, obj);
  }
}

export class ContractFile {
  so_ct = '';
  ngay_ct = '';
  cq_file: any = null;
  co_file: any = null;
}
