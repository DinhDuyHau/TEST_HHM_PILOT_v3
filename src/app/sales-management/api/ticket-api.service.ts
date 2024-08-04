import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Result, ResultNoPaging, ResultNoPagingCategory } from '@app/_models/Result';
import { Observable } from 'rxjs';
import { StatusTicket } from '../model/common/status.model';
import { VoucherDto } from '../model/ticket/common-model/voucher.dto.model';
import { ItemFilter } from '../component/search/serach-dialog.component';

const GET_TOP_URL = `${environment.apiUrl}/voucher/gettop/`;
const GET_TOP_EXT_URL = `${environment.apiUrl}/voucher/gettopext/`;
const GET_MANY_URL = `${environment.apiUrl}/voucher/gettop/`;
const GET_VOUCHER_BY_ID_URL = `${environment.apiUrl}/voucher/getbyid/`;
const DELETE_ONE_URL = `${environment.apiUrl}/voucher/delete/`;
const CREATE_ONE_URL = `${environment.apiUrl}/voucher/addnew/`;
const GET_STATUS_TICKET_URL = `${environment.apiUrl}/category/find/dmttct`;
const GET_VOUCHER_NUMBER_URL = `${environment.apiUrl}/voucher/getnumber/`;
const GET_VOUCHER_INFOMATION_URL = `${environment.apiUrl}/voucher/getVoucherInfomation/`;
const DELETE_VOUCHER_URL = `${environment.apiUrl}/voucher/delete/`;
const ADD_NEW_VOUCHER_URL = `${environment.apiUrl}/voucher/addnew/`;
const UPDATE_VOUCHER_URL = `${environment.apiUrl}/voucher/update/`;
const GET_PROJECTS_URL = `${environment.apiUrl}/category/find/dmvv`;
const GET_PACKAGES_URL = `${environment.apiUrl}/voucher/getpackages/`;
const GET_STOCKS_URL = `${environment.apiUrl}/voucher/getstocks/`;
const GET_OTHERINFOS_URL = `${environment.apiUrl}/voucher/getOtherInfos/`;
const GET_DEBIT_BY_CUSTOMER_URL = `${environment.apiUrl}/Voucher/getDebitByCustomer/`;
const GET_TICKET_QUERY_URL = `${environment.apiUrl}/Voucher/find/`;
const GET_TICKET_QUERY_EXT_URL = `${environment.apiUrl}/Voucher/findext/`;
const GET_TICKET_QUICK_SEARCH_URL = `${environment.apiUrl}/Voucher/quicksearch/`;
const UPDATE_FORM_URL = `${environment.apiUrl}/Voucher/updateform/`;
const GET_MENU_REPORT_URL = `${environment.apiUrl}/report/get_menu_report/`;
const GET_PDF_VOUCHER_URL = `${environment.apiUrl}/report/get_pdf_voucher`;
const GET_POINT_RATE_EXCHANGE = `${environment.apiUrl}/option/get_point_rate_exchange`;
const GET_OPTOPNS_SALE = `${environment.apiUrl}/option/get_option`;
const GET_POINT_RATE_EXCHANGE_REVERSE = `${environment.apiUrl}/option/get_rate_exchange_reverse`;
const GET_ASM_LIST = `${environment.apiUrl}/employee/get_list_asm`;
const GET_ASM_BY_ID = `${environment.apiUrl}/employee/get_asm_by_id`;
const GET_BGD_LIST = `${environment.apiUrl}/employee/get_list_approver_discount`;
const GET_BGD_BY_ID = `${environment.apiUrl}/employee/get_approver_discount_by_id`;
const GET_EMPLOYEE_BY_NAME = `${environment.apiUrl}/employee/get_employee_by_name`;
const GET_DEPARTMENT_BY_NAME = `${environment.apiUrl}/employee/get_department_by_name`;
const SEND_EMAIL_SERVICE = `${environment.apiUrl}/service/send_email`;
const GET_PRICE_RENEW = `${environment.apiUrl}/price/get_renew_price`;
const GET_STOCK_BY_SHOP = `${environment.apiUrl}/category/find/dmkho`;
const GET_SOLD_SERVICE_ORDER = `${environment.apiUrl}/service/get_sold_service_order`;
const GET_SOLD_SERVICE_ORDERS = `${environment.apiUrl}/service/get_sold_service_orders`;
const GET_VOUCHER_STATUS_URL = `${environment.apiUrl}/voucher/getvoucherstatus/`;

@Injectable({
    providedIn: 'root'
})
export class TicketApiService extends ApiService {

    getMany(entity: string, params: {}): Observable<Result<any>> {
        const url = GET_MANY_URL + entity;
        return this.get<Result<any>>(url, params);
    }

