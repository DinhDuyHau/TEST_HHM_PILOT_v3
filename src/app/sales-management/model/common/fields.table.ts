
export const CUSTOMER_SEARCH = [
    {
        name: 'ma_kh',
        title: 'Mã khách',
        format: 'moneyViewFormat',
        isPrimaryKey: true
    },
    {
        name: 'ten_kh',
        title: 'Tên khách hàng',
    },
    {
        name: 'dia_chi',
        title: 'Địa chỉ',
    },
    {
        name: 'ma_so_thue',
        title: 'Mã số thuế',
    }
];

export const DELIVERY_EMPLOYEE_SEACH = [
    {
        name: 'ma_kh',
        title: 'Mã nhân viên',
    },
    {
        name: 'ten_kh',
        title: 'Tên nhân viên',
    }
];

// #region discount

export const DISCOUNT_LIST = [
    {
        name: 'ma_ck',
        title: 'Mã chiết khấu',
        format: 'moneyViewFormat',
        align: 'center'
    },
    {
        name: 'ten_ck',
        title: 'Tên chiết khấu',
    },
    {
        name: 'ngay_bd',
        title: 'Ngày bắt đầu',
        format: 'datetimeFormat',
        dataType: 'date',
        align: 'center'
    },
    {
        name: 'ngay_kt',
        title: 'Ngày kết thúc',
        format: 'datetimeFormat',
        dataType: 'date',
        align: 'center'
    },
    {
        name: 'loai_ck',
        title: 'Loại chiết khấu',
        align: 'center'
    },
    {
        name: 'ten_loai',
        title: 'Tên loại chiết khấu',
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        dataType: 'number',
        format: 'moneyViewFormat',
        align: 'right'
    },
    {
        name: 'tien_qd',
        title: 'Tiền quy đổi',
        dataType: 'number',
        format: 'moneyViewFormat',
        align: 'right'
    }
];

export const DISCOUNT_SELECT = [
    {
        name: 'ma_ck',
        title: 'Mã chiết khấu',
    },
    {
        name: 'ten_ck',
        title: 'Tên chiết khấu',
    },
    {
        name: 'ngay_bd',
        title: 'Ngày bắt đầu',
        format: 'datetimeFormat',
        dataType: 'date',
        align: 'center'
    },
    {
        name: 'ngay_kt',
        title: 'Ngày kết thúc',
        format: 'datetimeFormat',
        dataType: 'date',
        align: 'center'
    },
    {
        name: 'loai_ck',
        title: 'Loại chiết khấu',
    },
    {
        name: 'ten_loai',
        title: 'Tên loại chiết khấu',
    },
    {
        name: 'tien_ck_view',
        title: 'Tiền chiết khấu',
        dataType: 'number',
        format: 'moneyViewFormat2',
        align: 'right'
    }
];
// #endregion discount

//#region MERCHANDISE
export const MERCHANDISE_REPURCHASE_LIST = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ma_loai',
        title: 'Mã loại',
        align: 'center'
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    }
];

export const MERCHANDISE_THU_CU_LIST = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ma_loai',
        title: 'Mã loại',
        align: 'center'
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'gc_td1',
        title: 'Imei xuất bán',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    }
];

export const MERCHANDISE_TELECOM_LIST = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
        isPrimaryKey: true,
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
        align: 'center'
    },
    {
        name: 'no_km_yn',
        title: 'Nợ khuyến mãi',
        type: 'checkbox',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'thanh_toan',
        title: 'Tổng tiền',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
];

export const MERCHANDISE_LIST = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
        align: 'center'
    },
    {
        name: 'no_km_yn',
        title: 'Nợ khuyến mãi',
        type: 'checkbox',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyView2Digit',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'gia_ck',
        title: 'Giá CK',
        format: 'moneyView2Digit',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền (chưa VAT)',
        align: 'right',
        format: 'moneyView2Digit',
        dataType: 'number'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyView2Digit',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        format: 'moneyViewNoDigit',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'thanh_toan',
        title: 'Tổng tiền',
        format: 'moneyViewNoDigit',
        align: 'right',
        dataType: 'number'
    },
];

//THU CŨ ĐỔI MỚI
export const MERCHANDISE_LIST_RENEW = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'imei_mua',
        title: 'Imei thu cũ',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
        align: 'center'
    },
    {
        name: 'no_km_yn',
        title: 'Nợ khuyến mãi',
        type: 'checkbox',
        align: 'center'
    },
    {
        name: 's4',
        title: 'Giá niêm yết',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'gia_ck',
        title: 'Giá CK',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền (chưa VAT)',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'thanh_toan',
        title: 'Tổng tiền',
        format: 'moneyViewNoDigit',
        align: 'right',
        dataType: 'number'
    },
];
//END: thu cũ đổi mới


