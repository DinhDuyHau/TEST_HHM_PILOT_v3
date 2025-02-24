import { Injectable } from '@angular/core';
import { Resource } from '@app/_models';

@Injectable({
    providedIn: 'root',
})
export class Language {

    currentLanguage = 'vi_VN';

    setLanguage(value: string) {
        this.currentLanguage = value;
    }

    constructor() {
        this.init();
    }

    init() {
        let resources: Resource[] = JSON.parse(localStorage.getItem('resources') || '');
        resources = resources.map((e: any) => {
            if (this.currentLanguage === 'vi_VN') {
                e[`${e.name}`] = e.message;
            } else {
                e[`${e.name}`] = e.message2;
            }
            delete e.message;
            delete e.message2;
            delete e.name;
            return e;
        });

        resources = resources.reduce((pre: any, cur: any) => Object.assign(pre, cur), {});
        Object.keys(resources).forEach((key: any) => {
            (Language.content as any)[key] = resources[key];
        });
    }

    getMessage(name: string, ...args: any[]) {
        let message = (Language.content as any)[name];
        args.forEach((e) => {
            const rs = message.match(/%\S+/)[0];
            message = message.replace(rs, e);
        });
        return message;
    }
    getMessageAdvance(name: string, ...args: any[]) {
        let message = (Language.content as any)[name] || '';

        args.forEach((e) => {
            message = message.replaceAll(e.name, e.value);
        });
        return message;
    }
    prepareMessage(content: string, ...args: any[]) {
        let message = content as any;
        args.forEach((e) => {
            const rs = message && message.match(/%\S+/)[0];
            message = message.replace(rs, e);
        });
        return message;
    }

    static content = {
        add_new: '',
        agree: '',
        edit: '',
        view: '',
        exists_customer_yn_no: '',
        exists_pos_yn_no: '',
        Successful_Change_Promotion: '',
        Failed_Change_Promotion: '',
        No_promotional_items_found: '',
        Successfully_delete_service: '',
        Staff_not_exist: '',
        Missing_information: 'Chưa nhập đủ thông tin hoặc dữ liệu không hợp lệ.',
        No_image: '',
        grid_merchandise_invalid: 'Giá trị các trường số lượng, giá, tiền trong chi tiết hàng hóa không hợp lệ.',
        grid_service_invalid: 'Giá trị các trường số lượng, giá, tiền trong chi tiết dịch vụ không hợp lệ.',
        invalid_ma_nvvc: 'Chưa chọn nhân viên vận chuyển',
        invalid_so_dh_vc: 'Chưa nhập mã đơn hàng',
        invalid_ma_van_don: 'Chưa nhập mã vận đơn',
        invalid_ma_kh: 'Mã khách hàng có chứa ký tự đặc biệt',


        all: '',
        Already_exist_Cannot_create: '',
        amount: '',
        amount_count: '',
        approve: '',
        approved: '',
        barcode_tran_invalid: '',
        cancel: '',
        category: '',
        change_screen: '',
        close: '',
        confirm_delete: '',
        create_draft_invoice_success: '',
        customer: '',
        dat_hang_yn_no: '',
        dat_hang_yn_yes: '',
        database_is_expired: '',
        date_founded: '',
        decimal: '',
        decimal_count: '',
        Delete_Completed: '',
        dieu_chuyen_yn_no: '',
        dieu_chuyen_yn_yes: '',
        england: '',
        enter_stock: '',
        error_code: '',
        error_when_insert_table: '',
        exist_code: '',
        exists_yn_no: '',
        exists_yn_yes: '',
        exit: '',
        export: '',
        features: '',
        format_date: '',
        format_money: '',
        from_date: '',
        get_published_invoice_success: '',
        in_store_yn_no: '',
        in_store_yn_yes: '',
        input_code: '',
        input_customer: '',
        Input_data_invalid: '',
        input_node: '',
        input_supplies: '',
        invalid_user_password: '',
        language: '',
        list_enter_stock: '',
        list_export: '',
        login: '',
        _report: '',
        no_action: '',
        not_code: '',
        Not_Exist_or_Denied: '',
        not_have_permission_to_delete: '',
        not_have_permission_to_update: '',
        not_support_barcode: '',
        note: '',
        null_result: '',
        number_sheet: '',
        order: '',
        order_code: '',
        order_success: '',
        pass_word: '',
        perform: '',
        price: '',
        products: '',
        quantity: '',
        quantity_count: '',
        remember: '',
        remove: '',
        report: '',
        Runtime_err: '',
        upload_sucess: '',
        runtime_error_when_delete: '',
        runtime_error_when_update: '',
        save: '',
        save_setting: '',
        scan_supplies: '',
        search: '',
        select_column: '',
        select_unit: '',
        setting_success: '',
        status: '',
        status_changed_cannot_delete: '',
        status_changed_cannot_edit: '',
        status_changed_cannot_update: '',
        Successful_Create: '',
        sum_number_sheet: '',
        supplies: '',
        tax_code: '',
        tax_count: '',
        tax_percent: '',
        thousands: '',
        to_date: '',
        trans_number: '',
        trans_type: '',
        un_approve: '',
        un_approved: '',
        unit: '',
        unit_code: '',
        Unknown_err: '',
        Update_Completed: '',
        user_: '',
        user_role_rejected: '',
        vc_date: '',
        vc_number: '',
        vietnam: '',
        voucher_not_exists: '',
        xuat_yn_no: '',
        xuat_yn_yes: '',
        duplicated_so_ct: '',


    };
}