    deleteOne(entity: string, voucherId: string): Observable<ResultNoPaging<boolean>> {
        const url = DELETE_ONE_URL + entity;
        const params = {
            voucherId: voucherId
        };
        return this.delete<ResultNoPaging<boolean>>(url, {}, params);
    }

    create(entity: string, body: {}): Observable<ResultNoPaging<boolean>> {
        const url = CREATE_ONE_URL + entity;
        return this.post<ResultNoPaging<boolean>>(url, body);
    }

    getStatus(body: {}): Observable<Result<StatusTicket>> {
        return this.post<Result<StatusTicket>>(GET_STATUS_TICKET_URL, body);
    }

    getVoucherNumber(entity: string): Observable<ResultNoPaging<string>> {
        const url = GET_VOUCHER_NUMBER_URL + entity;
        return this.get<ResultNoPaging<string>>(url);
    }

    getVoucherStatus(entity: string, id: string): Observable<ResultNoPaging<any>> {
        const url = GET_VOUCHER_STATUS_URL + entity;
        return this.get<ResultNoPaging<any>>(url, { id });
    }

    getTop(entity: string): Observable<ResultNoPaging<any>> {
        let url = GET_TOP_URL + entity;
        if (["ITTran_PXB2", "IPTran_PNF2", "KKTran"].includes(entity)) {
            url = GET_TOP_EXT_URL + entity
        }
        return this.get<ResultNoPaging<any>>(url);
    }

    getVoucherByid(entity: string, id: string): Observable<ResultNoPaging<VoucherDto>> {
        const url = GET_VOUCHER_BY_ID_URL + entity;
        return this.get<ResultNoPaging<VoucherDto>>(url, { id });
    }

    deleteVoucherById(entity: string, id: string): Observable<ResultNoPaging<boolean>> {
        const url = DELETE_VOUCHER_URL + entity;
        return this.post<ResultNoPaging<boolean>>(url, { id });
    }

    addNewVoucher(entity: string, ticket: any): Observable<ResultNoPaging<any>> {
        const url = ADD_NEW_VOUCHER_URL + entity;
        return this.post<ResultNoPaging<any>>(url, ticket);
    }

    updateVoucher(entity: string, ticket: any): Observable<ResultNoPaging<any>> {
        const url = UPDATE_VOUCHER_URL + entity;
        return this.put<ResultNoPaging<any>>(url, ticket);
    }

    getVoucherInfomation(entity: string, id: string): Observable<ResultNoPagingCategory<any>> {
        const url = GET_VOUCHER_INFOMATION_URL + entity;
        return this.get<ResultNoPagingCategory<any>>(url, { id });
    }

    getProjects(body: any, page_index: number, page_size: number): Observable<Result<any>> {
        const url = GET_PROJECTS_URL;
        return this.post<Result<any>>(url, body, { page_index, page_size });
    }

    getPackages(entity: string): Observable<ResultNoPaging<any>> {
        const url = GET_PACKAGES_URL + entity;
        return this.get<ResultNoPaging<any>>(url);
    }

    getStocks(entity: string, params: {}): Observable<ResultNoPaging<any>> {
        const url = GET_STOCKS_URL + entity;
        return this.get<ResultNoPaging<any>>(url, params);
    }

    getOtherInfos(entity: string, params: {}): Observable<ResultNoPaging<any>> {
        const url = GET_OTHERINFOS_URL + entity;
        return this.get<ResultNoPaging<any>>(url, params);
    }
    getSoldServiceOrder(params: {}): Observable<ResultNoPaging<any>> {
        const url = GET_SOLD_SERVICE_ORDER;
        return this.get<ResultNoPaging<any>>(url, params);
    }
    getSoldServiceOrders(params: {}): Observable<ResultNoPaging<any>> {
        const url = GET_SOLD_SERVICE_ORDERS;
        return this.get<ResultNoPaging<any>>(url, params);
    }

    getDebitByCustomer(params: {}): Observable<ResultNoPaging<any>> {
        const url = GET_DEBIT_BY_CUSTOMER_URL;
        return this.get<ResultNoPaging<any>>(url, params);
    }

    getTicketByQuery(entity: string, params: {}, page_index: number, page_size: number): Observable<Result<any>> {
        let url = GET_TICKET_QUERY_URL + entity;

        if (["ITTran_PXB2", "IPTran_PNF2"].includes(entity)) {
            url = GET_TICKET_QUERY_EXT_URL + entity;
        }
        return this.post<Result<any>>(url, {}, { ...params, page_index, page_size });
    }

