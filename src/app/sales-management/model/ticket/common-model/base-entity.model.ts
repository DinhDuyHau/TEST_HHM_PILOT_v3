export class BaseEntity {
    stt_rec = '';
    stt_rec0 = '';
    ma_ct = '';
    ngay_ct: string = Date();
    so_ct = '';
    ma_cuahang = '';
    ma_ca = '';
    ma_dvcs = '';
}

export class BaseMerchandise {
    s4 = 0;
    s5 = 0
    ma_nvbh_i = '';
    ma_vt = '';
    ten_vt = '';
    ma_imei = '';
    ma_kho = '';
    dvt = '';
    so_luong = 1;
    gia_ban = 0;
    thue_suat = 0;
    thanh_tien = 0;
    tien_thue = 0;
    thanh_toan = 0;
    ma_thue = '';
    line_nbr = 0;
    gia_vat = 0;
    gia_full_vat = 0;

    nh_vt1 = '';
    tl_ck09 = 0; // tỉ lệ ck 09
    tien_kb09 = 0; // tiền ck 09
    tien_max09 = 0; // tiền max ck 09
    tien_ck09 = 0; // tiền ck được hưởng 09
}



export class BaseMasterInfo extends BaseEntity {
    ma_kh = '';
    ten_kh = '';
    dia_chi = '';
    ma_nvbh = '';
    t_so_luong = 0;
    t_tien_nt2 = 0;
    t_thue_nt = 0;
    t_tt_nt = 0;
    diem_qd = 0;
    he_so_qd = 0;
    he_so_qd_tien = 0;
    status = '';
    t_gg = 0;
    t_cp_khac = 0;
    fqty1 = 0;

    hd_mst = '';
    hd_ten_kh = '';
    hd_dia_chi = '';
    hd_httt = '';
    hd_email = '';

    nguoi_duyet_ck = '';
}


export class BaseMasterInfoRequest extends BaseEntity {
    ma_nvbh = '';
    ma_kh = '';
    ma_nt = '';
    ty_gia = 1;
    loai_ct = '2';
    ma_thue = '';
    t_so_luong = 0;
    t_tien = 0;
    t_tien_nt = 0;
    t_tien2 = 0;
    t_tien_nt2 = 0;
    t_thue = 0;
    t_thue_nt = 0;
    t_tt = 0;
    t_tt_nt = 0;
    diem_qd = 0;
    status = '';
    ngay_lct = '';

    hd_mst = '';
    hd_ten_kh = '';
    hd_dia_chi = '';
    hd_httt = '';
    hd_email = '';

    nguoi_duyet_ck = '';

    t_gg = 0;
    t_gg_nt = 0;
    t_cp_khac = 0;
    t_cp_khac_nt = 0;
    fqty1 = 0;
}

export class BaseMerchandiseRequest extends BaseEntity {
    ma_vt = '';
    ma_imei = '';
    ma_kho = '';
    dvt = '';
    so_luong = 0;
    gia_ban = 0;
    gia_ban_nt = 0;
    gia2 = 0;
    gia_nt2 = 0;
    tien2 = 0;
    tien_nt2 = 0;
    ma_thue = '';
    thue_suat = 0;
    thue = 0;
    thue_nt = 0;
    tt = 0;
    tt_nt = 0;
    line_nbr = 0;
}


export interface BaseTicket {
    stt_rec: string;
    ma_dvcs: string;
    ngay_ct: string;
    so_ct: string;
    ma_kh: string;
    ten_kh: string;
    dien_giai: string;
    t_tien_nt2: number;
    t_ck_nt: number;
    t_thue_nt: number;
    t_tt_nt: number;
    ma_nt: string;
    ma_ct: string;
    status: string;
    user_id0: string;
    user_id2: string;
    datetime0: string;
    datetime2: string;
    statusname: string;
    comment: string;
    comment2: string;
    Hash: string
}
