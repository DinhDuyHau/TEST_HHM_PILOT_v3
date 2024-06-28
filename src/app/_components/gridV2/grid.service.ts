import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Field } from './grid.model';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { DialogConfirmComponent } from '../dialog/dialog-confirm/dialog-confirm.component';
import { ReportService } from '@app/_services';
import { MenuReport } from '@app/_models';
import { PrinterComponent } from '../printer/printer.component';
import { getResource } from '@app/_common/commonFunction';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor(private router: Router, private dialog: MatDialog, private _snackBar: MatSnackBar, private reportService: ReportService) { }

  onClickDelete(item: any, field: Field[]): Observable<boolean> {
    let title = 'Bạn có muốn xóa ';
    field.forEach((value) => {
      title += `${value.title}: ${item[value.name]} `;
    });
    title += 'không?';
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '300px';
    // dialogConfig.height = '160px';
    dialogConfig.data = {
      title: title,
    };
    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogConfig);
    return dialogRef.afterClosed().pipe(
      map(result => {
        return result;
      })
    );
  }
  onClickDeleteGrid(): Observable<boolean> {
    const title = 'Bạn có muốn xóa không';
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '300px';
    // dialogConfig.height = '160px';
    dialogConfig.data = {
      title: title,
    };
    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogConfig);
    return dialogRef.afterClosed().pipe(
      map(result => {
        return result;
      })
    );
  }
  navigateCreate() {
    this.router.navigate([this.router.url + '/create']);
  }
  navigateUpdate(item: any, fields: Field[]) {
    const data = fields.filter((item) => item.isPrimaryKey === true).map((value, index) => {
      return { key: value.name, value: item[value.name] };
    });

    const queryParams: { [key: string]: string } = {};
    data.forEach(item => {
      queryParams[item.key] = item.value;
    });
    this.router.navigate([this.router.url + '/update'], { queryParams });
  }
  navigateView(item: any, fields: Field[]) {
    const data = fields.filter((item) => item.isPrimaryKey === true).map((value, index) => {
      return { key: value.name, value: item[value.name] };
    });

    const queryParams: { [key: string]: string } = {};
    data.forEach(item => {
      queryParams[item.key] = item.value;
    });
    this.router.navigate([this.router.url + '/view'], { queryParams });
  }
  async openPrintDialog(stt_rec: string, data: MenuReport) {
    const response = await firstValueFrom(this.reportService.getPdfVoucher(stt_rec, data.controller || '', data.form_id || '')) as any;
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


}
