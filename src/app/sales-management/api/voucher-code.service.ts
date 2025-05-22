import { environment } from '@environments/environment';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const VOUCHER_CHECK = `${environment.apiUrl}/VoucherWebsite/check`;

@Injectable({
    providedIn: 'root'
})
export class VoucherCodeApiService extends ApiService {
    voucherCheck(body: {}): Observable<any> {
        return this.post<any>(VOUCHER_CHECK, body, null);
    }
}
