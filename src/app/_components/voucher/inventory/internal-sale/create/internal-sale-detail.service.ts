import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { ReceiptDetail } from '../internal-sale.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DirComponent } from '@app/_components/dir/dir.component';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { ScanQrcodeComponent } from '@app/_components/scan-qrcode/scan-qrcode.component';
import { DialogIMEIComponent } from '@app/_components/dialog/dialog-imei/dialog-imei.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class InternalSaleDetailService implements IGridService<ReceiptDetail>{

  name?: string;
  constructor(private http: HttpClient, public dialog: MatDialog, private snackBar: MatSnackBar, private commonService: CommonService) {

  }
  delete(data: any): any {
    throw new Error('Method not implemented.');
  }
  getTitle(): string {
    return 'Phiếu xuất bán nội bộ';
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
    return this.http.get<Field[]>(`assets/fields/grid/internal-sale_detail.json?r=${randomParam}`).pipe(
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
  openDialogIMEI(data: any): Observable<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.height = '650px';
    //Xuất bán nội bộ type = 4
    data.type = 4;
    dialogConfig.data = data;
    // dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(DialogIMEIComponent, dialogConfig);
    return dialogRef.afterClosed();
  }
  openPrintDialog(data: any) {
    this.getPdfFile(data).subscribe((response: any) => {
      if (response.success) {
        if (response.result.errorCode) {
          this.snackBar.open(response.result.description, 'Đóng', { duration: 5000 });
          return;
        }
        const res = response.result.fileToBytes;

        const pdfBase64 = 'data:application/pdf;base64,' + res;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '100%';
        dialogConfig.height = '90%';
        dialogConfig.disableClose = true;
        dialogConfig.data = {
          title: this.getTitle(),
          pdf: pdfBase64
        };
        const dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
        return dialogRef;
      }
      else {
        this.commonService.showMessageByName(response.message);
        return of(false);
      }
    });
  }
  // type: official|draft
  getPdfFile(data: any, type: string = 'official') {
    return this.http.post(`${environment.apiUrl}/EInvoice/invoicePDFV2?stt_rec=${data.masterInfo.stt_rec}&ma_ct=${data.masterInfo.ma_ct}&type=${type}`, {});
  }
  createDraft(data: any) {
    return this.http.post(`${environment.apiUrl}/EInvoice/CreateDraftV2?stt_rec=${data.masterInfo.stt_rec}&ma_ct=${data.masterInfo.ma_ct}`, {});
  }
  publishInvoiceBySysAdmin(data: any) {
    return this.http.post(`${environment.apiUrl}/EInvoice/syspublish?stt_rec=${data.masterInfo.stt_rec}&ma_ct=${data.masterInfo.ma_ct}`, {});
  }
  getPublishedInv(data: any) {
    return this.http.post(`${environment.apiUrl}/EInvoice/GetPublishedInvV2?stt_rec=${data.masterInfo.stt_rec}&ma_ct=${data.masterInfo.ma_ct}`, {});
  }
  convertData(data: any) {
    return {
      'dien_giai': data.masterInfo.dien_giai || '',
      'ma_kh': data.masterInfo.ma_kh || '',
      'ma_gd': data.masterInfo.ma_gd || '',
      'ma_nt': data.masterInfo.ma_nt || '',
      'ty_gia': data.masterInfo.ty_gia || '',
      'ma_nk': data.masterInfo.ma_nk || '',
      'ma_kho': data.masterInfo.ma_kho || '',
      'ma_khon': data.masterInfo.ma_khon || '',
      'ma_cuahang_n': data.masterInfo.ma_cuahang_n || '',
      'loai_ct': data.masterInfo.loai_ct || '',
      't_so_luong': data.masterInfo.t_so_luong || 0,
      't_tien_nt': data.masterInfo.t_tien_nt || 0,
      't_tien': data.masterInfo.t_tien || 0,
      'ma_thue': data.masterInfo.ma_thue || '',
      'thue_suat': data.masterInfo.thue_suat || 0,
      't_thue': data.masterInfo.t_thue || 0,
      't_thue_nt': data.masterInfo.t_thue_nt || 0,
      'stt_rec': data.masterInfo.stt_rec || '',
      'ma_ct': data.masterInfo.ma_ct || '',
      'so_ct': data.masterInfo.so_ct || '',
      'ngay_ct': data.masterInfo.ngay_ct || '',
      'ma_dvcs': data.masterInfo.ma_dvcs || '',
      'ma_cuahang': data.masterInfo.ma_cuahang || '',
      'ma_ca': data.masterInfo.ma_ca || '',
      'status': data.masterInfo.status || '',
      'details': data.details[0].data.map((item: any) => {
        return {
          stt_rec: item.stt_rec,
          stt_rec0: item.stt_rec0,
          ma_vt: item.ma_vt,
          so_luong: item.so_luong,
          gia_nt: item.gia_nt,
          tien_nt: item.tien_nt,
        };
      })
    };
  }

}
