import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Result, ResultNoPaging } from '@app/_models/Result';
import { Observable } from 'rxjs';
import { Discount } from '../model/ticket/common-model/discount.model';

const GET_MANY_URL = `${environment.apiUrl}/Category/find/dmck`;
const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/dmck`;
const GET_VOUCHER_SITE = `${environment.apiUrl}/option/getdiscountvouchercode`;
const GET_DISCOUNT_FOR_TICKET = `${environment.apiUrl}/Voucher/calculatediscount/`;
const GET_DISCOUNT_CRM = `${environment.apiUrl}/DiscountCode/get_discount_crm`;
const GET_PROGRAM_CRM = `${environment.apiUrl}/DiscountCode/get_program_crm`;

@Injectable({
    providedIn: 'root'
})
export class DiscountApiService extends ApiService {

    getMany(body: any, param: any): Observable<Result<Discount>> {
        return this.post<Result<Discount>>(GET_MANY_URL, body, param);
    }

    getOneById(body: {}): Observable<ResultNoPaging<Discount>> {
        return this.post<ResultNoPaging<Discount>>(GET_ONE_URL, body);
    }

    getDiscountVoucherCode(ngay_ct: Date): Observable<ResultNoPaging<any>> {
        let url = GET_VOUCHER_SITE;
        url += `?ngay_ct=${ngay_ct.toISOString()}`;
        return this.get<ResultNoPaging<any>>(url);
    }

    getDiscountForTicket(entity: string, merchandises: any[], ma_cuahang: string, ma_kh: string, ngay_lap: string, services: any[] = [], loai_ck: string = '', ma_ct: string = ''): Observable<ResultNoPaging<Discount>> {
        const body = merchandises.map(e => {
            return {
                ma_vt: e.ma_vt,
                ma_imei: e.ma_imei,
                ma_kho: e.ma_kho,
                so_luong: e.so_luong,
                gia_ban: e.gia_vat,
                dv_yn: false
            };
        });
        body.push(...services.map(e => {
            return {
                ma_vt: e.ma_dv,
                ma_imei: e.ma_imei,
                ma_kho: e.ma_kho,
                so_luong: e.so_luong,
                gia_ban: e.gia_vat,
                dv_yn: true
            };
        }));
        let params: any = {
            ma_cuahang,
            ma_kh,
            ngay_lap,
            loai_ck
        };

        if (ma_ct) {
            params.ma_ct = ma_ct;
        }

        const url = GET_DISCOUNT_FOR_TICKET + entity;
        return this.post<ResultNoPaging<Discount>>(url, body, params);
    }

    getDiscountCRM(ma_vt: any, ngay_ct: Date): Observable<ResultNoPaging<any>> {
        return this.get<ResultNoPaging<any>>(GET_DISCOUNT_CRM, { ma_vt: ma_vt, ngay_ct: ngay_ct.toISOString() });
    }

    getProgramCRM(ma_ctr: any, ma_vt: any, ngay_ct: Date): Observable<ResultNoPaging<any>> {
        return this.get<ResultNoPaging<any>>(GET_PROGRAM_CRM, { ma_ctr: ma_ctr, ma_vt: ma_vt, ngay_ct: ngay_ct.toISOString() });
    }
}
