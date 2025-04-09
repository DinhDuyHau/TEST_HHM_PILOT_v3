import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { Customer, CustomerModel } from './customer.model';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DirComponent } from '@app/_components/dir/dir.component';
import dataFormat from '@app/_common/dataFormat';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { CustomerApiService } from '@app/sales-management/api/customer-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@app/sales-management/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements IGridService<Customer> {

  name?: string;
  dateChange!: Date;
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private customerApiService: CustomerApiService,
    private snack: MatSnackBar,
    private apiService: ApiService
  ) {
  }
  create(data: any): Observable<any> {
    return this.http.post<CustomerModel>(environment.apiUrl +
      '/Category/addnew/dmkh', data).pipe(
        catchError((error: any) => {
          // xử lý lỗi ở đây
          return of({ success: false, message: error });
        }),
        map((res) => {
          this.dateChange = new Date();
          return res;
        }));
  }
  update(data: any): Observable<any> {
    return this.http.put<CustomerModel>(environment.apiUrl +
      '/Category/update/dmkh', data).pipe(
        catchError((error: any) => {
          // xử lý lỗi ở đây
          return of({ success: false, message: error });
        }),
        map((res) => {
          this.dateChange = new Date();
          return res;
        }));
  }
  delete(data: any): any {
    const filter: ItemFilter[] = [];
    data.forEach((item: any) => {
      filter.push({ name: item.key, operator: '=', value: item.value });
    });
    return this.http.delete<any>(environment.apiUrl +
      '/category/remove/dmkh', { body: filter }
    ).pipe(catchError((error: any) => {
      this.snack.open('Thực hiện thất bại', 'Đóng', { duration: 5000 });
      return of(false);
    }), map((res: any) => {
      if (res && res.success) {
        this.dateChange = new Date();
        this.snack.open('Thực hiện thành công', 'Đóng', { duration: 5000 });
        return true;
      }
      this.snack.open('Thực hiện thất bại', 'Đóng', { duration: 5000 });
      return false;
    }));
  }
  getTitle(): string {
    return 'Danh mục khách hàng';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<Customer>> {
    let order_by = '';
    if (sort && sort.name !== '') {
      if (sort.direction !== '') {
        order_by = sort.name + ' ' + sort.direction;
      }
    }
    if (this.dateChange && Math.floor((new Date().getTime() - this.dateChange.getTime()) / (1000 * 60)) < 30) {
      if (!filter) {
        filter = [];
      }
      filter.push({ name: 'extend_change_time', operator: '=', value: this.dateChange.getTime() });
    }
    let body: { name: string; operator: string; value: string; }[] = [];
    if (filter) {
      body = filter.map((item, index) => {
        return { name: item.name, operator: 'like', value: `%${item.value}%` };
      });
    }
    return this.http.post<Result<Customer>>(environment.apiUrl +
      `/Category/find/dmkh?order_by=${order_by}&page_index=${page.pageIndex + 1}&page_size=${page.pageSize}`, body
    ).pipe();
  }
  getItem(id: string): Observable<any> {
    return this.http.post<Result<Customer>>(environment.apiUrl +
      '/Category/getbyid/vdmkh', {
      name: 'ma_kh',
      operator: '=',
      value: id
    }
    ).pipe();
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/grid/dmkh.json?r=${randomParam}`).pipe(
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
      //
    }
    else {
      const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }
  }

  getCustomerInfoByWebsite(phone: string): Observable<any> {
    let url = `${environment.apiUrlVoucherHHM}/api/genbyte/phonecheck/` + phone;

    const headers = new HttpHeaders({
      'token': `${environment.tokenHHMVoucher}`,
    });

    return this.apiService.postWithHeader<any>(url, {}, null, headers);
  }
}
