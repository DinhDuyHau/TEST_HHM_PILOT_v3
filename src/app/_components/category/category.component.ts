import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Field, Grid, GridType, ItemFilter, ItemSort } from '../gridV2/grid.model';
import { CategoryService } from './category.service';
import button from '@app/_common/button';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../_shared/sidebar/sidebar.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})


export class CategoryComponent implements OnInit, OnChanges {
  @Input() entity = '';
  @Input() title = '';
  @Input() name = '';
  @Input() buttons = [button.RefreshButton, button.LockingColumnButton];
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
  gridType = GridType.Category;
  categoryService!: CategoryService;
  type = 1;
  constructor(http: HttpClient, dialog: MatDialog, private route: Router, private sidebarService: SidebarService) {
    this.categoryService = new CategoryService(http, dialog);
    if (this.route.url !== '/' && !this.entity) {
      const menu = this.sidebarService.getMenuFromLocalStorage().find(item => this.route.url == item.link && item.link !== '');
      this.title = menu?.bar || '';
      this.entity = menu?.sysid || '';
      this.name = menu?.sysid || '';
    }
    else {
      this.type = 2;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //
  }
  ngOnInit(): void {

    this.categoryService.initData(this.entity, this.title, this.name);
    this.categoryService.getFields().pipe().subscribe(fields => {
      this.fields = fields;
      this.init();
    });
    //
  }
  init() {
    this.titleGrid = this.categoryService.getTitle();
    this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }
  // addButton(button: Button) {
  //   this.buttons.push(button);
  // }
  loadData(page: {
    pageIndex: number
    pageSize: number
  }, sort?: ItemSort, filter?: ItemFilter[]): void {
    this.categoryService.getItems(page, filter || [], sort || { name: '', direction: '' }).subscribe(res => {
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
        this.categoryService.delete(event.data);
        break;
      case button.RefreshButton.id:
        this.pageIndex = 0;
        this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
        break;
      case button.LockingColumnButton.id:
        this.isLockingColumn = !this.isLockingColumn;
        break;
      case button.PrintButton.id:
        this.categoryService.openDialog(3);
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
        this.categoryService.delete(event.data).subscribe((res: any) => {
          if (res) {
            this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
          }
          else {
            //
          }
        });
        break;
      case button.PrintButton.id:
        this.categoryService.openDialog(3);
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