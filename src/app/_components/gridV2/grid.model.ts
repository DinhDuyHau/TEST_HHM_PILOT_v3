import { MatTableDataSource } from '@angular/material/table';
import dataFormat from '@app/_common/dataFormat';
import { Observable, catchError, map, of } from 'rxjs';
import button from '@app/_common/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

export class Field {
  name!: string; //
  title!: string; //
  isPrimaryKey?= false;
  width = 140; //d
  allowSorting = false; //
  allowFilter = false; //
  search = '';
  directive = '';
  dataFormatString?: string;
  align = ''; //
  hidden = false;
  type = '';
  isLockingColumn = false; //s
  readonly = true;
  multipleLine = false;
  sort = 0;
  link = false;
  key = '';
  actions: string[] = [];
}

export class Grid<T>{
  dataSource: MatTableDataSource<T> = new MatTableDataSource();
  totalItems = 0;
  pageIndex = 0;
  pageSize = 20;
  pageCount = 0;
  titleGrid = '';
  isLoadData = false;
  pageSizeOptions = [10, 20, 50, 100, 150, 200, 250];
  fields: Field[] = [];
  isLockingColumn = false;
  sort?: ItemSort;
  filter?: ItemFilter[];
  gridType = GridType.Grid;
  buttons = [button.AddButton, button.RefreshButton, button.LockingColumnButton];
  constructor(private gridService: IGridService<T>) {
    gridService.getFields().pipe().subscribe(fields => {
      this.fields = fields;
      this.init();
    });
  }
  init() {
    this.isLoadData = true;
    this.titleGrid = this.gridService.getTitle();
    this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }
  // addButton(button: Button) {
  //   this.buttons.push(button);
  // }
  loadData(page: {
    pageIndex: number
    pageSize: number
  }, sort?: ItemSort, filter?: ItemFilter[]): void {
    this.gridService.getItems(page, filter, sort).pipe(
      catchError((error: any) => {
        return of({ success: false, message: error, result: null });
      }),
      map((res) => {
        return res;
      })).subscribe(res => {
        if (res && res.success && res.result) {
          this.isLoadData = false;
          this.dataSource = new MatTableDataSource<T>(res.result.items);
          this.totalItems = res.result.recordCount;
          this.pageCount = res.result.pageCount;
        } else {
          this.isLoadData = false;
        }
        // this.pageIndex = res.result.pageIndex;
      });
  }

  onClickButton(event: { buttonId: string, data?: any }) {
    switch (event.buttonId) {
      case button.AddButton.id:
        break;
      case button.EditButton.id:
        break;
      case button.DeleteButton.id:
        this.gridService.delete(event.data);
        break;
      case button.RefreshButton.id:
        this.isLoadData = true;
        this.pageIndex = 0;
        this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
        break;
      case button.LockingColumnButton.id:
        this.isLockingColumn = !this.isLockingColumn;
        break;
      case button.PrintButton.id:
        this.gridService.openDialog(3);
        break;
      default:
        break;
    }
  }
  onClickActionButton(event: { buttonId: string, data?: any, index: number }) {
    switch (event.buttonId) {
      case button.AddButton.id:
        break;
      case button.EditButton.id:
        break;
      case button.DeleteButton.id:
        this.gridService.delete(event.data).subscribe((res) => {
          if (res) {
            this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
          }
          else {
            //
          }
        });
        break;
      case button.PrintButton.id:
        this.gridService.openDialog(3);
        break;
      default:
        break;
    }
  }
  handleChangeLockingColumn() {
    this.isLockingColumn = !this.isLockingColumn;
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    }, this.sort, this.filter);
  }

  onCheckboxListChanged(event: {
    item: any;
    indexColumn: number;
    indexRow: number;
  }): void {
    // console.log('checkbox change');
  }
  onSelectColumn(event: { index: number }) {
    this.dataSource.data.map((value: any) => {
      return (value[this.fields[event.index].name] =
        !value[this.fields[event.index].name]);
    });
  }
  onSortColumn(event: { name: string; direction: string }) {
    this.sort = { name: event.name, direction: event.direction };
    const filter: ItemFilter[] = this.fields.filter(x => x.allowFilter == true).map((item) => {
      const temp: ItemFilter = { name: item.name, value: item.search };
      return temp;
    });
    this.pageIndex = 0;
    this.loadData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }, this.sort, filter);
  }
  onFilter(event: { item: ItemFilter[] }) {
    this.pageIndex = 0;
    this.filter = event.item;
    this.loadData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }, this.sort, event.item);
  }
  onSearch() {
    const temp = this.fields.filter(x => x.allowFilter == true);
    const filter: ItemFilter[] = temp.map((item) => {
      const temp: ItemFilter = { name: item.name, value: item.search };
      return temp;
    });
    this.filter = filter;
    this.pageIndex = 0;
    this.loadData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }, this.sort, filter);
  }
}
// export interface Grid {}
export interface IGridService<T> {
  getItems(page: { pageIndex: number, pageSize: number }, filter?: ItemFilter[], sort?: ItemSort): Observable<Result<T>>;
  getItem(id: string): Observable<T>;
  getFields(): Observable<Field[]>;
  openDialog(type: number): void;
  delete(data: any): Observable<boolean>;
  getTitle(): string;
}

export interface IGridServiceV2<T> extends IGridService<T> {
  handleService(event: any, data: T[], func: any): any;
}
export interface Result<T> {
  success: boolean,
  message: string,
  result: {
    pageIndex: number,
    pageCount: number,
    pageSize: number,
    recordCount: number,
    items: T[]
  }
}
export interface ItemFilter {
  name: string;
  value: any;
  operator?: string;
  isRequired?: boolean;
}

export interface ItemSort {
  name: string;
  direction: string;
}

export interface Button {
  id: string;
  name: string;
  icon: string;
  buttonColor: string;
  iconColor: string;
  activeColor: string;
  class?: string;
}

export const GridType = { Grid: 0, Lookup: 1, GridDetail: 2, Category: 4 };