    getTicketByQuickSearch(entity: string, params: {}, page_index: number, page_size: number): Observable<Result<any>> {
        const url = GET_TICKET_QUICK_SEARCH_URL + entity;
        return this.post<Result<any>>(url, {}, { ...params, page_index, page_size });
    }

    //add multiple language
    addNewResource(body: any) {
        const url = `${environment.apiUrl}/category/addnew/resources`;
        return this.post(url, body);
    }

    updateFormMobifone(entity: string, params: {}): Observable<Result<any>> {
        const url = UPDATE_FORM_URL + entity;
        return this.put<Result<any>>(url, {}, params);
    }

    getMenuReport(entity: string): Observable<ResultNoPaging<any>> {
        const url = GET_MENU_REPORT_URL + entity;
        return this.get<ResultNoPaging<any>>(url);
    }

    getPdfVoucher(params: {}): Observable<ResultNoPaging<any>> {
        const url = GET_PDF_VOUCHER_URL;
        return this.get<ResultNoPaging<any>>(url, params);
    }
    getSaleOptions(): Observable<ResultNoPaging<any>> {
        const url = GET_OPTOPNS_SALE;
        return this.get<ResultNoPaging<any>>(url);
    }
    getPointRateExchange(): Observable<ResultNoPaging<any>> {
        const url = GET_POINT_RATE_EXCHANGE;
        return this.get<ResultNoPaging<any>>(url);
    }
    getPointRateExchangeReverse(): Observable<ResultNoPaging<any>> {
        const url = GET_POINT_RATE_EXCHANGE_REVERSE;
        return this.get<ResultNoPaging<any>>(url);
    }
    getASM(params: ItemFilter[], page_index: number, page_size: number): Observable<ResultNoPaging<any>> {
        let ma_nvbh = '';
        if (params) {
            params.forEach((item: ItemFilter) => {
                if (item.name == 'ma_nvbh') {
                    ma_nvbh = item.value.replaceAll('%', '');
                }
            });
        }
        const url = GET_ASM_LIST + `?ma_nvbh=${ma_nvbh}&page_index=${page_index}&page_size=${page_size}`;
        return this.get<ResultNoPaging<any>>(url);
    }
    getASMOneById(ma_nvbh: string): Observable<ResultNoPaging<any>> {
        const url = GET_ASM_BY_ID + `?ma_nvbh=${ma_nvbh}`;
        return this.get<ResultNoPaging<any>>(url);
    }

    getBGD(params: ItemFilter[], page_index: number, page_size: number): Observable<ResultNoPaging<any>> {
        let name = '';
        if (params) {
            params.forEach((item: ItemFilter) => {
                if (item.name == 'name') {
                    name = item.value.replaceAll('%', '');
                }
            });
        }
        const url = GET_BGD_LIST + `?name=${name}&page_index=${page_index}&page_size=${page_size}`;
        return this.get<ResultNoPaging<any>>(url);
    }
    getBGDOneById(name: string): Observable<ResultNoPaging<any>> {
        const url = GET_BGD_BY_ID + `?name=${name}`;
        return this.get<ResultNoPaging<any>>(url);
    }

    getEmployeeByUsername(username: string, ma_cuahang: string): Observable<ResultNoPaging<any>> {
        const url = GET_EMPLOYEE_BY_NAME + `?username=${username}&ma_cuahang=${ma_cuahang}`;
        return this.get<any>(url);
    }
    getDepartmentByUsername(ma_kh: string, ma_cuahang: string): Observable<ResultNoPagingCategory<any>> {
        const url = GET_DEPARTMENT_BY_NAME + `?ma_kh=${ma_kh}&ma_cuahang=${ma_cuahang}`;
        return this.get<any>(url);
    }

    sendEmailService(stt_rec: string): Observable<ResultNoPaging<any>> {
        const url = SEND_EMAIL_SERVICE + `?stt_rec=${stt_rec}`;
        return this.post<ResultNoPaging<any>>(url, {});
    }

    getRenewPrice(ma_vt: string, ma_cuahang: string, ma_ncc: string): Observable<ResultNoPaging<any>> {
        const url = GET_PRICE_RENEW + `?ma_vt=${ma_vt}&ma_cuahang=${ma_cuahang}&ma_ncc=${ma_ncc}`;
        return this.get<ResultNoPaging<any>>(url);
    }

    getStockRenew(ma_cuahang: string, ma_loai: string): Observable<Result<any>> {
        return this.post<Result<any>>(GET_STOCK_BY_SHOP, [{ name: 'ma_cuahang', operator: '=', value: ma_cuahang }, { name: 'ma_loai', operator: '=', value: ma_loai }]);
    }
}