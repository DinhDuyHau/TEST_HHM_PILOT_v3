import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { of, Observable, map } from 'rxjs';
import { ItemFilter, ItemSort } from '@app/_components/gridV2/grid.model';
import { Result } from '@app/_models/Result';
import { MatDialog } from '@angular/material/dialog';
import { PaymentModel } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class Payment {
    filter !: ItemFilter[];
    name?: string;
    constructor(private http: HttpClient, public dialog: MatDialog) {

    }
    setItemFilter(item: ItemFilter[]) {
        this.filter = item;
    }
    getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<any>> {
        let order_by = '';
        if (sort && sort.name !== '') {
            if (sort.direction !== '') {
                order_by = sort.name + ' ' + sort.direction;
            }
        }
        let body: { name: string; operator: string; value: string; }[] = [];
        if (filter) {
            body = filter.map((item, index) => {
                return { name: item.name, operator: 'like', value: `%${item.value}%` };
            });
        }
        return this.http.post<Result<any>>(environment.apiUrl +
            `/Category/find/dmthanhtoan?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
        ).pipe();
    }
    getPayment(isHide = false) {
        return this.http.post<Result<any>>(environment.apiUrl +
            '/Category/find/dmthanhtoan?order_by=sort asc',
            [{ name: 'isHide', operator: '=', value: isHide }]

        ).pipe(map(result => {
            return result.result.items;
        }));
    }

    getPaymentInvoice(xuat_yn = true) {
        const sort = xuat_yn ? 'xuat_v desc' : 'nhap_v desc';
        return this.http.post<Result<PaymentModel>>(environment.apiUrl +
            `/Category/find/dmhddt_httt?order_by=${sort}`,
            xuat_yn ? [{ name: 'xuat_v', operator: '>', value: 0 }] : [{ name: 'nhap_v', operator: '>', value: 0 }]
        ).pipe(map(result => {
            return result.result.items;
        }));
    }
}