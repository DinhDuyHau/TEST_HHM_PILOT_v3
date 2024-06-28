import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { getResource } from '@app/_common/commonFunction';

@Injectable({ providedIn: 'root' })
export class ReportService {
    constructor(private http: HttpClient) { }

    getPdfVoucher(key: string, controller: string, form_id: string) {
        return this.http.get<any[]>(`${environment.apiUrl}/report/get_pdf_voucher?key=${key}&controller=${controller}&form_id=${form_id}`
        );
    }
}