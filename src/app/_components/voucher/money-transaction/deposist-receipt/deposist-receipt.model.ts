export interface Receipt {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface ReceiptDetail {
    stt_rec0?: string,
    line_nbr?: number,
    ma_vt?: string,
    ten_vt?: string,
    tien_coc?: number,
    so_luong?: number,
    tien_nt?: number,
    tt_nt?: number,
    ngay_tra?: string,
    ma_ctr?: string,
    ten_ctr?: string,
    dien_giai?: string,
    stt_rec_tt?: string,
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
    t_con_no?: number,
    t_da_tra?: number,
    [key: string]: any,
    fnote3?: string
}