import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LookupData } from './lookup-v2.model';
import button from '@app/_common/button';
import { MatTableDataSource } from '@angular/material/table';
import { Field, ItemSort, ItemFilter, GridType, IGridService, IGridServiceV2 } from '../gridV2/grid.model';
import { LookupV2Service } from './lookup-v2.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category/category.service';
import { catchError, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getResource } from '@app/_common/commonFunction';
@Component({
  selector: 'app-lookup',
  templateUrl: './lookup-v2.component.html',
  styleUrls: ['./lookup-v2.component.scss']
})
export class LookupV2Component {
  @Input() buttons = [button.AddButton, button.RefreshButton, button.LockingColumnButton];
  lookupData!: LookupData;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  totalItems = 0;
  pageIndex = 0;
  pageSize = 20;
  pageCount = 0;
  titleGrid = '';
  pageSizeOptions = [10, 20, 50, 100, 150, 200, 250];
  fields: Field[] = [];
  isLockingColumn = false;
  sort?: ItemSort;
  filter?: ItemFilter[];
  gridType = GridType.Lookup;
  lookupService!: LookupV2Service;
  constructor(
    public dialogRef: MatDialogRef<LookupV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: LookupData,
    private http: HttpClient, dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: Router) {

    this.lookupService = new LookupV2Service(http, dialog);
    this.lookupData = data;
    this.lookupService.initData(data);
    this.lookupService.getFields().pipe().subscribe(fields => {
      this.fields = fields;
      this.init();
    });

    // this.multipleChoose = data.multipleChoose;
  }
  ngOnInit(): void {
    //
  }

  onClickItemLookup(event: { item: any }) {
    this.dialogRef.close(event.item);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onClickChoose() {
    this.dialogRef.close(this.dataSource.data.filter(item => item.choose));
  }
  onHanleCheckboxListChanged(event: {
    item: any;
    indexColumn: number;
    indexRow: number;
  }): void {
    this.lookupService.handleService(event, this.dataSource.data, 'checkboxChange');
  }

  init() {
    this.titleGrid = this.lookupService.getTitle();
    this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }
  // addButton(button: Button) {
  //   this.buttons.push(button);
  // }
  loadData(page: {
    pageIndex: number
    pageSize: number
  }, sort?: ItemSort, filter?: ItemFilter[]): void {
    this.lookupService.getItems(page, filter || [], sort || { name: '', direction: '' }).subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res.result.items);
      this.totalItems = res.result.recordCount;
      this.pageCount = res.result.pageCount;
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
        this.lookupService.delete(event.data);
        break;
      case button.RefreshButton.id:
        this.pageIndex = 0;
        this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
        break;
      case button.LockingColumnButton.id:
        this.isLockingColumn = !this.isLockingColumn;
        break;
      case button.PrintButton.id:
        this.lookupService.openDialog(3);
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
        this.lookupService.delete(event.data).subscribe((res: any) => {
          if (res) {
            this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
          }
          else {
            //
          }
        });
        break;
      case button.PrintButton.id:
        this.lookupService.openDialog(3);
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
    this.loadData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }, this.sort, event.item);
  }
  onSearch() {
    const filter: ItemFilter[] = this.fields.filter(x => x.allowFilter == true).map((item) => {
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