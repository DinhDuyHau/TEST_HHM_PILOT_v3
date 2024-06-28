export interface Receipt {
    masterInfo: MasterInfo;
    details: DetailInfo[];
}

export interface ReceiptDetail {
    stt_rec0?: string,
    line_nbr?: number,
    tien_nt?: number,
    ma_loai_thu_ho?: string,
    ten_loai_thu_ho?: string,
    tien_hoa_hong_nt?: number,
    dien_giai?: string,
    ma_imei?: string,
    [key: string]: any,
    ma_td2: string,             //mã giao dịch của đối tượng thu hộ
    ma_kh_thuho?: string,
    ten_kh_thuho?: string,
    ma_dvth?: string,
    ten_dvth?: string
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
    t_tien_hoa_hong?: number,
    t_thue_nt?: number,
    t_tt_nt?: number,
    t_con_no?: number,
    t_da_tra?: number,
    [key: string]: any
}