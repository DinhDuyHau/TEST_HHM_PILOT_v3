import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { ReceiptDetail } from '../receipt.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { DialogIMEIComponent } from '@app/_components/dialog/dialog-imei/dialog-imei.component';
import { DialogInputCustomComponent } from '@app/_components/dialog/dialog-input-custom/dialog-input-custom.component';

@Injectable({
  providedIn: 'root'
})
export class ReceiptDetailService implements IGridService<ReceiptDetail>{

  name?: string;
  constructor(private http: HttpClient, public dialog: MatDialog) {

  }
  delete(data: any): any {
    throw new Error('Method not implemented.');
  }
  getTitle(): string {
    return 'Phiếu nhu cầu mua hàng';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<ReceiptDetail>> {
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
    // return this.http.post<Result<ReceiptDetail>>(environment.apiUrl +
    //   `/Category/find/dmkh?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
    // ).pipe();
    return of();
  }
  getItem(id: string): Observable<ReceiptDetail> {
    // const res: Retail = ELEMENT_DATA[0];
    return new Observable<ReceiptDetail>(res => res);
    // throw new Error('Method not implemented.');
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/grid/receipt_detail.json?r=${randomParam}`).pipe(
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
  scanQRCode(): Observable<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '400px';
    // dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(ScanQrcodeComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  openDialogIMEI(data: any, grid_imeis = ''): Observable<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.height = '650px';

    //Nhập mua type = 1
    data.type = 1;
    data.gridImeis = grid_imeis;

    dialogConfig.data = data;
    // dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(DialogIMEIComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  openLookup(control: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.height = '90%';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      service: control
    };
    const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
    return dialogRef.afterClosed();
  }
  openDialogEditPrice(data: any): Observable<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '350px';
    dialogConfig.height = 'auto';
    dialogConfig.data = data;
    // dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(DialogInputCustomComponent, dialogConfig);
    return dialogRef.afterClosed();
  }
}
