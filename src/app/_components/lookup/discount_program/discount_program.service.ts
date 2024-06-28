import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Field, IGridService, IGridServiceV2, ItemFilter, ItemSort, Result } from '@app/_components/gridV2/grid.model';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DirComponent } from '@app/_components/dir/dir.component';
import dataFormat from '@app/_common/dataFormat';
import { PrinterComponent } from '@app/_components/printer/printer.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountProgramService implements IGridServiceV2<DiscountProgram>{
  filter!: ItemFilter[];
  name?: string;
  list_vt: string[] = [];
  list_item: any[] = [];
  constructor(private http: HttpClient, public dialog: MatDialog, private commonService: CommonService) {

  }
  handleService(event: any, data: DiscountProgram[], func: any) {
    const item_count: any = {};
    const list_imei_code_empty: string[] = [];
    let mess = '';
    switch (func) {
      case 'submit':
        data.forEach(item => {
          if (item_count[item.ma_imei]) {
            item_count[item.ma_imei]++;
          } else {
            item_count[item.ma_imei] = 1;
          }
          if (!item.ma_gg) {
            list_imei_code_empty.push(item.ma_imei);
          }
        });
        if (Object.keys(item_count).find(key => item_count[key] > 1)) {
          Object.keys(item_count).forEach((item, index) => {
            if (item_count[item] > 1) {
              mess += item + (index != Object.keys(item_count).length - 1 ? ', ' : '');
            }
          });
          this.commonService.showMessageByNameAdvance('lblWarningChooseDiscountProgram', { name: '%imei', value: mess });
          return false;
        }
        if (list_imei_code_empty.length > 0) {
          mess = list_imei_code_empty.join(', ');
          this.commonService.showMessageByNameAdvance('lblWarningInvalidCodeDiscountProgram', { name: '%imei', value: mess });
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  }
  setItemFilter(item: ItemFilter[]) {
    this.filter = item;
  }
  setListItem(item: any[], list_code?: any[]) {
    this.list_item = item.map(item => {
      let ma_gg = '';
      let choose = false;
      if (list_code) {
        const code = list_code.find(x => x.ma_imei.trim() == item.ma_imei.trim());
        if (code) {
          ma_gg = code.ma_gg.trim();
          choose = true;
        }
      }
      return { 'ma_vt': item.ma_vt.trim(), 'ma_imei': item.ma_imei.trim(), 'ma_gg': ma_gg, 'choose': choose };
    });
    this.list_vt = [...new Set(item.map((x: any) => x.ma_vt.trim()))];
  }
  delete(data: any): any {
    throw new Error('Method not implemented.');
  }
  getTitle(): string {
    return 'Chương trình giảm giá';
  }
  getItems(page: { pageIndex: number; pageSize: number; }, filter: ItemFilter[], sort: ItemSort): Observable<Result<DiscountProgram>> {
    // if (filter) {
    //   if (this.filter) {
    //     filter = [...filter, ...this.filter];
    //   }
    // }
    // else {
    //   if (this.filter) {
    //     filter = [...this.filter];
    //   }
    // }
    // let order_by = '';
    // if (sort && sort.name !== '') {
    //   if (sort.direction !== '') {
    //     order_by = sort.name + ' ' + sort.direction;
    //   }
    // }
    // let body: { name: string; operator: string; value: string; }[] = [];
    // if (filter) {
    //   body = filter.map((item, index) => {
    //     if (item.operator) {
    //       return { name: item.name, operator: item.operator, value: item.value };
    //     }
    //     else return { name: item.name, operator: 'like', value: `%${item.value}%` };
    //   });
    // }
    return this.http.post<Result<DiscountProgram>>(environment.apiUrl +
      '/DiscountCode/get_discount_program', this.list_vt
    ).pipe(switchMap(data => {
      if (data.result && data.result.items) {
        const res = data.result.items;
        const leftJoinArray = res.map(item1 => {
          const matchingItems = this.list_item.filter(item2 => item2.ma_vt === item1.ma_vt);
          if (matchingItems.length > 0) {
            return matchingItems.map(matchingItem => ({ ...item1, ...matchingItem }));
          }
          return item1;
        }).flat();
        data.result.items = leftJoinArray;
        data.result.recordCount = leftJoinArray.length;
        data.result.pageSize = leftJoinArray.length;
      }
      return of(data);
    }));
  }
  getItem(id: string): Observable<DiscountProgram> {
    return this.getItems({ pageIndex: 0, pageSize: 1 }, [id !== '' ? { name: 'ma_tt', value: id } : { name: '1', value: '1' }], { name: 'ma_tt', direction: 'asc' }).pipe(switchMap(item => {
      if (item && item.result && item.result.items) {
        return of(item.result.items[0]);
      }
      return of();
    }));
  }

  getFields(): Observable<Field[]> {
    const randomParam = new Date().getTime();
    return this.http.get<Field[]>(`assets/fields/lookup/discount-program.json?r=${randomParam}`).pipe(
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
        title: 'Danh mục thanh toán',
        pdf: ''
      };
      const dialogRef = this.dialog.open(PrinterComponent, dialogConfig);
    }
    else {
      const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //
      });
    }
  }
}
interface DiscountProgram {
  ma_ctr: string;
  ten_ctr: string;
  ma_vt: string;
  ten_vt: string;
  ngay_hl: string;
  ngay_hl2: string;
  tien_giam: number;
  tl_giam: number;
  ma_imei: string;
  ma_gg: string;
}
