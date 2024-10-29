import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { getResource } from '@app/_common/commonFunction';
import { ImeiState } from '@app/_models';
import { ImeiInfo } from '@app/sales-management/model/dto/imei-state.dto';
import { ResultNoPaging } from '@app/_models/Result';

@Injectable({ providedIn: 'root' })
export class IMEIService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(`${environment.apiUrl}/users`);
    }

    checkExists(imei: string) {
        return this.http.get<any[]>(`${environment.apiUrl}/imei/check_exists?ma=${imei}`);
    }
    fakeCheckExists(imei: string) {
        const random = Math.round(Math.random() * 100);
        return of(random % 2 === 0 ? true : false);
    }
    getImeiInfo(ma_imei: string, ma_cuahang: string, ma_ct: string) {
        return this.http.get<any>(`${environment.apiUrl}/imei/getinstore?ma_imei=${ma_imei}&ma_ct=${ma_ct}&ma_cuahang=${ma_cuahang}`);
    }
    getListImeiState(ma_imei: string[]) {
        return this.http.post<ResultNoPaging<ImeiState>>(`${environment.apiUrl}/imei/getstate`,
            ma_imei
        );
    }
    getListImeiInfo(ma_imei: string[], ma_kho?: string) {
        let url = `${environment.apiUrl}/imei/get_state_and_item`;
        if (ma_kho && ma_kho !== '') url += `?ma_kho=${ma_kho}`
        return this.http.post<ResultNoPaging<ImeiInfo>>(url,
            ma_imei
        );
    }

    getSingleImeiInfo(ma_imei: string, ma_kho?: string) {
        let url = `${environment.apiUrl}/imei/get_single_imei_state`;
        if (ma_kho && ma_kho !== '') url += `?ma_kho=${ma_kho}&imei=${ma_imei}`
        return this.http.get<ResultNoPaging<ImeiInfo>>(url);
    }

    getSoldInfo(ma_imei: string, ma_cuahang: string) {
        return this.http.get<any>(`${environment.apiUrl}/imei/soldinfo?ma_imei=${ma_imei}&ma_cuahang=${ma_cuahang}`);
    }

    getWarrantyOutInfo(ma_imei: string, ma_cuahang: string) {
        return this.http.get<any>(`${environment.apiUrl}/imei/warranty-out-info?ma_imei=${ma_imei}&ma_cuahang=${ma_cuahang}`);
    }

    setUpSaleOrder(ma_imei: string[], state: boolean, nxt: number, ma_ct?: string) {
        return this.http.post<any>(`${environment.apiUrl}/imei/upsaleorder`,
            {
                imeis: ma_imei,
                nxt: nxt,
                state: state,
                ma_ct: ma_ct
            }
        );
    }
    GetMessageStatusImei(status: Map<string, boolean>, state: ImeiState) {
        let res = '';
        let flag = false;
        status.forEach((value, key) => {
            if (state[key] !== value && !flag) {
                if (value == false) {
                    res = getResource(key + '_yes').replace('%imei', state.ma_imei || '');
                    flag = true;
                } else {
                    res = getResource(key + '_no').replace('%imei', state.ma_imei || '');
                    flag = true;
                }
            }
        });
        return res;
    }
}