

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
    ma_vt: string,
    ten_vt: string,
    dvt: string,
}