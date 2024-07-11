export interface Receipt {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface ReceiptDetail {
    stt_rec0: string,
    line_nbr: number,
    ma_vt: string,
    ten_vt?: string,
    dvt?: string,
    ma_kho: string,
    so_luong: number,
    ma_imei?: string,
    ghi_chu?: string,
    sl_duyet?: string,
    sl_dh?: string,
    xstatus_name?: string,
}

export interface DetailInfo {
    id: number,
    name: string,
    data: any[]
}
export interface Extend {
    so_ct0?: string,
    ngay_ct0?: string,
    so_seri0?: string,
    ma_kh?: string,
    ten_kh?: string,
    dia_chi?: string,
    ma_so_thue?: string,
    ten_vt?: string,
    t_tien_nt?: number,
    ma_thue?: string,
    thue_suat?: number,
    t_thue_nt?: number,
    [key: string]: any
}

export interface MasterInfo {
    stt_rec?: string,
    ma_ct?: string,
    so_ct?: string,
    ngay_ct?: string,
    ngay_lct?: string,
    ngay_ht?: string,

    ma_dvcs: string,
    ma_ca?: string,
    ma_nt?: string,
    ty_gia?: string,
    status?: string,
    ma_cuahang?: string,
    ma_gd?: string,
    ma_kh?: string,
    ma_tt?: string,
    ong_ba?: string,
    dien_giai?: string,
    t_so_luong?: number,
    t_tien_nt?: number,
    t_thue_nt?: number,
    t_tt_nt?: number,
    fnote3?: string,
    t_ck?: number,
    t_ck_nt?: number,
    [key: string]: any
}