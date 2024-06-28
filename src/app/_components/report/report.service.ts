import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '../gridV2/grid.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, catchError, lastValueFrom, map, of, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '../printer/printer.component';
import { LookupComponent } from '../lookup/lookup.component';
import { Filter } from '../filter/filter.model';
import { FilterComponent } from '../filter/filter.component';
import { getFirstDayOfMonth, getLastDayOfMonth, getResource } from '@app/_common/commonFunction';
import { MenuReport } from '@app/_models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ReportService implements IGridService<any> {
  name?: string;
  title?: string;
  entity?: string;
  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) {

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
    const body = this.getBody(page, filter, sort);
    return this.http.post<Result<any>>(environment.apiUrl +
      `/report/${this.entity}`, body
    ).pipe(
      catchError((error: any) => {
        // xử lý lỗi ở đây
        const res: Result<any> = { success: false, message: error, result: { pageIndex: 0, pageCount: 0, pageSize: 0, items: [], recordCount: 0 } };
        return of(res);
      }),
      map((res) => {
        return res;
      }));
  }


  getItem(id: string): Observable<any> {
    return new Observable<any>(res => res);
  }

  getPdfReport(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort, menu: MenuReport): Observable<Result<any>> {
    const body = this.getBody(page, filter, sort);
    return this.http.post<Result<any>>(environment.apiUrl +
      `/report/get_pdf_report/${this.entity}?form_id=${menu.form_id}&controller=${menu.controller}`, body
    ).pipe();
  }

  getBody(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<any>> {
    let order_by = '';
    if (sort && sort.name !== '') {
      if (sort.direction !== '') {
        order_by = sort.name + ' ' + sort.direction;
      }
    }
    let body: any = {};
    if (filter) {
      filter.forEach((item, index) => {
        body[item.name] = item.value;
      });
      body = { ...body, page_index: page.pageIndex + 1, page_size: page.pageSize };
    }
    return body;
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/report/${this.entity}.json?r=${randomParam}`).pipe(
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
        // console.log(result);
      });
    }
  }

  async openFilterDialog() {
    const randomParam = new Date().getTime();
    const item = await lastValueFrom(this.http.get<Filter>(`assets/filter/${this.entity}.json?r=${randomParam}`));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = item.width + 'px';
    dialogConfig.maxWidth = 'auto';
    dialogConfig.height = item.height + 'px';
    dialogConfig.disableClose = true;

    dialogConfig.data = { controls: item.control };
    const dialogRef = this.dialog.open(FilterComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  async getFilterField() {
    const randomParam = new Date().getTime();
    const item = await lastValueFrom(this.http.get<Filter>(`assets/filter/${this.entity}.json?r=${randomParam}`));
    return item;
  }

  async openPrintDialog(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort, data: MenuReport) {
    const response = await lastValueFrom(this.getPdfReport(page, filter, sort, data)) as any;

    if (response.success) {
      const res = response.result;
      const pdfBase64 = res;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '100%';
      dialogConfig.height = '90%';
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        title: data.name,
        pdf: pdfBase64
      };
      const dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
      return dialogRef;
    }
    else {
      this._snackBar.open(getResource(response.message), 'Đóng', { duration: 5000 });
      return of(false);
    }
  }

  async exportExcel(sysid: string, filter?: ItemFilter[], fields?: Field[]) {
    let body: any = {};
    if (filter) {
      filter.forEach((item, index) => {
        body[item.name] = item.value;
      });
    }
    body = { ...body, title: this.title };

    const rpt_fields = fields?.map(x => {
      return {
        name: x.name,
        title: x.title,
        type: x.type,
        hidden: x.hidden,
        dataFormatString: x.dataFormatString ? x.dataFormatString : '',
        align: x.align,
        width: x.width
      }
    });
    body = { ...body, fields: rpt_fields };

    const response = await lastValueFrom(this.http.post<Result<any>>(environment.apiUrl + `/report/export_xls_report/${sysid}`, body).pipe()) as any;
    if (response && response.success) {
      const file_name = `${this.title}.xls`;
      this.downloadFileObject(file_name, response.result);
    }
  }

  downloadFileObject(fileName: string, base64String: string) {
    const downloadLink = document.createElement("a");
    downloadLink.href = base64String;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
