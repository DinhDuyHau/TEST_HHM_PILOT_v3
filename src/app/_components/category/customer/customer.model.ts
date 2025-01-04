export interface Customer {
    ma_kh: string;
    ten_kh: string;
    ten_kh2: string;
    dia_chi: string;
    ma_so_thue: string;
    email_cn: string;
    image?: string;
    hoadon_mst?: string;
    hoadon_tenkh?: string;
    hoadon_diachi?: string;
    hoadon_email?: string;

    tk_nh?: string;
    ngan_hang?: string;
    nh_kh3?: string;
}

export class CustomerModel {
    ma_kh: string;
    ten_kh: string;
    ten_kh2?: string;
    dia_chi?: string;
    ma_so_thue?: string;
    gioi_tinh?: string;
    ngay_sinh?: string;
    dien_thoai?: string;
    email_cn?: string;
    ma_tinh?: string;
    ma_quan?: string;
    ma_phuong?: string;
    hoadon_mst?: string;
    hoadon_tenkh?: string;
    hoadon_diachi?: string;
    hoadon_email?: string;
    do_tuoi?: number;
    tk_nh?: string;
    ngan_hang?: string;
    [key: string]: any;
    constructor() {
        this.ma_kh = '';
        this.ten_kh = '';
        this.ten_kh2 = '';
        this.dia_chi = '';
        this.ma_so_thue = '';
        this.gioi_tinh = '';
        this.dien_thoai = '';
        this.ngay_sinh = '';
        this.email_cn = '';
        this.ma_tinh = '';
        this.ma_quan = '';
        this.ma_phuong = '';
        this.hoadon_mst = '';
        this.hoadon_tenkh = '';
        this.hoadon_diachi = '';
        this.hoadon_email = '';
        this.do_tuoi = 0;
        this.tk_nh = '';
        this.ten_kh = '';
    }
}
