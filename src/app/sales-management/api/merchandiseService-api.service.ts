import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { Result, ResultNoPaging } from '@app/_models/Result';
import { Observable } from 'rxjs';
import { Discount } from '../model/ticket/common-model/discount.model';
import { Service } from '../model/ticket/common-model/service.model';

const GET_BY_ID_URL = `${environment.apiUrl}/category/find/dmdichvu`;
const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/dmdichvu`;
const GET_SERVICE_PRICE_URL = `${environment.apiUrl}/price/getserviceprice`;
const GET_KEY_OF_SERVICE_URL = `${environment.apiUrl}/service/get_key_service`;

@Injectable({
    providedIn: 'root'
})
export class MerchandiseServiceApiService extends ApiService {

    findById(body: any, page_index: number, page_size: number): Observable<Result<Service>> {
        return this.post<Result<Service>>(GET_BY_ID_URL, body, { page_index, page_size });
    }

    getServicePrice(ma_vt: string, ma_dichvu: string, ma_cuahang: string, gia_ban = 0): Observable<ResultNoPaging<Service>> {
        return this.get<ResultNoPaging<Service>>(GET_SERVICE_PRICE_URL, { ma_vt, ma_dichvu, ma_cuahang, gia_ban });
    }

    getKeyOfService(ma_dichvu: string, so_luong = 1): Observable<ResultNoPaging<Service>> {
        return this.get<ResultNoPaging<Service>>(GET_KEY_OF_SERVICE_URL, { ma_dichvu, so_luong });
    }

    getOneById(ma_dv: string): Observable<ResultNoPaging<Service>> {
        const body = {
            name: 'ma_dv',
            operator: '=',
            value: ma_dv
        };
        return this.post<ResultNoPaging<Service>>(GET_ONE_URL, body);
    }
}