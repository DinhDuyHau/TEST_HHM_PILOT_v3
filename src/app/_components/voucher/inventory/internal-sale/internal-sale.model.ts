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
}

export interface DetailInfo {
    id: string,
    name: string,
    data: ReceiptDetail[]
}

export interface MasterInfo {
    fcode1: string,
    fcode2: string,
    fcode3: string,
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
    hddt_ma_ncc?: string,
    hddt_mau_hd?: string,
    hddt_so_seri?: string,
    hddt_ngay_hd?: string,
    hddt_ngay_ky?: string,
    hddt_so_hd?: string,
    hddt_status?: string,
    hddt_ma_so_thue?: string,
    hddt_ma_tra_cuu?: string,
    [key: string]: any
}