export const MERCHANDISE_CHANGE = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
        isPrimaryKey: true
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
    },
    {
        name: 'dvt',
        title: 'Đvt',
    },
    {
        name: 'gia_ban',
        title: 'Đơn giá',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'thanh_toan',
        title: 'Tổng tiền',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
];

export const MERCHANDISE_SEARCH = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
        isPrimaryKey: true
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
    },
    {
        name: 'dvt',
        title: 'Đvt',
    },
    {
        name: 'gia_nt2',
        title: 'Đơn giá',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
    },
    {
        name: 'ten_kho',
        title: 'Tên kho',
    }
];

export const MERCHANDISE_LIST_WHOLESALE = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'so_luong_imei',
        title: 'Số lượng Imei',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'thanh_toan',
        title: 'Tổng tiền',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
];

export const MERCHANDISE_CONTRACT = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
];

export const MERCHANDISE_RETURN_LIST = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'ma_kho',
        title: 'Mã kho',
        align: 'center'
    },
    {
        name: 'km_yn',
        title: 'Hàng khuyến mãi',
        type: 'checkbox',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'tien_giam',
        title: 'Tiền phí',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'gia_tra_lai',
        title: 'Giá trả lại',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'thanh_toan',
        title: 'Tổng tiền',
        format: 'moneyViewNoDigit',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'giam_gia_yn',
        title: 'Giảm giá đặc biệt',
        type: 'checkbox',
        align: 'center'
    },
    {
        name: 'ty_le_giam',
        title: 'Tỷ lệ giảm',
        align: 'right',
    },
    {
        name: 'ma_asm_duyet',
        title: 'ASM',
        align: 'center',
    }
];

export const TYPE_MERCHANDISE = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
        isPrimaryKey: true,
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ten_vt2',
        title: 'Tên vật tư 2',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
    }
];

export const MERCHANDISE_LIST_IN_GIFT_REPAY = [ // ===================================== MERCHANDISE_LIST_IN_GIFT_REPAY ========================
    {
        name: 'so_ct',
        title: 'Số hóa đơn',
    },
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'dvt',
        title: 'Đvt',
        align: 'center'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    }
];

// #endregion MERCHANDISE

// #region payment

export const BANK_ACCOUNT_SEARCH = [
    // {
    //     name: 'tknh',
    //     title: 'Số tài khoản',
    //     isPrimaryKey: true,
    // },
    {
        name: 'ten_nh',
        title: 'Tên ngân hàng',
        isPrimaryKey: true
    },
    {
        name: 'tinh_thanh',
        title: 'Tỉnh thành',
    },
    {
        name: 'Số điện thoại',
        title: 'phone',
    },
];

export const INSTALLMENT_UNIT_SEARCH = [
    {
        name: 'ma_dvtg',
        title: 'Mã đơn vị trả góp',
        isPrimaryKey: true
    },
    {
        name: 'ten_dv',
        title: 'Tên đơn vị',
    },
];

export const DEPOSIT_SELECT = [
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'ngay_ct',
        title: 'Ngày chứng từ',
        format: 'datetimeFormat',
        dataType: 'date',
        align: 'center'
    },
    {
        name: 'cl_nt',
        title: 'Tiền cọc',
        type: 'texbox',
        dataType: 'number',
        format: 'moneyViewFormat',
        align: 'right'
    },
    {
        name: 'dien_giai',
        title: 'Diễn giải',
    },
    {
        name: 'ma_ctr',
        title: 'Mã chương trình',
    },
    {
        name: 'ten_ctr',
        title: 'Tên chương trình',
    },
];
// #endregion payment

// #region service
export const SERVICE_LIST = [
    {
        name: 'ma_dv',
        title: 'Mã dịch vụ',
    },
    {
        name: 'ten_dv',
        title: 'Tên dịch vụ',
    },
    {
        name: 'km_yn',
        title: 'Khuyễn mãi',
        type: 'checkbox',
        align: 'center',
    },
    {
        name: 'ma_imei',
        title: 'Mã imei',
    },
    {
        name: 'vt_ton_kho',
        title: 'Theo dõi kho',
        type: 'checkbox',
        align: 'center',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Đơn giá',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tong_tien',
        title: 'Tổng tiền',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    }
];

