export interface Receipt {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface ReceiptDetail {
    stt_rec0?: string,
    line_nbr?: number,
    tien_nt?: number,
    dien_giai?: string,
    [key: string]: any
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
    ma_thanhtoan?: string,
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
    ten_kh?: string,
    dia_chi?: string,
    ong_ba?: string,
    dien_giai?: string,

    t_tt_nt?: number,

    ma_ft?: string,

    ngay_duyet?: string,
    ngay_huy?: string,
    ly_do_hoan?: string,
    ly_do_huy?: string,

    so_ct_tt?: string,
    ngay_ct_tt?: string,
    tien?: number,
    tien_nt?: number,

    tien_hoan?: number,
    tien_hoan_nt?: number,

    [key: string]: any
}