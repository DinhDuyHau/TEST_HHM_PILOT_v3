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
    ma_imei?: any,
    ma_kho?: any,
    ma_sukien?: string,
    ten_sukien?: string,
    xstatus_name?: string,
    ma_td3?: string, // ma_asm
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
    ten_kh?: string,
    ma_kho?: string,
    ong_ba?: string,
    dien_giai?: string,
    t_so_luong?: number,
    t_tien_nt?: number,
    image?: string,
    fcode3?: string,  // ma_asm
    ten_nvbh?: string,  // ten_asm
    [key: string]: any
}
