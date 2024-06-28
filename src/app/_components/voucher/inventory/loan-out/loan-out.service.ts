import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { MasterInfo, Receipt } from './loan-out.model';
import { ResultDetailVoucher, ResultNoPaging } from '@app/_models/Result';
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class LoanOutService implements IGridService<Receipt>{

  name?: string;
  constructor(private http: HttpClient, public dialog: MatDialog, private authenticateService: AuthenticationService, private snack: MatSnackBar) {

  }
  delete(data: any): Observable<boolean> {
    const stt_rec = data[0].value;
    if (stt_rec) {
      return this.http.delete<Result<MasterInfo>>(environment.apiUrl +
        '/voucher/delete/ISTran_PXM?voucherId=' + stt_rec
      ).pipe(map((res: any) => {
        if (res && res.success) {
          this.snack.open('Thực hiện thành công', 'Đóng', { duration: 5000 });
          return true;
        }
        this.snack.open('Thực hiện thất bại', 'Đóng', { duration: 5000 });
        return false;
      }));
    }
    else {
      return of(false);
    }
  }
  getTitle(): string {
    return 'Phiếu xuất cho mượn';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<Receipt>> {
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
    if (!filter) {
      return this.http.get<Result<MasterInfo>>(environment.apiUrl +
        '/voucher/gettop/ISTran_PXM'
      ).pipe(map((res: any) => {
        res.result = {
          pageIndex: 1,
          pageCount: 1,
          pageSize: 50,
          recordCount: res.result.length,
          items: res.result
        };
        return res;
      }));
    } else {
      const ma_cuahang = this.authenticateService.userValue?.shop;
      let param = `&ma_ct=PXM&ma_cuahang=${ma_cuahang}`;
      filter.forEach((item) => {
        param += `&${item.name}=${item.value}`;
      });
      return this.http.post<Result<Receipt>>(environment.apiUrl +
        `/voucher/find/ISTran_PXM?page_index=${page.pageIndex + 1}&page_size=${page.pageSize}${param}`, {}
      ).pipe();
    }
  }
  getItem(id: string): Observable<Receipt> {

    return this.http.get<ResultDetailVoucher<Receipt>>(environment.apiUrl +
      `/voucher/getbyid/ISTran_PXM?id=${id}`
    ).pipe(map((res) => {
      return res.result;
    }));

    // const res: Retail = ELEMENT_DATA[0];
    return new Observable<Receipt>(res => res);
    // throw new Error('Method not implemented.');
  }

  update(data: any): Observable<Receipt> {

    return this.http.put<any>(environment.apiUrl +
      '/voucher/update/ISTran_PXM'
      , data).pipe(
        catchError((error: any) => {
          // xử lý lỗi ở đây
          return of({ success: false, message: error });
        }),
        map((res) => {
          return res;
        }));

    // const res: Retail = ELEMENT_DATA[0];
    return new Observable<Receipt>(res => res);
    // throw new Error('Method not implemented.');
  }
  create(data: any): Observable<Receipt> {

    return this.http.post<any>(environment.apiUrl +
      '/voucher/addnew/ISTran_PXM'
      , data).pipe(
        catchError((error: any) => {
          // xử lý lỗi ở đây
          return of({ success: false, message: error });
        }),
        map((res) => {
          return res;
        }));

    // const res: Retail = ELEMENT_DATA[0];
    return new Observable<Receipt>(res => res);
    // throw new Error('Method not implemented.');
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/grid/loan-out.json?r=${randomParam}`).pipe(
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
