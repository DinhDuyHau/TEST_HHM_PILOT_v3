import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { Result, ResultNoPaging } from '@app/_models/Result';
import { Observable } from 'rxjs';
import { Service } from '../model/ticket/common-model/service.model';

const GET_MANY_URL = `${environment.apiUrl}/Category/find/dmdichvu`;
const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/dmdichvu`;
const GET_MANY_TYPE_Service_URL = `${environment.apiUrl}/category/find/dmloaikho`;
const GET_MANY_WAREHOUSE_URL = `${environment.apiUrl}/category/find/dmkho`;

@Injectable({
    providedIn: 'root'
})
export class ServiceApiService extends ApiService {

    getMany(body: {}): Observable<Result<Service>> {
        return this.post<Result<Service>>(GET_MANY_URL, body);
    }

    getManyTypeMerchadise(body: {}): Observable<Result<any>> {
        return this.post<Result<any>>(GET_MANY_TYPE_Service_URL, body);
    }

    getOneById(ma_dv: string): Observable<ResultNoPaging<Service>> {
        const body = {
            name: 'ma_dv',
            operator: '=',
            value: ma_dv
        };
        return this.post<ResultNoPaging<Service>>(GET_ONE_URL, body);
    }

    getManyWarehouse(body: {}): Observable<Result<Service>> {
        return this.post<Result<Service>>(GET_MANY_WAREHOUSE_URL, body);
    }
}