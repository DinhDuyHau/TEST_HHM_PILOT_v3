import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '../gridV2/grid.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '../printer/printer.component';
import { LookupComponent } from '../lookup/lookup.component';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements IGridService<any>{
  name?: string;
  title?: string;
  entity?: string;
  constructor(private http: HttpClient, public dialog: MatDialog) {

  }
  delete(data: any): any {
    throw new Error('Method not implemented.');
  }
  getTitle(): string {
    return this.title || '';
  }
  initData(entity: string, title: string, name: string) {
    this.entity = entity;
    this.title = title;
    this.name = name;
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<any>> {
    let order_by = '';
    if (sort && sort.name !== '') {
      if (sort.direction !== '') {
        order_by = sort.name + ' ' + sort.direction;
      }
    }
    let body: { name: string; operator: string; value: string; }[] = [];
    let operator;
    let value;
    if (filter) {
      body = filter.map((item, index) => {
        operator = item.operator ? item.operator : 'like';
        value = operator == 'like' ? `%${item.value}%` : item.value;
        return { name: item.name, operator: operator, value: value, isRequired: item.isRequired };
      });
    }
    return this.http.post<Result<any>>(environment.apiUrl +
      `/Category/find/${this.entity}?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
    ).pipe();
  }
  getItem(id: string): Observable<any> {
    return new Observable<any>(res => res);
  }
  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/category/${this.entity}.json?r=${randomParam}`).pipe(
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
