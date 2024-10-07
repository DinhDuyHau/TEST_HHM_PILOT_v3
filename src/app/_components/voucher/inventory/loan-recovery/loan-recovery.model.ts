export interface Receipt {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface ReceiptDetail {
    stt_rec0?: string,
    line_nbr?: number,
    ma_vt: string,
    ten_vt?: string,
    dvt?: string,
    so_luong: number,
    gia_nt: number,
    tien_nt: number,
    sl_td1: number,
    ma_imei?: any,
    ma_kho?: any,
    stt_rec_px?: string,
    stt_rec0px?: string,
    xstatus_name?: string,
    so_ct_px?: string,
    ngay_ct_px?: string,
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
    ma_gd?: string,
    ma_kh?: string,
    ma_kho?: string,
    ong_ba?: string,
    ten_ongba?: string,
    dien_giai?: string,
    t_so_luong?: number,
    t_tien_nt?: number,
    [key: string]: any
}