export const SERVICE_LIST_SALE_RETURN = [
    {
        name: 'ma_dv',
        title: 'Mã dịch vụ',
    },
    {
        name: 'ten_dv',
        title: 'Tên dịch vụ',
    },
    {
        name: 'km_yn',
        title: 'Khuyễn mãi',
        type: 'checkbox',
        align: 'center',
    },
    {
        name: 'ma_imei',
        title: 'Mã imei',
    },
    {
        name: 'vt_ton_kho',
        title: 'Theo dõi kho',
        type: 'checkbox',
        align: 'center',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Đơn giá',
        format: 'moneyViewFormat2',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tien_giam',
        title: 'Tiền phí',
        format: 'moneyViewFormat2',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'gia_tra_lai',
        title: 'Giá trả lại',
        format: 'moneyViewFormat2',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'ck_nt',
        title: 'Tiền chiết khấu',
        format: 'moneyViewFormat2',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        format: 'moneyViewFormat2',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat2',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tong_tien',
        title: 'Tổng tiền',
        format: 'moneyViewFormat2',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'ti_le_giam',
        title: 'Tỷ lệ giảm',
        format: 'moneyViewFormat2',
        dataType: 'number',
        align: 'right'
    }
];

export const SERVICE_CHANGE_LIST = [
    {
        name: 'ma_dv',
        title: 'Mã dịch vụ',
    },
    {
        name: 'ten_dv',
        title: 'Tên dịch vụ',
    },
    {
        name: 'ma_imei_tra',
        title: 'Mã imei trả',
    },
    {
        name: 'ma_imei_doi',
        title: 'Mã imei đổi',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Đơn giá',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tien_ck',
        title: 'Tiền chiết khấu',
        format: 'moneyViewFormat',
        align: 'right',
        dataType: 'number'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tong_tien',
        title: 'Tổng tiền',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    }
];

export const SALE_SERVICE_LIST = [
    {
        name: 'ma_dv',
        title: 'Mã dịch vụ',
    },
    {
        name: 'ten_dv',
        title: 'Tên dịch vụ',
    },
    {
        name: 'vt_ton_kho',
        title: 'Theo dõi kho',
        align: 'center',
        type: 'checkbox',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Giá bán',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'gia_tra_lai',
        title: 'Giá trả lại',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tong_tien',
        title: 'Tổng tiền',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'right'
    }
];

