import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Field, Grid, GridType, ItemFilter, ItemSort } from '../gridV2/grid.model';
import { ReportService } from './report.service';
import button from '@app/_common/button';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../_shared/sidebar/sidebar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatData, getFirstDayOfMonth, getLastDayOfMonth, getResource } from '@app/_common/commonFunction';
import { Control } from '../filter/filter.model';
import { DataFormatPipe } from '@app/_pipe/dataFormat/data-format.pipe';
import dataFormat from '@app/_common/dataFormat';
import { MenuItem } from '../header/header.model';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnChanges {
  entity = '';
  title = '';
  name = '';
  filterMode = false;
  buttons = [button.FilterButton, button.PrintButton, button.RefreshButton, button.LockingColumnButton, button.ExportButton];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  totalItems = 0;
  pageIndex = 0;
  pageSize = 50;
  pageCount = 0;
  titleGrid = '';
  pageSizeOptions = [10, 20, 50, 100, 150, 200, 250];
  fields: Field[] = [];
  isLockingColumn = false;
  sort?: ItemSort;
  filter?: ItemFilter[];
  gridType = GridType.Category;
  reportService!: ReportService;
  isLoadReport = false;

  mapperVoucher: Map<string, any> = new Map();

  constructor(http: HttpClient, dialog: MatDialog, private route: Router, private sidebarService: SidebarService, private _snackBar: MatSnackBar) {
    this.reportService = new ReportService(http, dialog, _snackBar);
    if (this.route.url !== '/' && !this.entity) {
      const menu = this.sidebarService.getMenuFromLocalStorage().find(item => this.route.url == item.link && item.link !== '');
      this.title = menu?.bar || '';
      this.entity = menu?.sysid || '';
      this.name = menu?.sysid || '';
      this.filterMode = menu?.filterMode || false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //
  }
  ngOnInit(): void {
    this.reportService.initData(this.entity, this.title, this.name);
    this.reportService.getFields().pipe().subscribe(fields => {
      this.fields = fields;
      if (this.fields.find(x => x.link)) {
        const menu = JSON.parse(localStorage.getItem('menu') || '') as any[];
        const voucherInfo = JSON.parse(localStorage.getItem('dmct') || '') as any[];
        menu.forEach(item => {
          const vc_info = voucherInfo.find(x => x.entity.trim() == item.sysid.trim());
          if (vc_info) {
            this.mapperVoucher.set(vc_info.ma_ct, { ...vc_info, link: item.link });
          }
        });
      }
      if (this.filterMode == true) {
        this.openFilterModel();
      }
      else {
        this.init();
      }
    });
    //
  }
  init() {
    this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize }, undefined, undefined, true);
  }
  // addButton(button: Button) {
  //   this.buttons.push(button);
  // }
  loadData(page: {
    pageIndex: number
    pageSize: number
  }, sort?: ItemSort, filter?: ItemFilter[], reset?: boolean): void {
    if (!filter) {
      filter = [];
      filter.push({ name: 'tu_ngay', operator: '', value: localStorage.getItem('tu_ngay') || getFirstDayOfMonth(new Date()) });
      filter.push({ name: 'den_ngay', operator: '', value: localStorage.getItem('den_ngay') || getLastDayOfMonth(new Date()) });
      this.filter = filter;
    }
    const resetInList = filter.find(x => x.name == 'reset');
    if (resetInList) {
      resetInList.value = reset;
    }
    else {
      filter.push({ name: 'reset', operator: '', value: reset });
    }
    this.reportService.getItems(page, filter || [], sort || { name: '', direction: '' }).subscribe(res => {
      if (res && res.success) {
        const data = res.result.items;
        const field = this.fields.find(x => x.link);
        if (field) {
          data.forEach(x => {
            const link = this.mapperVoucher.get(x.ma_ct)?.link as string || '';
            x.linkToVoucher = this.mapperVoucher.get(x.ma_ct)?.link + (link.includes('voucher/') ? '/view?stt_rec=' : '/view?key=') + (field.key ? x[field.key] : x['stt_rec']);
          });
        }
        this.dataSource = new MatTableDataSource<any>(res.result.items);
        this.totalItems = res.result.recordCount;
        this.pageCount = res.result.pageCount;
        this.isLoadReport = false;
      }
      else {
        this.isLoadReport = false;
        this.dataSource = new MatTableDataSource<any>([]);
        this._snackBar.open(getResource(res.message), 'Đóng', { duration: 5000 });
      }
      // this.pageIndex = res.result.pageIndex;
    });
    let filter_mess = '';
    let control: Control;
    const filterMess = this.filter?.filter(x => x.value && (x.name != 'filters' && x.name != 'reset'));
    this.reportService.getFilterField().then(res => {
      filterMess?.forEach((item, index) => {
        res.control?.forEach(x => {
          x.forEach(y => {
            if (y.name == item.name) {
              control = y;
            }
          });
        });
        if (control) {
          filter_mess += control.label + ': ' + new DataFormatPipe().transform(item.value, control.type || 'text', (dataFormat as any)[control.dataFormatString || '']) + (index + 1 != filterMess?.length ? ', ' : '');
        }
      });
      this.titleGrid = filter_mess;
    });
  }
  onClickButton(event: { buttonId: string, data?: any }) {
    switch (event.buttonId) {
      case button.AddButton.id:
        break;
      case button.EditButton.id:
        break;
      case button.DeleteButton.id:
        this.reportService.delete(event.data);
        break;
      case button.RefreshButton.id:
        this.isLoadReport = true;
        this.pageIndex = 0;
        // this.filter = [];
        // this.sort = undefined;
        this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize }, this.sort, this.filter, true);
        break;
      case button.LockingColumnButton.id:
        this.isLockingColumn = !this.isLockingColumn;
        break;
      case button.PrintButton.id:
        this.isLoadReport = true;
        this.reportService.openPrintDialog({ pageIndex: this.pageIndex, pageSize: this.pageSize }, this.filter || [], this.sort || { name: '', direction: '', }, event.data).then((value) => {
          if (value) {
            this.isLoadReport = false;
          }
        });
        // this.reportService.openDialog(3);
        break;
      case button.FilterButton.id:
        this.openFilterModel();
        break;
      case button.ExportButton.id:
        this.reportService.exportExcel(this.entity, this.filter, this.fields);
        break;
      default:
        break;
    }
  }
  openFilterModel() {
    this.reportService.openFilterDialog().then(observer => {
      observer.subscribe(res => {
        this.isLoadReport = true;
        if (res) {
          this.filter = [];
          Object.keys(res).forEach((key) => {
            const temp = this.filter?.find((item) => item.name == key);
            if (temp) {
              temp.value = res[key];
            }
            else {
              this.filter?.push({ name: key, operator: '', value: res[key] });
            }
          });
          localStorage.setItem('tu_ngay', res['tu_ngay']);
          localStorage.setItem('den_ngay', res['den_ngay']);
          this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize }, this.sort, this.filter, true);
        }
        else {
          this.isLoadReport = false;
        }
      });
    });
  }
  onClickActionButton(event: { buttonId: string, data?: any, index: number }) {
    switch (event.buttonId) {
      case button.DeleteButton.id:
        this.reportService.delete(event.data).subscribe((res: any) => {
          if (res) {
            this.loadData({ pageIndex: this.pageIndex, pageSize: this.pageSize });
          }
          else {
            //
          }
        });
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
    }, this.sort, this.filter, false);
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
    }, this.sort, filter, false);
  }
  onFilter(event: { item: ItemFilter[] }) {
    this.pageIndex = 0;
    this.loadData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }, this.sort, event.item, false);
  }
  onSearch() {
    const filter: ItemFilter[] = this.fields.filter(x => x.allowFilter == true && x.search !== null).map((item) => {
      const temp: ItemFilter = { name: item.name, value: item.search };
      return temp;
    });
    // this.filter = this.filter?.filter(item => {
    //   return !filter.find(x => x.name === item.name);
    // });
    // if (this.filter) {
    //   this.filter = this.filter.concat(filter);
    // }
    const filters = this.filter?.find(x => x.name == 'filters');
    if (!filters) {
      this.filter?.push({ name: 'filters', value: filter });
    }
    else {
      filters.value = filter;
    }
    this.pageIndex = 0;
    this.loadData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }, this.sort, this.filter, false);
  }
}
