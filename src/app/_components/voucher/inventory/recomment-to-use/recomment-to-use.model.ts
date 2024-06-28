export interface Receipt {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface ReceiptDetail {
    stt_rec_pn?: string,
    stt_rec0pn?: string,
    stt_rec0?: string,
    pn_so?: string,
    line_nbr?: number,
    ma_vt: string,
    ten_vt?: string,
    dvt?: string,
    so_luong: number,
    gia_nt?: number,
    tien_nt?: number,
    thue_nt?: number,
    tt_nt?: number,
    ma_imei?: any,
    ma_kho?: any,
    ma_thue?: string,
    thue_suat?: number,
    ghi_chu?: string,
    xstatus_name?: string,
}

export interface DetailInfo {
    id: number,
    name: string,
    data: ReceiptDetail[]
}

export interface MasterInfo {
    stt_rec?: string,
    ma_ct?: string,
    so_ct?: string,
    ngay_ct?: string,
    ngay_lct?: string,
    ma_dvcs: string,
    ma_ca?: string,
    ma_nt?: string,
    ty_gia?: string,
    status?: string,
    ma_cuahang?: string,
    ma_cuahang_n?: string,
    ma_gd?: string,
    ma_kh?: string,
    ma_kho?: string,
    ma_khon?: string,
    ma_tt?: string,
    ong_ba?: string,
    dien_giai?: string,
    t_so_luong?: number,
    t_tien_nt?: number,
    t_thue_nt?: number,
    t_tt_nt?: number,
    ma_ho_so?: string,
    ngay_ho_so?: string,
    [key: string]: any
}