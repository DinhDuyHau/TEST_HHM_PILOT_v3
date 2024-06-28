import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { of, Observable, map } from 'rxjs';
import { ItemFilter, ItemSort } from '@app/_components/gridV2/grid.model';
import { StatusTicket } from '@app/_models';
import { Result } from '@app/_models/Result';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class StatusVoucher {
    filter !: ItemFilter[];
    name?: string;
    constructor(private http: HttpClient, public dialog: MatDialog) {

    }
    setItemFilter(item: ItemFilter[]) {
        this.filter = item;
    }
    getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<StatusTicket>> {
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
        return this.http.post<Result<StatusTicket>>(environment.apiUrl +
            `/Category/find/dmttct?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
        ).pipe();
    }
    getStatus(voucher_code: string, loai_gd = '') {
        return this.http.post<Result<StatusTicket>>(environment.apiUrl +
            '/Category/find/dmttct',
            [{ name: 'ma_ct', operator: '=', value: voucher_code }, { name: 'loai_gd', operator: '=', value: loai_gd }]

        ).pipe(map(result => {
            return result.result.items;
        }));
    }
}