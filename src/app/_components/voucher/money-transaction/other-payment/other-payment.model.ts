export interface Receipt {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface ReceiptDetail {
    stt_rec_pn?: string,
    stt_rec0pn?: string,
    stt_rec0?: string,
    line_nbr?: number,
    tien_nt?: number,
    dien_giai?: string,
    ma_phi?: string,
    ten_phi?: string,
    [key: string]: any
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

export interface DetailInfo {
    id: number,
    name: string,
    data: any[]
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
    tk?: string,
    tknh?: string,
    ten_nh?: string,
    ma_kh?: string,
    ma_kho?: string,
    ma_khon?: string,
    ma_tt?: string,
    dia_chi?: string,
    ong_ba?: string,
    dien_giai?: string,
    t_so_luong?: number,
    t_tien_nt?: number,
    t_thue_nt?: number,
    t_tt_nt?: number,
    ma_thanhtoan?: string,
    fcode1?: string,
    fcode2?: string,
    s7?: Date,
    [key: string]: any
}