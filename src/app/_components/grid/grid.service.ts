import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Field } from './grid.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor(private router: Router, private dialog: MatDialog, private _snackBar: MatSnackBar) { }

  onClickDelete(index: number, item: any, field: Field[]): Observable<boolean> {
    if (index === -1) {
      this._snackBar.open('Bạn phải chọn hàng trước khi xóa', 'Đóng', {
        duration: 5000,
      });
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }
    let title = 'Bạn có muốn xóa ';
    field.forEach((value) => {
      title += `${value.title}: ${item[value.name]} `;
    });
    title += 'không?';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.height = '160px';
    dialogConfig.data = {
      title: title,
    };
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    return dialogRef.afterClosed().pipe(
      map(result => {
        return result;
      })
    );
  }
  navigateCreate() {
    this.router.navigate([this.router.url + '/create']);
  }
  navigateUpdate(index: number, item: any, fields: Field[]) {
    if (index === -1) {
      this._snackBar.open('Bạn phải chọn hàng trước khi sửa', 'Đóng', {
        duration: 5000,
      });
      return;
    }

    const data = fields.filter((item) => item.isPrimaryKey === true).map((value, index) => {
      return { key: value.name, value: item[value.name] };
    });

    const queryParams: { [key: string]: string } = {};
    data.forEach(item => {
      queryParams[item.key] = item.value;
    });
    this.router.navigate([this.router.url + '/update'], { queryParams });
  }
}
