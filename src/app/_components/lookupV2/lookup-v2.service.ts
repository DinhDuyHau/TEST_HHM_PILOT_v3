import { Injectable } from '@angular/core';
import { Field, IGridService, IGridServiceV2, ItemFilter, ItemSort, Result } from '../gridV2/grid.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '../printer/printer.component';
import { LookupComponent } from '../lookup/lookup.component';
import { LookupData } from './lookup-v2.model';

@Injectable({
  providedIn: 'root'
})
export class LookupV2Service implements IGridServiceV2<any>{
  lookupData!: LookupData;
  constructor(private http: HttpClient, public dialog: MatDialog) {

  }
  handleService(event: any, data: any[], func: any) {
    throw new Error('Method not implemented.');
  }
  delete(data: any): any {
    throw new Error('Method not implemented.');
  }
  getTitle(): string {
    return this.lookupData.title || '';
  }
  initData(lookupData: LookupData) {
    this.lookupData = lookupData;
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<any>> {
    if (filter) {
      if (this.lookupData.filter) {
        filter = [...filter, ...this.lookupData.filter];
      }
    }
    else {
      if (this.lookupData.filter) {
        filter = [...this.lookupData.filter];
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
        return { name: item.name, operator: item.operator == '' || item.operator == undefined ? 'like' : item.operator, value: item.operator == undefined ? `%${item.value}%` : item.value };
      });
    }
    return this.http.post<Result<any>>(environment.apiUrl +
      `/Category/find/${this.lookupData.entity}?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
    ).pipe();
  }
  getItem(id: string): Observable<any> {
    return new Observable<any>(res => res);
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/lookup/${this.lookupData.entity}.json?r=${randomParam}`).pipe(
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
        title: 'Danh mục khách hàng',
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
