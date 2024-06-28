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
import { MasterInfo, Model } from './voucher.model';
import { ResultDetailVoucher, ResultNoPaging } from '@app/_models/Result';
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeVoucher, VOUCHER_TYPE } from '../enum/voucher_enum';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/sales-management/page/common/common.service';
@Injectable({
  providedIn: 'root'
})
export class VoucherService implements IGridService<Model>{
  name?: string;
  voucher_type!: TypeVoucher;
  constructor(private http: HttpClient, public dialog: MatDialog, private authenticateService: AuthenticationService, private snack: MatSnackBar, private route: ActivatedRoute, private commonService: CommonService) {
    route.data.subscribe((result: any) => {
      const type: TypeVoucher = result;
      this.voucher_type = type;
    });
  }
  delete(data: any): Observable<boolean> {
    const stt_rec = data[0].value;
    if (stt_rec) {
      return this.http.delete<Result<MasterInfo>>(environment.apiUrl +
        `/voucher/delete/${this.voucher_type.sysid}?voucherId=` + stt_rec
      ).pipe(catchError((error: any) => {
        this.commonService.showMessage('Thực hiện thất bại');
        return of(false);
      }), map((res: any) => {
        if (res && res.success) {
          this.commonService.showMessageByName(res.message);
          return true;
        }
        this.commonService.showMessageByName(res.message);
        return false;
      }));
    }
    else {
      return of(false);
    }
  }
  getTitle(): string {
    return this.voucher_type.title;
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<Model>> {
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
        `/voucher/gettop/${this.voucher_type.sysid}`
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
      let param = `&ma_ct=${this.voucher_type.voucherCode}&ma_cuahang=${ma_cuahang}`;
      filter.forEach((item) => {
        param += `&${item.name}=${item.value}`;
      });

      let api_route = 'voucher/find';
      if (this.voucher_type.voucherCode === 'PNF' || this.voucher_type.voucherCode === 'PXB')
        api_route = 'voucher/findext';

      return this.http.post<Result<Model>>(environment.apiUrl +
        `/${api_route}/${this.voucher_type.sysid}?page_index=${page.pageIndex + 1}&page_size=${page.pageSize}${param}`, {}
      ).pipe();
    }
  }
  getItem(id: string): Observable<Model> {

    return this.http.get<ResultDetailVoucher<Model>>(environment.apiUrl +
      `/voucher/getbyid/${this.voucher_type.sysid}?id=${id}`
    ).pipe(map((res) => {
      return res.result;
    }));
  }

  update(data: any): Observable<Model> {

    return this.http.put<any>(environment.apiUrl +
      `/voucher/update/${this.voucher_type.sysid}`
      , data).pipe(
        catchError((error: any) => {
          return of({ success: false, message: error });
        }),
        map((res) => {
          return res;
        }));
  }
  create(data: any): Observable<Model> {
    return this.http.post<any>(environment.apiUrl +
      `/voucher/addnew/${this.voucher_type.sysid}`
      , data).pipe(
        catchError((error: any) => {
          return of({ success: false, message: error });
        }),
        map((res) => {
          return res;
        }));
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/grid/${this.voucher_type.field}.json?r=${randomParam}`).pipe(
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
