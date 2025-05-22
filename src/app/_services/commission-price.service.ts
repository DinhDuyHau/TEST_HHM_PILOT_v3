import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { getResource } from '@app/_common/commonFunction';

@Injectable({ providedIn: 'root' })
export class CommissionPrice {
    constructor(private http: HttpClient) { }

    getCommissionPrice(ma_loai: string, ngay_ct: string) {
        const date = new Date(ngay_ct);
        const formatted = date.toLocaleDateString('vi-VN'); // → "dd/MM/yyyy"

        return this.http.post<any[]>(`${environment.apiUrl}/category/find/dmhhthuho?page_index=1&page_size=1&order_by=ngay_hl desc`,
            [
                { name: 'ma_td', operator: '=', value: ma_loai },
                { name: 'ngay_hl', operator: '<=', value: formatted },
            ]
        );
    }
}
