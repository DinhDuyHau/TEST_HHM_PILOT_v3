
export class ContractTicketCreate {
  masterInfo: MasterInfo = new MasterInfo;
  merchandise: Merchandise[] = [];
}

export const TAB_NAME = {
  MERCHANDISE: 'd564',
};

export class MasterInfo {
  so_hd = '';
  ten_kh = '';
  han_tt = '';
  dien_giai = '';
  ma_kh = '';
  ma_gd = '';
  ma_nt = '';
  ty_gia = 0;
  loai_ct = 0;
  ma_thue = '';
  t_so_luong = 0;
  t_tien_nt2 = 0;
  t_thue_nt = 0;
  t_tt_nt = 0;
  stt_rec = '';
  ma_ct = '';
  so_ct = 0;
  ngay_ct = '';
  ma_dvcs = '';
  ma_cuahang = '';
  ma_ca = '';
  status = '';
  dia_chi = '';
  ma_nv = '';
  ma_nvvc = '';
  tien_coc = 0;
  t_ck = 0;
  t_da_tra = 0;
  t_con_no = 0;
  no_km_yn = false;
  s1 = '';
  ma_tt = '';
  ht_tt = '';
  tt_tt = '';
  ht_ban = '';
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}

export class Merchandise {
  ma_vt = '';
  ten_vt = '';
  ma_imei = '';
  ma_kho = '';
  dvt = '';
  so_luong = 1;
  gia_ban = 0;
  gia_ck = 0;
  tien_ck = 0;
  thue_suat = 0;
  thanh_tien = 0;
  tien_thue = 0;
  thanh_toan = 0;
  ma_thue = '';
  km_yn = false;
  no_km_yn?: boolean = false;
  imei_mua = '';
  line_nbr = 0;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}