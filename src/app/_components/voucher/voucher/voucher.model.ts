export interface Model {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface Detail {
    stt_rec0?: string,
    line_nbr?: number,
    tien_nt?: number,
    dien_giai?: string,
    [key: string]: any
}

export interface DetailInfo {
    id: number,
    name: string,
    data: Detail[]
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
    ma_thanhtoan?: string,
    ma_cuahang?: string,
    ma_cuahang_n?: string,
    ma_gd?: string,
    tk?: string,
    tknh?: string,
    ma_kh?: string,
    ma_kho?: string,
    ma_khon?: string,
    ma_tt?: string,
    ten_kh?: string,
    dia_chi?: string,
    ong_ba?: string,
    dien_giai?: string,
    t_so_luong?: number,
    t_tien_nt?: number,
    t_chie_nt?: number,
    t_tt_nt?: number,
    [key: string]: any
}