export const SERVICE_ORDER = [
    {
        name: 'so_ct',
        title: 'Số phiếu',
        isPrimaryKey: true
    },
    {
        name: 'ngay_ct',
        title: 'Ngày chứng từ',
        dataType: 'date',
        format: 'datetimeFormat',
    },
    {
        name: 'ma_dvcs',
        title: 'Mã đơn vị',
    },
    {
        name: 'ma_kh',
        title: 'Mã khách',
    },
    {
        name: 'ten_kh',
        title: 'Tên khách hàng',
    },

    {
        name: 'dien_giai',
        title: 'Diễn giải',
    },
    {
        name: 't_tien_nt',
        title: 'Tiền đơn hàng',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
    {
        name: 't_ck_nt',
        title: 'Chiết khấu',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },

    {
        name: 't_thue_nt',
        title: 'Thuế ',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
    {
        name: 't_tt_nt',
        title: 'Thanh toán ',
        align: 'right',
        format: 'moneyViewFormat',
        dataType: 'number'
    },
];
export const SERVICE_SELECT_LIST = [
    {
        name: 'ma_dv',
        title: 'Mã dịch vụ',
    },
    {
        name: 'ten_dv',
        title: 'Tên dịch vụ',
    },
    {
        name: 'vt_ton_kho',
        title: 'Theo dõi kho',
        align: 'center',
        type: 'checkbox',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
        align: 'center'
    },
    {
        name: 'gia_ban',
        title: 'Đơn giá',
        format: 'moneyView2Digit',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center',
        type: 'texbox'
    },
    {
        name: 'thanh_tien',
        title: 'Thành tiền',
        format: 'moneyView2Digit',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất(%)',
        align: 'center'
    },
    {
        name: 'tien_thue',
        title: 'Tiền thuế',
        format: 'moneyView2Digit',
        dataType: 'number',
        align: 'right'
    },
    {
        name: 'tong_tien',
        title: 'Tổng tiền',
        format: 'moneyViewNoDigit',
        dataType: 'number',
        align: 'right'
    },
];

export const SERVICE_SEARCH = [
    {
        name: 'ma_dv',
        title: 'Mã dịch vụ',
        isPrimaryKey: true
    },
    {
        name: 'ten_dv',
        title: 'Tên dịch vụ',
    },
    {
        name: 'vt_ton_kho',
        title: 'Theo dõi kho',
        align: 'center',
        type: 'checkbox',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
        align: 'center'
    },
    {
        name: 'thue_suat',
        title: 'Thuế suất (%)',
        align: 'center'
    }
];
// #endregion service

// #region package
export const PACKAGE_SELECT_LIST = [
    {
        name: 'ten_dv',
        title: 'Danh sách gói cước',
    },
    {
        name: 'dvt',
        title: 'ĐVT',
        align: 'left'
    },
    {
        name: 'gia_ban',
        title: 'Đơn giá',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'left'
    },
    {
        name: 'so_luong',
        title: 'Số lượng',
        align: 'center'
    },
];
// #endregion package
export const PROJECT_SEARCH = [
    {
        name: 'ma_vv',
        title: 'Mã dự án',
        isPrimaryKey: true,
    },
    {
        name: 'ten_vv',
        title: 'Tên dự án',
    },
    {
        name: 'dia_diem',
        title: 'Địa điểm',
    }
];

export const TYPE_INVENTORY = [
    {
        name: 'ma_loai',
        title: 'Mã loại',
        isPrimaryKey: true,
    },
    {
        name: 'ten_loai',
        title: 'Tên loại',
    }
];
export const LIST_ASM = [
    {
        name: 'ma_nvbh',
        title: 'Mã ASM',
        isPrimaryKey: true,
    },
    {
        name: 'ten_nvbh',
        title: 'Tên ASM',
    },
    {
        name: 'ma_bp',
        title: 'Mã bộ phận',
    },
    {
        name: 'ma_cuahang',
        title: 'Mã cửa hàng',
    }
];
export const LIST_BGD = [
    {
        name: 'name',
        title: 'Mã người duyệt',
        isPrimaryKey: true,
    },
    {
        name: 'comment',
        title: 'Tên người duyệt',
    },
    {
        name: 'comment2',
        title: 'Tên người duyệt 2',
    }
];
export const LIST_POS = [
    {
        name: 'ma_pos',
        title: 'Mã máy pos',
        isPrimaryKey: true,
    },
    {
        name: 'ten_pos',
        title: 'Tên máy pos',
    },
    {
        name: 'tk_nganhang',
        title: 'Số tài khoản',
    }
];
export const LIST_PRICE_RENEW = [
    {
        name: 'ma_vt',
        title: 'Mã hàng',
        isPrimaryKey: true,
    },
    {
        name: 'ten_vt',
        title: 'Tên hàng',
    },
    {
        name: 'ma_loai',
        title: 'Mã loại',
    },
    {
        name: 'ten_loai',
        title: 'Tên loại',
    },
    {
        name: 'ma_kh',
        title: 'Mã NCC',
    },
    {
        name: 'ten_kh',
        title: 'Tên NCC',
    },
    {
        name: 'gia_nt',
        title: 'Giá thu cũ',
        format: 'moneyViewFormat',
        dataType: 'number',
        align: 'center'
    },
];
export const GUARANTEE_LIST = [
    {
        name: 'ma_vt',
        title: 'Mã hàng hóa',
        'format': 'moneyViewFormat'
    },
    {
        name: 'ma_imei',
        title: 'Imei',
        align: 'center'
    },
    {
        name: 'hang_sx',
        title: 'Hãng sản xuất',
    },
    {
        name: 'ma_ttbh',
        title: 'Mã trung tâm bảo hành',
        align: 'center'
    },
    {
        name: 'ten_ttbh',
        title: 'Tên trung tâm bảo hành',
    },
    {
        name: 'dia_chi',
        title: 'Địa chỉ',
    }
];

export const PLANS_SELECT_COLUMN = [
    {
        name: 'ma_gc',
        title: 'Mã gói cước',
        isPrimaryKey: true
    }
];

export const IMEI_SEARCH = [
    {
        name: 'ma_imei',
        title: 'Mã imei',
        isPrimaryKey: true
    },
    {
        name: 'ma_vt',
        title: 'Mã vật tư',
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'dvt',
        title: 'Đvt',
    },
    {
        name: 'don_gia',
        title: 'Đơn giá'
    },
];
//======================================================
export const CONTRACT_SEARCH = [
    {
        name: 'so_ct',
        title: 'Số chứng từ',
        isPrimaryKey: true
    },
    {
        name: 'ma_kh',
        title: 'Mã khách',
    },
    {
        name: 'ten_kh',
        title: 'Tên khách hàng',
    },
];

export const WAREHOUSE_LIST = [
    {
        name: 'ma_kho',
        title: 'Mã kho',
        isPrimaryKey: true,
    },
    {
        name: 'ten_kho',
        title: 'Tên kho',
    }
];

export const INVOICE_LIST = [
    {
        name: 'so_ct',
        title: 'Số chứng từ',
        isPrimaryKey: true,
    },
    {
        name: 'ten_vt',
        title: 'Tên vật tư',
    },
    {
        name: 'dvt',
        title: 'Đơn vị tính',
    },
    {
        name: 'ten_ct',
        title: 'Tên chứng từ',
    },
];