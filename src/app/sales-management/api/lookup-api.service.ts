import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Customer } from '@app/_components/category/customer/customer.model';
import { Result, ResultDetailVoucher, ResultNoPaging } from '@app/_models/Result';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, lastValueFrom, map, of, switchMap } from 'rxjs';
import { LookupData } from '@app/_components/lookupV2/lookup-v2.model';

const GET_ONE_URL = `${environment.apiUrl}/category/getbyid/$%itemCode`

@Injectable({
    providedIn: 'root'
})
export class LookupApiService extends ApiService {
    private _controller: string = '';

    public set controller(name: string) {
        this._controller = name.trim();
    }

    async getOneById(id: string): Promise<any> {
        if (!this._controller || this._controller === '') return null;

        let result: any = null;
        const url = GET_ONE_URL.replace('$%itemCode', this._controller);
        const randomParam = new Date().getTime();
        const res: any = await lastValueFrom(this.get<LookupData>(`assets/control-lookup/${this._controller}.json?r=${randomParam}`).pipe(
            catchError((error: any) => {
                return of(false);
            }),
            map((res) => {
                return res;
            })));

        if (res) {
            const body = {
                name: res.code,
                operator: "=",
                value: id
            };
            result = this.post<ResultNoPaging<any>>(url, body);
        }
        return result;
    }

}
