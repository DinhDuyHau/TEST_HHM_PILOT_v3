import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Field, Grid, GridType, ItemFilter, ItemSort, PivotReportConfig } from '../gridV2/grid.model';
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
import { forkJoin } from 'rxjs';
const removeButtonList = require('@assets/fields/report/removeButton.json');


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
  pivotConfig: PivotReportConfig = new PivotReportConfig();
  isLockingColumn = false;
  sort?: ItemSort;
  filter?: ItemFilter[];
  gridType = GridType.Category;
  reportService!: ReportService;
  isLoadReport = false;
  isPivotReport = false;
  removeButton = [];

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
      this.removeButton = removeButtonList[this.entity];
      //    buttons = [button.FilterButton, button.PrintButton, button.RefreshButton, button.LockingColumnButton, button.ExportButton];
      for (const item in this.removeButton) {
        if (this.removeButton.hasOwnProperty(item)) {
          const value = this.removeButton[item];
          console.log(`Key: ${item}, Value:`, value);
          if (item && item == 'isFilterButton' && value) {
            this.buttons = this.buttons.filter(btn => btn !== button.FilterButton);
          }
          if (item && item == 'isPrintButton' && value) {
            this.buttons = this.buttons.filter(btn => btn !== button.PrintButton);
          }
          if (item && item == 'isRefreshButton' && value) {
            this.buttons = this.buttons.filter(btn => btn !== button.RefreshButton);
          }
          if (item && item == 'isLockingColumnButton' && value) {
            this.buttons = this.buttons.filter(btn => btn !== button.LockingColumnButton);
          }
          if (item && item == 'isExportButton' && value) {
            this.buttons = this.buttons.filter(btn => btn !== button.ExportButton);
          }
        }
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
    // Reset trạng thái pivot trước khi gọi API để tránh giữ giá trị cũ
    this.isPivotReport = false;

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
        const result = res.result as any;
        const data = res.result.items;
        const field = this.fields.find(x => x.link);
        if (field) {
          data.forEach(x => {
            const link = this.mapperVoucher.get(x.ma_ct)?.link as string || '';
            x.linkToVoucher = this.mapperVoucher.get(x.ma_ct)?.link + (link.includes('voucher/') ? '/view?stt_rec=' : '/view?key=') + (field.key ? x[field.key] : x['stt_rec']);
          });
        }

        // gán biến xác định là báo cáo xoay, luôn ép kiểu boolean
        this.isPivotReport = !!result.isPivotReport;

        // nếu là báo cáo xoay thì thêm cột vào bảng dựa vào extraTables
        if (this.isPivotReport) {
          // gọi cấu hình và lấy lại fields chuẩn để dựng
          forkJoin([
            this.reportService.getPivotConfig(),
            this.reportService.getFields()
          ]).subscribe(([pivot, fields]) => {
            this.pivotConfig = pivot;
            this.fields = fields;

            // GHÉP CỘT PIVOT TỪ CẤU HÌNH GỐC
            this.fields = this.insertPivotColumns(this.fields, result.extraTables, this.pivotConfig);

            // PROCESS DATA
            const updatedItems = this.processPivotDataToItemsDynamic(result.items);
            this.dataSource = new MatTableDataSource<any>(updatedItems);
          });
        } else {
          this.dataSource = new MatTableDataSource<any>(res.result.items);
        }

        this.totalItems = res.result.recordCount;
        this.pageCount = res.result.pageCount;
        this.isLoadReport = false;
      }
      else {
        this.isPivotReport = false;
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
        this.reportService.exportExcel(this.entity, this.filter, this.fields, this.isPivotReport);
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
  /* Old function */
  // onSortColumn(event: { name: string; direction: string }) {
  //   this.sort = { name: event.name, direction: event.direction };
  //   const filter: ItemFilter[] = this.fields.filter(x => x.allowFilter == true).map((item) => {
  //     const temp: ItemFilter = { name: item.name, value: item.search };
  //     return temp;
  //   });
  //   this.pageIndex = 0;
  //   this.loadData({
  //     pageIndex: this.pageIndex,
  //     pageSize: this.pageSize,
  //   }, this.sort, filter, false);
  // }
  onSortColumn(event: { name: string; direction: string }) {
    this.sort = { name: event.name, direction: event.direction };
    const filter: ItemFilter[] = [
      {
        name: "order_by",
        value: `${event.name} ${event.direction}`,
      },
    ];
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

  insertPivotColumns(fields: any[], extraTables: any[][], pivotConfig: PivotReportConfig): any[] {
    if (!pivotConfig || !extraTables || extraTables.length <= pivotConfig.extraTableIndex) return fields;

    const pivotCols = extraTables[pivotConfig.extraTableIndex];
    const startIndex = pivotConfig.startInsertColumnIndex ?? fields.length;
    const fieldPrefixRegex = /^([a-zA-Z0-9_]+)\$\d+$/;

    const pivotFields: any[] = [];

    // Tập tên cột pivot sẽ được thêm
    const pivotFieldNames = pivotCols.map(col => col[pivotConfig.pivotDataField]?.trim());
    // Xoá các cột động cũ (nằm trong pivotFieldNames), giữ lại cột gốc
    const baseFields = fields.filter(f => !pivotFieldNames.includes(f.name));

    pivotCols.forEach((col: any) => {
      const header = col[pivotConfig.pivotHeaderField];
      const name = col[pivotConfig.pivotDataField];

      if (pivotConfig.excludeHeaders?.includes(header)) return;

      // Phân tích prefix từ "so_luong$1" -> "so_luong"
      const match = name.match(fieldPrefixRegex);
      const baseName = match ? match[1] : name;

      // Tìm field gốc trong cấu hình ban đầu
      const baseField = fields.find(f => f.name === baseName);

      // tính toán độ rộng cột dựa trên độ dài của tiêu đề
      const estimatedWidth = Math.min(Math.max(header.length * 15, 80), 200);

      const newField = {
        name: name.trim(),
        title: header.trim(),
        isLockingColumn: true,
        allowSorting: false,
        allowFilter: false,
        width: estimatedWidth,
        type: baseField?.type || '',
        dataFormatString: baseField?.dataFormatString || '',
        align: baseField?.align || '',
      };

      pivotFields.push(newField);
    });

    return [
      ...baseFields.slice(0, startIndex),
      ...pivotFields,
      ...baseFields.slice(startIndex)
    ];
  }

  processPivotDataToItemsDynamic(items: any[]) {
    // convert value = 0 thành ''
    return items.map(row => {
      const newRow: any = {};
      for (const key in row) {
        const value = row[key];
        newRow[key] = value === 0 ? '' : value;
      }
      return newRow;
    });
  }

}
