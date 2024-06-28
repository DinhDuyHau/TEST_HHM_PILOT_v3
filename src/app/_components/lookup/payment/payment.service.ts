import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DirComponent } from '@app/_components/dir/dir.component';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService implements IGridService<Payment>{
  filter!: ItemFilter[];
  name?: string;
  constructor(private http: HttpClient, public dialog: MatDialog, private commonService: CommonService) {

  }
  setItemFilter(item: ItemFilter[]) {
    this.filter = item;
  }
  delete(data: any): any {
    throw new Error('Method not implemented.');
  }
  getTitle(): string {
    return 'Danh mục thanh toán';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<Payment>> {
    if (filter) {
      if (this.filter) {
        filter = [...filter, ...this.filter];
      }
    }
    else {
      if (this.filter) {
        filter = [...this.filter];
      }
    }
    let order_by = '';
    if (sort && sort.name !== '') {
      if (sort.direction !== '') {
        order_by = sort.name + ' ' + sort.direction;
      }
    }
    let body: { name: string; operator: string; value: string; }[] = [];
    if (filter) {
      body = filter.map((item, index) => {
        if (item.operator) {
          return { name: item.name, operator: item.operator, value: item.value };
        }
        else return { name: item.name, operator: 'like', value: `%${item.value}%`, isRequired: item.isRequired };
      });
    }
    return this.http.post<Result<Payment>>(environment.apiUrl +
      `/Category/find/dmtt?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
    ).pipe(
      catchError((error: any) => {
        this.commonService.showMessageByName(error);
        const res: Result<Payment> = {
          message: error.message,
          result: {
            items: [],
            pageCount: 0,
            pageIndex: 0,
            pageSize: 0,
            recordCount: 0,
          },
          success: false
        };
        return of(res);
      })
    );
  }
  getItem(id: string): Observable<Payment> {
    // return this.http.post<Payment>(environment.apiUrl +
    //   '/Category/getById/dmtt', { name: 'ma_tt', operator: '=', value: id }
    // ).pipe();

    return this.getItems({ pageIndex: 0, pageSize: 1 }, [id !== '' ? { name: 'ma_tt', value: id } : { name: '1', value: '1' }], { name: 'ma_tt', direction: 'asc' }).pipe(switchMap(item => {

      if (item && item.result && item.result.items) {
        return of(item.result.items[0]);
      }
      return of();
    }));
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/lookup/dmtt.json?r=${randomParam}`).pipe(
      switchMap(data => {
        data = data.map((item) => {
          return { ...new Field(), ...item, dataFormatString: (dataFormat as any)[item.dataFormatString === undefined ? '' : item.dataFormatString] };
        });
        return of(data);
      })
    );
  }

  openDialog(type: number): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.height = '90%';
    dialogConfig.disableClose = true;
    dialogConfig.data = type;

    if (type === 3) {
      dialogConfig.data = {
        title: 'Danh mục thanh toán',
        pdf: ''
      };
      const dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
    }
    else {
      const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }
  }
}
interface Payment {
  ma_tt: string;
  ten_tt: string;
  ten_tt2: string;
  han_tt: string;
  ten_ngan: string;
}
