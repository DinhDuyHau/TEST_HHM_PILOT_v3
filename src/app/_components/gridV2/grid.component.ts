import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Field, GridType, ItemFilter } from './grid.model';
import { IconName, fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import button from '@app/_common/button';
import { GridService } from './grid.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { AdvancedSearchDialogComponent } from '@app/sales-management/component/advanced-search/advanced-search-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getMenuReport } from '@app/_common/commonFunction';
import { MenuReport, StatusTicket } from '@app/_models';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { StatusVoucher } from '@app/_services';

@Component({
  selector: 'app-grid-v2',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridV2Component implements AfterViewInit, OnInit, OnChanges {
  // @ViewChild('tblHeader') tblHeader!: ElementRef;
  @ViewChild('tblContent') tblContent!: ElementRef;
  @ViewChild('paginatorRef') paginatorRef!: ElementRef;
  @ViewChild('buttonRef', { static: true }) buttonRef!: ElementRef;
  @ViewChild('grid') gridRef!: ElementRef;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @Input() disabled = false;
  @Input() gridType = GridType.Grid;
  @Input() isChoose = false;
  @Input() multipleChoose = false;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() pageCount = 0;
  @Input() totalItems = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100, 150, 200];
  @Input()
  dataSource!: MatTableDataSource<any>;
  @Input() titleGrid = '';
  @Input() filter_mess = '';
  @Input() sysid = '';
  @Input() voucherCode = '';
  @Input() fields!: Field[];
  @Input() isLockingColumn = false;
  @Input() buttons = [button.AddButton, button.RefreshButton, button.LockingColumnButton];
  @Input() actionButtons = [button.ViewButton, button.EditButton, button.DeleteButton];
  @Output() handlePaging = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();
  @Output() handleButton = new EventEmitter<{
    buttonId: string;
    data?: any;
  }>();
  @Output() handleActionButton = new EventEmitter<{
    buttonId: string;
    data?: any;
    index: number;
  }>();
  @Output() handleSelectColumn = new EventEmitter<{ index: number }>();
  @Output() handleSortColumn = new EventEmitter<{
    name: string;
    direction: string;
  }>();
  @Output() handleLockingColumn = new EventEmitter();
  @Output() handleSearch = new EventEmitter();
  @Output() handleChangeCheckbox = new EventEmitter<{
    item: any;
    indexColumn: number;
    indexRow: number;
    checked: boolean;
  }>();
  @Output() handleItemLookup = new EventEmitter<{ item: any }>();
  @Output() handleRemoveItem = new EventEmitter<{ item: any }>();
  @Output() handleAddService = new EventEmitter<{ item: any }>();
  @Output() handleAddImei = new EventEmitter<{ item: any }>();
  @Output() handleFilter = new EventEmitter<{ item: any }>();
  @Output() handleChangeRow = new EventEmitter<{ item: any }>();
  title!: string[];
  titleSearch!: string[];
  focusRow = -1;
  menu_report: MenuReport[] = [];
  buttonPrintId = button.PrintButton.id;
  @Input() isLoadData = false;
  @Input() isLoadReport = false;
  searchAvanced = '';
  // @ViewChild(MatTable, {read: ElementRef})
  getDataMode = 0;
  advanceSearchParams: any;
  quickSearchParams: any;
  dataMode = {
    GETOP: 0,
    ADVANDCE_SEARCH: 1,
    QUICK_SEARCH: 2
  };
  statusList: StatusTicket[] = [];

  selected_row_item: any;

  constructor(
    library: FaIconLibrary,
    private gridService: GridService,
    private commonService: CommonService,
    private snack: MatSnackBar,
    private ticketApiService: TicketApiService,
    private statusVoucher: StatusVoucher
  ) {
    library.addIcons(faSearch);
    library.addIconPacks(fas, far);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && !changes['fields'].firstChange) {
      if (changes['fields'].currentValue.length !== changes['fields'].previousValue.length) {
        this.title = this.fields.filter(item => !item.hidden).map(item => item.name);
        this.titleSearch = this.fields.filter(item => !item.hidden).map(item => 'search' + item.name);
      }
    }
    if (this.isLoadData) {
      if (changes['dataSource']) {
        this.isLoadData = changes['dataSource'].firstChange;
      }
    }
  }
  ngOnInit(): void {
    this.menu_report = getMenuReport(this.sysid);
    if (this.gridType == GridType.Grid) {
      this.statusVoucher.getStatus(this.voucherCode).subscribe(result => {
        this.statusList = result;
      });
    }
  }
  ngAfterViewInit(): void {
    // console.log(this.fields);
    const paginator = 0;
    const button = this.buttonRef ? this.buttonRef.nativeElement.offsetHeight + 20 : 0;
    // const tblHeader = this.tblHeader.nativeElement.offsetHeight;
    // this.tblContent.nativeElement.style.height = `calc(100% - ${paginator
    //   }px)`;

    this.gridRef.nativeElement.style.height = `calc(100% - ${button
      }px)`;
    // this.dataSource.sort = this.sort || new MatSort();
    // this.tblContent.nativeElement.addEventListener('scroll', () => {
    //   this.tblHeader.nativeElement.scrollLeft =
    //     this.tblContent.nativeElement.scrollLeft;
    // });
  }
  isSticky(id: string) {
    if (
      this.fields.find(item => {
        return item.name === id && item.isLockingColumn;
      }) !== undefined &&
      this.isLockingColumn
    ) {
      return true;
    }
    return false;
  }
  onClickRow(item: any, index: number) {
    this.selected_row_item = item;
    this.focusRow = index;
    this.handleChangeRow.emit(item);
  }
  onChangePageSize(event: any) {
    this.pageSize = event.target.value;
    this.handlePaging.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
    //
  }
  onClickChangePage(event: any) {
    if (event == 'prev') {
      if (this.pageIndex == 0) return;
      this.pageIndex--;
      this.handlePaging.emit({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
    }
    else {
      if (this.pageIndex == this.pageCount - 1) return;
      this.pageIndex++;
      this.handlePaging.emit({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
    }
    //
  }
  onPageChange(event: any): void {
    this.resetColumnWidth();
    this.handlePaging.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
  sortData(column: Field) {
    switch (column.directive) {
      case '':
        column.directive = 'desc';
        break;
      case 'desc':
        column.directive = 'asc';
        break;
      case 'asc':
        column.directive = '';
        break;
      default:
        break;
    }
    this.fields.forEach((item) => {
      if (item.name !== column.name) {
        item.directive = '';
      }
    });
    this.resetColumnWidth();
    this.handleSortColumn.emit({
      name: column.name,
      direction: column.directive,
    });
  }
  onCheckboxChange(item: any, indexColumn: number, indexRow: number, checked: boolean) {
    this.handleChangeCheckbox.emit({ item, indexColumn, indexRow, checked });
  }
  onClickSelectColumn(index: number) {
    this.handleSelectColumn.emit({ index });
  }
  onSearch(event: any) {
    if (event.key === 'Enter') {
      this.onClickSearch();
    }
  }
  onClickSearch() {
    this.resetColumnWidth();
    this.handleSearch.emit();
  }
  onSearchAvanced(value: string) {
    const params = {} as any;
    params.so_ct = value;
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    params.ma_ct = this.voucherCode;
    params.ma_cuahang = userObj['shop'];
    this.pageIndex = 1;
    this.quickSearch(params);
  }
  quickSearch(params: any) {
    const observer = {
      next: (result: any) => {
        this.dataSource.data = result.result.items; this.totalItems = result.result.recordCount;
      },
      error: () => {
        //
      },
      complete: () => {
        this.isLoadData = false;
        this.focusRow = -1;
      }
    };
    if (!this.isLoadData) {
      this.getDataMode = this.dataMode.QUICK_SEARCH;
      this.isLoadData = true;
      this.ticketApiService.getTicketByQuickSearch(this.sysid, params, this.pageIndex, this.pageSize).subscribe(observer);
    }
  }
  onClickSearchAvanced() {
    this.resetColumnWidth();
    // this.handleSearchAvanced.emit();
  }
  onClickPrint(item: MenuReport) {
    if (this.focusRow == -1 && this.gridType == GridType.Grid) {
      this.snack.open('Bạn phải chọn hàng trước khi in', 'Đóng', { duration: 5000 });
      return;
    }
    else {
      if (this.gridType == GridType.Grid) {
        this.isLoadReport = true;
        this.gridService.openPrintDialog(this.dataSource.data[this.focusRow].stt_rec, item).then((value) => {
          if (value) {
            this.isLoadReport = false;
            // this.handleButton.emit({ buttonId: button.PrintButton.id, data: this.dataSource.data[this.focusRow] });
          }
        });
      }
      else {
        this.handleButton.emit({ buttonId: button.PrintButton.id, data: item });
      }
    }
  }
  onClickButton($event: any, id: string) {
    $event.preventDefault();
    const buttonActive = this.buttons.find(x => x.id == id);
    if (buttonActive) {
      const temp = buttonActive.activeColor;
      buttonActive.activeColor = buttonActive.iconColor;
      buttonActive.iconColor = temp;
    }
    // this.resetColumnWidth();
    switch (id) {
      case button.AddButton.id:
        this.gridService.navigateCreate();
        break;
      case button.PrintButton.id:
        if (this.gridType == GridType.Grid) {
          if (this.menu_report && this.menu_report.length == 1) {
            if (this.focusRow == -1 && this.gridType == GridType.Grid) {
              this.snack.open('Bạn phải chọn hàng trước khi in', 'Đóng', { duration: 5000 });
              return;
            }
            this.isLoadReport = true;
            this.gridService.openPrintDialog(this.dataSource.data[this.focusRow].stt_rec, this.menu_report[0]).then((value) => {
              if (value) {
                this.isLoadReport = false;
              }
            });
          }
          else if (!this.menu_report || this.menu_report.length == 0) {
            this.snack.open('Chứng từ này chưa có mẫu in', 'Đóng', { duration: 5000 });
            return;
          }
        }
        else {
          if (!this.menu_report || this.menu_report.length == 0) {
            this.snack.open('Báo cáo này chưa có mẫu in', 'Đóng', { duration: 5000 });
            return;
          }
          this.handleButton.emit({ buttonId: id, data: this.menu_report[0] });
        }
        break;
      case button.ViewButton.id:
        if (this.selected_row_item) {
          this.gridService.navigateView(this.selected_row_item, this.fields.filter((item) => item.isPrimaryKey === true));
        }
        break;
      case button.EditButton.id:
        if (this.selected_row_item && this.sysid) {
          this.ticketApiService.getVoucherStatus(this.sysid, this.selected_row_item.stt_rec).subscribe((result: any) => {
            if (result && result.status === '0') {
              this.gridService.navigateUpdate(this.selected_row_item, this.fields.filter((item) => item.isPrimaryKey === true));
            } else {
              this.commonService.showMessage('Phiếu đã thay đổi trạng thái, không thể sửa!');
            }
          });
        }
        break;
      case button.DeleteButton.id:
        if (this.selected_row_item && this.sysid) {
          this.ticketApiService.getVoucherStatus(this.sysid, this.selected_row_item.stt_rec).subscribe((result: any) => {
            if (result && result.status === '0') {
              const data = this.fields.filter((item) => item.isPrimaryKey === true).map((value, index) => {
                return { key: value.name, value: this.selected_row_item[value.name] };
              });
              this.handleActionButton.emit({ buttonId: id, data: data, index: this.focusRow });
            } else {
              this.commonService.showMessage('Phiếu đã thay đổi trạng thái, không thể xóa!');
            }
          });
        }
        break;
      default:
        this.handleButton.emit({ buttonId: id, data: this.dataSource.data[this.focusRow] });
        break;
    }
  }
  onClickActionButton($event: any, id: string, dataRow: any, indexRow: number) {
    $event.preventDefault();
    // this.resetColumnWidth();
    switch (id) {
      case button.ViewButton.id:
        this.gridService.navigateView(dataRow, this.fields.filter((item) => item.isPrimaryKey === true));
        break;
      case button.EditButton.id:
        this.gridService.navigateUpdate(dataRow, this.fields.filter((item) => item.isPrimaryKey === true));
        break;
      case button.LockingColumnButton.id:
        this.isLockingColumn = !this.isLockingColumn;
        break;
      case button.DeleteButton.id:
        this.gridService
          .onClickDelete(dataRow, this.fields.filter((item) => item.isPrimaryKey === true))
          .subscribe(result => {
            if (result) {
              if (dataRow['status'] == '2') {
                this.snack.open('Trạng thái này không thể xóa', 'Đóng', { duration: 5000 });
                return;
              }
              const data = this.fields.filter((item) => item.isPrimaryKey === true).map((value, index) => {
                return { key: value.name, value: dataRow[value.name] };
              });
              this.handleActionButton.emit({ buttonId: id, data: data, index: indexRow });
            }
          });
        break;
      case button.DeleteGridButton.id:
        this.gridService
          .onClickDeleteGrid()
          .subscribe(result => {
            if (result) {
              this.handleActionButton.emit({ buttonId: id, data: dataRow, index: indexRow });
            }
          });
        break;
      default:
        this.handleActionButton.emit({ buttonId: id, data: dataRow, index: indexRow });
        break;
    }
  }
  openAdvancedSearchDialog() {
    const dialog = this.commonService.openDialog(AdvancedSearchDialogComponent, { voucherCode: this.voucherCode }, 'search-style-dialog');
    dialog.afterClosed().subscribe((item) => {
      if (this.isLoadData) {
        this.isLoadData = false;
        this.focusRow = -1;
      }
      const filter: ItemFilter[] = [];
      Object.keys(item).forEach(key => {
        filter.push({ name: key, operator: '=', value: item[key] });
      });
      if (filter.length) {
        this.handleFilter.emit({ item: filter });
      }
    });
  }
  resetColumnWidth() {
    // const header = this.tblHeader.nativeElement.querySelectorAll('th.header');
    // this.fields = this.fields.map((item, index) => {
    //   return { ...item, width: header[index].offsetWidth };
    // });
  }
  onhandleLookup(element: any, column: Field) {
    if (column.link) {
      const url = element.linkToVoucher.toString().replace('stt_rec', 'key');
      window.open(url, '_blank');
    }
    if (column.isPrimaryKey && this.gridType === 1 && !this.multipleChoose) {
      this.handleItemLookup.emit({ item: element });
    }
    if (this.isChoose == true) {
      this.disabled == true
      console.log('Run')
    }
  }

  onHandleRemoveItem(element: any) {
    this.handleRemoveItem.emit({ item: element });
  }

  onHandleAddService(element: any) {
    this.handleAddService.emit({ item: element });
  }

  onHandleAddImei(element: any) {
    this.handleAddImei.emit({ item: element });
  }
  public castIcon(value: string): IconName {
    return value as IconName;
  }
  isHideButtonAction(element: any, buttonId: string) {
    const status = element['status'];
    let statusCheck: StatusTicket | undefined;
    if (status == undefined)
      return false;
    switch (buttonId) {
      case button.ViewButton.id:
        return false;
      case button.EditButton.id:
        statusCheck = this.statusList.find((x) => {
          return x.status == status;
        }) || undefined;
        if (statusCheck) {
          if (statusCheck.xdefault || statusCheck.xedit) {
            return false;
          }
          else return true;
        }
        return false;
      case button.DeleteButton.id:
        statusCheck = this.statusList.find((x) => {
          return x.status == status;
        }) || undefined;
        if (statusCheck) {
          if (statusCheck.xdel) {
            return false;
          }
          else return true;
        }
        return false;
      default:
        return false;
    }
  }
  handleChangeInput(name: string, row: number, event: any) {
    this.dataSource.data[row][name] = event.target.value;
  }
}
