export interface DashboardTopSelling {
  ten_vt: string;
  ma_vt: string;
  sl_xuat: number;
}

export interface DashboardSales {
  ma_cuahang: string;
  doanh_thu_n: number; // Doanh thu (ngày)
  don_hang_n: number; // Đơn hàng bán
  kh_tiep_n: number; // Khách hàng tiếp đón
  tien_hh: number; // Tiền hoa hồng
  doanh_thu_t: number; // Doanh thu (tháng)
  doanh_thu_nhap_tl: number; // Doanh thu nhập trả lại
  don_hang_nhap_tl: number; // Đơn hàng nhập trả lại
  t_hh_ban_ra: number; // Tổng hàng hóa bán ra
}

export interface DashboardSalesCommission {
  fullname: string;
  username: string;
  ds_thang: number;
  hoa_hong: number;
  sl_hangban: number;
  sl_hcare: number;
  ds_ngay_ht: number;
  tl_chuyendoi: number;
}
