import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Result, ResultNoPaging } from '@app/_models/Result';
import { Observable, catchError, of } from 'rxjs';
import { ImeiInfo, ImeiState } from '../model/dto/imei-state.dto';
import { Imei } from '../model/common/imei.model';

const GET_MANY_URL = `${environment.apiUrl}/Category/find/imei`;
const GET_ONE_URL = `${environment.apiUrl}/imei/getinstore`;
const GET_IMEI_RENEW_URL = `${environment.apiUrl}/imei/get_price_renew`;
const GET_MANY_BY_ID_URL = `${environment.apiUrl}/imei/filter`;
const GET_IMEI_LIST_IN_STORE = `${environment.apiUrl}/imei/getbyitem`;
const UPDATE_STATE_IMEI_URL = `${environment.apiUrl}/imei/upsaleorder`;
const GET_IMEI_STATE_URL = `${environment.apiUrl}/imei/getstate`;
const GET_IMEI_STATE_AND_ITEM_URL = `${environment.apiUrl}/imei/get_state_and_item`;
const GET_SOLD_INFO_IMEI_URL = `${environment.apiUrl}/imei/soldinfo`;

@Injectable({
    providedIn: 'root'
})
export class ImeiApiService extends ApiService {

    getMany(body: {}): Observable<Result<Imei>> {
        return this.post<Result<Imei>>(GET_MANY_URL, body);
    }

    getImeiInStore(ma_imei: string, ma_cuahang: string, ma_ct: string): Observable<ResultNoPaging<Imei>> {
        ma_imei = encodeURIComponent(ma_imei);
        return this.get<ResultNoPaging<Imei>>(GET_ONE_URL, { ma_imei, ma_cuahang, ma_ct });
    }
    getImeiRenew(ma_imei: string, ma_cuahang: string, ma_ncc: string, list_vt: string[], imei_thu_cu: string = ''): Observable<ResultNoPaging<Imei>> {
        ma_imei = encodeURIComponent(ma_imei);
        return this.post<ResultNoPaging<Imei>>(GET_IMEI_RENEW_URL, { ma_imei, ma_cuahang, ma_ncc, list_vt, imei_thu_cu });
    }
    getOneById(body: {}): Observable<ResultNoPaging<Imei>> {
        return this.post<ResultNoPaging<Imei>>(GET_ONE_URL, body);
    }

    getImeisById(ma_imei: string): Observable<Result<Imei>> {
        ma_imei = encodeURIComponent(ma_imei);
        return this.get<Result<Imei>>(GET_MANY_BY_ID_URL, { key: ma_imei });
    }

    getImeis(page_index: number, page_size: number, ma_vt: string, ma_ct: string): Observable<Result<Imei>> {
        return this.get<Result<Imei>>(GET_IMEI_LIST_IN_STORE, { ma_vt, ma_ct, page_index, page_size });
    }

    getImeisV2(page_index: number, page_size: number, ma_vt: any, ten_vt: any, ma_imei: any, ma_kho: any, ma_ct: string): Observable<Result<Imei>> {
        return this.get<Result<Imei>>(GET_IMEI_LIST_IN_STORE, { ma_vt, ten_vt, ma_imei, ma_kho, ma_ct, page_index, page_size });
    }

    updateImeiState(imeis: string[], state: boolean, nxt = 2): Observable<ResultNoPaging<ImeiState>> {
        imeis = imeis.map((item) => encodeURIComponent(item));
        return this.post<ResultNoPaging<ImeiState>>(UPDATE_STATE_IMEI_URL, { imeis, state, nxt });
    }

    getImeisState(imeis: string[]): Observable<ResultNoPaging<ImeiState>> {
        imeis = imeis.map((item) => encodeURIComponent(item));
        return this.post<ResultNoPaging<ImeiState>>(GET_IMEI_STATE_URL, imeis);
    }
    getImeisStateAndItem(imeis: string[]): Observable<ResultNoPaging<ImeiInfo>> {
        imeis = imeis.map((item) => encodeURIComponent(item));
        return this.post<ResultNoPaging<ImeiInfo>>(GET_IMEI_STATE_AND_ITEM_URL, imeis);
    }


    getSoldInfo(ma_imei: string, ma_cuahang: string, ma_ct = '', rate = -1, tien_giam = 0, loai_tra_lai = ''): Observable<ResultNoPaging<Imei>> {
        ma_imei = encodeURIComponent(ma_imei);
        if (rate == -1 && tien_giam == 0) {
            return this.get<ResultNoPaging<Imei>>(GET_SOLD_INFO_IMEI_URL, { ma_imei, ma_cuahang, ma_ct, loai_tra_lai });
        }
        else {
            return this.get<ResultNoPaging<Imei>>(GET_SOLD_INFO_IMEI_URL, { ma_imei, ma_cuahang, ma_ct, rate, tien_giam, loai_tra_lai });
        }
    }

    async getImeisState_200(imeis: string[]): Promise<Observable<ResultNoPaging<ImeiState>>> {
        imeis = imeis.map((item) => encodeURIComponent(item));
        return this.post<ResultNoPaging<ImeiState>>(GET_IMEI_STATE_URL, imeis);
    }
}   