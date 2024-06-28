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
    so_luong: number,
    ma_imei?: any,
    ghi_chu?: string,
    sl_duyet?: string,
    sl_dh?: string,
    xstatus_name?: string,
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
    ma_cuahang?: string,
    ma_cuahang_n?: string,
    ma_cuahang_x?: string,
    ma_gd?: string,
    ma_kh?: string,
    ma_kho?: string,
    ma_khon?: string,
    ma_tt?: string,
    ong_ba?: string,
    dien_giai?: string,
    t_so_luong?: number,
    [key: string]: any
}