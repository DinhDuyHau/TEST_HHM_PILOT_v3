import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DirComponent } from '@app/_components/dir/dir.component';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { CustomerService } from './customer.service';
import { Customer } from '@app/_components/category/customer/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerThuHoService extends CustomerService {
    constructor(public http_client: HttpClient, public matDialog: MatDialog) {
        super(http_client, matDialog);
    }

    override getItem(id: string): Observable<Customer> {
        const body: any = [
            { name: 'ma_td2', operator: '=', value: id },
            { name: 'nh_kh9', operator: '=', value: 'NGKH86' }
        ];

        return this.http_client.post<Customer>(environment.apiUrl +
            '/Category/find/dmkh', body
        ).pipe();

    }

    override getFields(): Observable<Field[]> {
        const randomParam = new Date().getTime();
        return this.http_client.get<Field[]>(`assets/fields/lookup/dmkh_dvth.json?r=${randomParam}`).pipe(
            switchMap(data => {
                data = data.map((item) => {
                    return { ...new Field(), ...item, dataFormatString: (dataFormat as any)[item.dataFormatString === undefined ? '' : item.dataFormatString] };
                });
                return of(data);
            })
        );
    }
}