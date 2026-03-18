

export interface ImeiState {
    ma_imei: string,
    exists_yn: boolean,
    in_store_yn: boolean,
    xuat_yn: boolean,
    dat_hang_yn: boolean,
    dieu_chuyen_yn: boolean,
    bao_hanh_yn: boolean
}

export interface ImeiInfo {
    ma_imei: string,
    exists_yn: boolean,
    in_store_yn: boolean,
    xuat_yn: boolean,
    dat_hang_yn: boolean,
    dieu_chuyen_yn: boolean,
    bao_hanh_yn: boolean,
    ban_hang_yn: boolean,
    in_stock_yn: boolean,
    ma_vt: string,
    ten_vt: string,
    dvt: string,
    ma_thue: string,
    thue_suat: number,
}

export interface ImeiImportVoucherRequest {
    ma_ct: string;
    so_ct: string;
    ma_gd: string;

    nh_vt1?: string;
    nh_vt2?: string;
    nh_vt3?: string;
    nh_vt4?: string;
    ma_vt?: string;

    ma_cuahang: string;
}