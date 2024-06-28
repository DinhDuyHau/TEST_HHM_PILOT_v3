import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { Result, ResultDetailVoucher, ResultNoPaging } from '@app/_models/Result';
import { Observable, of } from 'rxjs';

const GET_MANY_URL = `${environment.apiUrl}/Category/find/dmkh`;
const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/dmkh`;
const CREATE_ONE_URL = `${environment.apiUrl}/category/addnew/dmkh`;
const UPLOAD_IMAGE_CUSTOMER = `${environment.apiUrl}/upload/save_customer_image`;
const GET_PAYMENT_DEPOSIT_URL = `${environment.apiUrl}/customer/get_payment_deposit`;
const getConversionPoint_URL = `${environment.apiUrl}/customer/get_conversion_point`;

@Injectable({
    providedIn: 'root'
})
export class CustomerApiService extends ApiService {

    findById(body: any, page_index: number, page_size: number): Observable<Result<Customer>> {
        return this.post<Result<Customer>>(GET_MANY_URL, body, { page_index, page_size });
    }

    getOneById(ma_kh: string): Observable<ResultNoPaging<Customer>> {
        const body = {
            name: 'ma_kh',
            operator: '=',
            value: ma_kh
        };
        return this.post<ResultNoPaging<Customer>>(GET_ONE_URL, body);
    }

    create(body: {}): Observable<ResultNoPaging<boolean>> {
        const url = CREATE_ONE_URL;
        return this.post<ResultNoPaging<boolean>>(url, body);
    }

    getDeposit(ma_kh: string, ma_dvcs: string, ngay_ct: string): Observable<ResultNoPaging<any>> {
        return this.get<ResultNoPaging<any>>(GET_PAYMENT_DEPOSIT_URL, { ma_kh, ma_dvcs, ngay_ct });
    }

    getConversionPoint(ma_kh: string, ngay_ct: string) {
        return this.get<any>(getConversionPoint_URL, { ma_kh, ngay_ct });
    }

    uploadImage(formData: FormData): Observable<ResultDetailVoucher<string>> {
        return this.post<any>(UPLOAD_IMAGE_CUSTOMER, formData);
    }
}