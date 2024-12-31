import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DirComponent } from '@app/_components/dir/dir.component';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';

@Injectable({
  providedIn: 'root'
})
export class ASMService implements IGridService<ASM>{
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
    return 'Danh mục khách hàng';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<ASM>> {
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
    let ma_nvbh = '';
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
    return this.http.get<Result<ASM>>(environment.apiUrl +
      `/employee/get_list_asm`, {
        params: {
          ma_nvbh: ma_nvbh,
          page_index: (page.pageIndex + 1).toString(),
          page_size: page.pageSize.toString()
        }
      }).pipe();
  }

  getItem(id: string): Observable<ASM> {
    const entity = this.http.post<ASM>(environment.apiUrl + '/Category/getById/dmkh', { name: 'ma_kh', operator: '=', value: id }
    ).pipe(switchMap((data: any) => {
      if (data.success && data.result) return of(data.result);
      return of();
    }));
    return entity;
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/lookup/dmasm.json?r=${randomParam}`).pipe(
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
        title: 'Danh mục sách ASM',
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
interface ASM {
  dia_chi: string;
  m_username: string;
  ma_nvbh: string;
  ten_nvbh: string;
  ma_bp: string;
  ma_cuahang: string;
}
