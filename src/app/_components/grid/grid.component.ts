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
import { Field, GridType } from './grid.model';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import button from '@app/_common/button';
import { GridService } from './grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('tblHeader') tblHeader!: ElementRef;
  @ViewChild('tblContent') tblContent!: ElementRef;
  @ViewChild('paginatorRef') paginatorRef!: ElementRef;
  @ViewChild('buttonRef') buttonRef!: ElementRef;
  @ViewChild('grid') gridRef!: ElementRef;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @Input() gridType = GridType.Grid;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100, 150, 200];
  @Input()
  dataSource!: MatTableDataSource<any>;
  @Input() titleGrid = '';
  @Input() fields!: Field[];
  @Input() isLockingColumn = false;
  @Input() buttons = [button.AddButton, button.EditButton, button.DeleteButton, button.RefreshButton, button.LockingColumnButton];
  @Output() handlePaging = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();
  @Output() handleButton = new EventEmitter<{
    buttonId: string;
    data?: any;
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

  title!: string[];
  titleSearch!: string[];
  focusRow = -1;
  @Input() isLoadData = false;

  // @ViewChild(MatTable, {read: ElementRef})

  constructor(
    library: FaIconLibrary,
    private paginatorCustom: MatPaginatorIntl,
    private gridService: GridService
  ) {
    library.addIcons(faSearch);
    library.addIconPacks(fas, far);
    paginatorCustom.itemsPerPageLabel = 'Số bản ghi 1 trang';
    paginatorCustom.firstPageLabel = 'Trang đầu';
    paginatorCustom.lastPageLabel = 'Trang cuối';
    paginatorCustom.nextPageLabel = 'Trang kế tiếp';
    paginatorCustom.previousPageLabel = 'Trang trước';
    paginatorCustom.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number,
    ) => {
      const startIndex = page * pageSize + 1;
      const endIndex = (page + 1) * pageSize;
      const totalItems = length;
      return `Trang ${page + 1}/${Math.ceil(
        totalItems / pageSize,
      )} hiển thị ${startIndex}-${endIndex} trong số tổng số ${totalItems} hàng`;
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && !changes['fields'].firstChange) {
      if (changes['fields'].currentValue.length !== changes['fields'].previousValue.length) {
        this.title = this.fields.map(item => item.name);
        this.titleSearch = this.fields.map(item => 'search' + item.name);
      }
    }
    if (!this.isLoadData) {
      if (changes['dataSource']) {
        this.isLoadData = !changes['dataSource'].firstChange;
      }
    }
  }
  ngOnInit(): void {
    //
  }
  ngAfterViewInit(): void {
    // console.log(this.fields);
    const paginator = this.paginatorRef.nativeElement.offsetHeight;
    const button = this.buttonRef ? this.buttonRef.nativeElement.offsetHeight : 0;
    const tblHeader = this.tblHeader.nativeElement.offsetHeight;
    this.tblContent.nativeElement.style.height = `calc(100% - ${paginator + tblHeader
      }px)`;

    this.gridRef.nativeElement.style.height = `calc(100% - ${button
      }px)`;
    // this.dataSource.sort = this.sort || new MatSort();
    this.tblContent.nativeElement.addEventListener('scroll', () => {
      this.tblHeader.nativeElement.scrollLeft =
        this.tblContent.nativeElement.scrollLeft;
    });
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
    this.focusRow = index;
  }
  onPageChange(event: any): void {
    this.resetColumnWidth();
    this.handlePaging.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
  sortData(event: Sort) {
    this.resetColumnWidth();
    this.handleSortColumn.emit({
      name: event.active,
      direction: event.direction,
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
      this.resetColumnWidth();
      this.handleSearch.emit();
    }
  }
  onClickButton($event: any, id: string) {
    $event.preventDefault();
    // this.resetColumnWidth();
    switch (id) {
      case button.AddButton.id:
        this.gridService.navigateCreate();
        break;
      case button.EditButton.id:
        this.gridService.navigateUpdate(this.focusRow, this.dataSource.data[this.focusRow], this.fields.filter((item) => item.isPrimaryKey === true));
        break;
      case button.DeleteButton.id:
        this.gridService
          .onClickDelete(this.focusRow, this.dataSource.data[this.focusRow], this.fields.filter((item) => item.isPrimaryKey === true))
          .subscribe(result => {
            if (result) {
              const data = this.fields.filter((item) => item.isPrimaryKey === true).map((value, index) => {
                return { key: value.name, value: this.dataSource.data[this.focusRow][value.name] };
              });
              this.handleButton.emit({ buttonId: id, data: data });
            }
          });
        break;
      default:
        this.handleButton.emit({ buttonId: id, data: this.dataSource.data[this.focusRow] });
        break;
    }
  }
  resetColumnWidth() {
    const header = this.tblHeader.nativeElement.querySelectorAll('th.header');
    this.fields = this.fields.map((item, index) => {
      return { ...item, width: header[index].offsetWidth };
    });
  }
  onhandleLookup(element: any, column: Field) {
    if (column.isPrimaryKey && this.gridType === 1) {
      this.handleItemLookup.emit({ item: element });
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
}
