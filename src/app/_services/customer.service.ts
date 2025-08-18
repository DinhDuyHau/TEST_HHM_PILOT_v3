import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { getResource } from '@app/_common/commonFunction';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    constructor(private http: HttpClient) { }

    getPaymentDebit(ma_kh: string, ma_dvcs: string, ngay_ct: Date) {
        return this.http.get<any[]>(`${environment.apiUrl}/customer/get_payment_debit?ma_kh=${ma_kh}&ma_dvcs=${ma_dvcs}&ngay_ct=${ngay_ct.toISOString()}`);
    }
    getPaymentDeposit(ma_kh: string, ma_dvcs: string, ngay_ct: string) {
        return this.http.get<any[]>(`${environment.apiUrl}/customer/get_payment_deposit?ma_kh=${ma_kh}&ma_dvcs=${ma_dvcs}&ngay_ct=${ngay_ct}`);
    }
    getConversionPoint(ma_kh: string, ngay_ct: string) {
        return this.http.get<any>(`${environment.apiUrl}/customer/get_conversion_point?ma_kh=${ma_kh}&ngay_ct=${ngay_ct}`);
    }
    getInfoMobiphoneByShop(shop: string) {
        return this.http.get<any>(`${environment.apiUrl}/customer/get_info_mobiphone_by_shop/${shop}`);
    }
}
