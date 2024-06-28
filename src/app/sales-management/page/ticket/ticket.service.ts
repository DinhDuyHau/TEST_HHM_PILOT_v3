import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Field, IGridService, ItemFilter, ItemSort, Result } from '@app/_components/grid/grid.model';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import dataFormat from '@app/_common/dataFormat';
import { ReportComponent } from '@app/_components/report/report.component';
import { LookupComponent } from '@app/_components/lookup/lookup.component';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService implements IGridService<any>{
  entityName!: string;
  name?: string;
  constructor(private http: HttpClient, public dialog: MatDialog,
    private ticketApiService: TicketApiService) {
  }

  public setEntityname(name: string) {
    this.entityName = name;
  }

  public getEntityname() {
    return this.entityName || '';
  }

  delete(data: any): boolean {
    this.ticketApiService.deleteVoucherById(this.entityName, data[0].value).subscribe(result => {
    })
    return true;
  }

  getTitle(): string {
    return '';
  }

  getItems(page: { pageIndex: number, pageSize: number }, filter?: ItemFilter[], sort?: ItemSort): Observable<Result<any>> {
    return this.http.get<Result<any>>(environment.apiUrl +
      `/voucher/gettop/${this.entityName}`);
  }

  getItem(id: string): Observable<any> {
    return new Observable<any>(res => res);
  }

  getFields(): Observable<Field[]> {
    return of([])
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
      const dialogRef = this.dialog.open(ReportComponent, dialogConfig);
    }
    else {
      const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }
  }
}
