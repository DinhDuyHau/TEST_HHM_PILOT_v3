//COD:COD; HH: hoàng hà giao hàng; CH: nhận tại cửa hàng
export const DELIVERY_TYPE = {
    COD: '01',
    HH: '02',
    CH: '03'
}

export class Transport {
    cod: COD = new COD;
    hhDelivery: HHDelivery = new HHDelivery;
    ma_loaivc: string = '';
}

export class COD {
    so_dh_vc: string = '';
    ma_van_don: string = '';
    tien_phi_cod: number = 0;
}

export class HHDelivery {
    ma_nv_giao: string = '';
    ten_nv: string = '';
    ghi_chu_gh: string = '';
}

