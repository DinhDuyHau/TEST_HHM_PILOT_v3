import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const VOUCHER_CHECK = `${environment.apiUrlVoucherHHM}/api/genbyte/vouchercheck`;

@Injectable({
    providedIn: 'root'
})
export class VoucherCodeApiService extends ApiService {
    voucherCheck(body: {}, headers: any): Observable<any> {
        return this.postWithHeader<any>(VOUCHER_CHECK, body, null, headers);
    }
}
