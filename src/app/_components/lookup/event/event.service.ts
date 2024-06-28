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
import { ResultNoPaging } from '@app/_models/Result';

@Injectable({
  providedIn: 'root'
})
export class EventService implements IGridService<any>{
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
    return 'Danh mục sự kiện';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<any>> {
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
        return { name: item.name, operator: 'like', value: `%${item.value}%`, isRequired: item.isRequired };
      });
    }
    return this.http.get<Result<any>>(environment.apiUrl +
      `/EventGiveAway/get_event_giveaway?ma_cuahang=${filter.find(x => x.name == 'ma_cuahang')?.value || ''}&ma_sukien=${filter.find(x => x.name == 'ma_sukien')?.value || ''}&ten_sukien=${filter.find(x => x.name == 'ten_sukien')?.value || ''}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`
    ).pipe();
  }
  getItem(id: string): Observable<any> {
    return this.http.get<ResultNoPaging<any>>(environment.apiUrl +
      `/EventGiveAway/getbyid?ma_sukien=${id}`
    );
  }
  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/lookup/dmsukien.json?r=${randomParam}`).pipe(
      switchMap(data => {
        data = data.map((item) => {
          return { ...new Field(), ...item, dataFormatString: (dataFormat as any)[item.dataFormatString === undefined ? '' : item.dataFormatString] };
        });
        return of(data);
      })
    );
  }
  getEventGiveAwayDetail(ma_sukien: string) {
    return this.http.get<ResultNoPaging<any>>(environment.apiUrl +
      `/EventGiveAway/get_event_giveaway_detail?ma_sukien=${ma_sukien}`
    );
  }
  openDialog(type: number): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.height = '90%';
    // dialogConfig.disableClose = true;
    dialogConfig.data = type;

    if (type === 3) {
      dialogConfig.data = {
        title: 'Danh mục sự kiện',
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