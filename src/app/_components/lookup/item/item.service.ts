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

@Injectable({
  providedIn: 'root'
})
export class ItemService implements IGridService<Item>{
  filter!: ItemFilter[];
  name?: string;
  constructor(private http: HttpClient, public dialog: MatDialog) {

  }
  setItemFilter(item: ItemFilter[]) {
    this.filter = item;
  }
  delete(data: any): any {
    throw new Error('Method not implemented.');
  }
  getTitle(): string {
    return 'Danh mục vật tư';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<Item>> {
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
          return { name: item.name, operator: item.operator, value: item.value, isRequired: item.isRequired };
        }
        else return { name: item.name, operator: 'like', value: `%${item.value}%`, isRequired: item.isRequired };
      });
    }
    return this.http.post<Result<Item>>(environment.apiUrl +
      `/Category/find/dmvt?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
    ).pipe();
  }
  getItem(id: string): Observable<Item> {
    // return this.http.post<Item>(environment.apiUrl +
    //   '/Category/getById/dmvt', { name: 'ma_vt', operator: '=', value: id }
    // ).pipe();

    return this.getItems({ pageIndex: 0, pageSize: 1 }, [id !== '' ? { name: 'ma_vt', value: id } : { name: '1', value: '1' }], { name: 'ma_vt', direction: 'asc' }).pipe(switchMap(item => {
      if (item && item.result && item.result.items) {
        return of(item.result.items[0]);
      }
      return of();
    }));
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/lookup/dmvt.json?r=${randomParam}`).pipe(
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
        title: 'Danh mục vật tư',
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
interface Item {
  ma_vt: string;
  ten_vt: string;
  ten_vt2: string;
  dvt: string;
}