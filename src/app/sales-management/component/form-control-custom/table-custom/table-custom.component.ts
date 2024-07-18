import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { DialogConfirmComponent } from '@app/_components/dialog/dialog-confirm/dialog-confirm.component';
import { ItemFilter } from '@app/_components/gridV2/grid.model';
import { DataFormatPipe } from '@app/_pipe/dataFormat/data-format.pipe';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { Observable, Subscription, fromEvent, map, mergeMap, takeUntil, tap } from 'rxjs';

export class Cell {
  title = '';
  name = '';
  align = 'left';
  format!: string;
  dataType = 'string';
  type = 'text';
  isPrimaryKey = false;
  width?: string;
  minWidth?: string;
}

@Component({
  selector: 'table-custom',
  templateUrl: './table-custom.component.html',
  styleUrls: ['./table-custom.component.scss'],
})
export class TableCustomComponent implements
  OnInit,
  OnChanges,
  OnDestroy {
  @Input() entityName!: string;
  @Input() dataSource: any[] = [];
  @Input() tableType!: number;
  @Input() columns: any[] = [];
  @Input() totalItem!: number;
  @Input() page_index!: number;
  @Input() size!: number;
  @Input() select = false;
  @Input() type!: string;
  @Input() selectByCheckbox = false;
  @Input() readonly = false;
  @Input() isChangeColorWhenSelected = false;
  @Input() filters: ItemFilter[] = [];
  @Input() hiddenPagination = false;
  @Input() isLoading = false;
  @Input() isTicket = true;
  @Input() isShowDiscountNG = false;

  pageSizeOptions: number[] = [10, 20, 50, 100, 150, 200];

  @Output() handleSearch = new EventEmitter<any>();
  @Output() handleDelete = new EventEmitter<{ item: any }>();
  @Output() handleAction = new EventEmitter<{ item: any }>();
  @Output() handleSwap = new EventEmitter<{ item: any }>();
  @Output() handleAdd = new EventEmitter<{ item: any }>();
  @Output() handleAddPackage = new EventEmitter<{ item: any }>();
  @Output() handleUpdate = new EventEmitter<{ item: any }>();
  @Output() handleFilter = new EventEmitter<any>();
  @Output() handleChangePage = new EventEmitter<number>();
  @Output() handleChangePageSize = new EventEmitter<string>();
  @Output() handleSelect = new EventEmitter<{ item: any }>();  //handle when select item by click to primary key.
  @Output() handleChangeCheckbox = new EventEmitter<{ item: any, index: number, checked: boolean, columnName: string }>();
  @Output() handleView = new EventEmitter<any>();
  @Output() handleChangeInput = new EventEmitter<{ item: any, index: number, value: any, columnName: string }>();
  @Output() handleChangeSelectCheckbox = new EventEmitter<any>();
  @Output() handleAddDiscountNG = new EventEmitter<{ item: any }>();

  dataFormat = dataFormat;

  isAddCellBoder = false
  pageIndexRange: number[] = []
  pageIndexTotal!: number

  constructor(
    public commonService: CommonService,
    private renderer: Renderer2, private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.columns = this.columns.map(column => {
      return { ...new Cell(), ...column, format: (dataFormat as any)[column.format ? column.format : ''] };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["dataSource"]?.currentValue.length > 0) {
      this.pageIndexTotal = Math.trunc(this.totalItem / this.size) + 1

      const range = {
        start: 0,
        end: 0
      }

      if (this.page_index % 10 === 0) {
        range.start = this.page_index - 10 + 1
        range.end = this.page_index
      } else {
        range.start = this.page_index - this.page_index % 10 + 1
        range.end = this.page_index - this.page_index % 10 + 10
      }

      range.end = this.pageIndexTotal > range.end ? range.end : this.pageIndexTotal;

      this.pageIndexRange = []
      for (let i = range.start; i <= range.end; i++) {
        this.pageIndexRange.push(i)
      }
    }
  }

  onDeleteItem(item: any) {
    this.commonService.openDialog(DialogConfirmComponent).afterClosed().subscribe(result => {
      if (result) {
        this.handleDelete.emit({ item });
      }
    });
  }

  onActionItem(item: any) {
    this.handleAction.emit({ item });
  }

  onSwapItem(item: any) {
    this.handleSwap.emit({ item });
  }

  onAddForItem(item: any) {
    this.handleAdd.emit({ item });
  }

  onAddPackageForItem(item: any) {
    this.handleAddPackage.emit({ item });
  }

  onChangeCheckbox(item: any, index: number, event: any, columnName: string) {
    this.handleChangeCheckbox.emit({ item, index, checked: event.target.checked, columnName });
  }

  onChangeSelectCheckbox(item: {}) {
    const newItem = { ...item };
    this.handleChangeSelectCheckbox.emit(newItem);

  }

  onSelectItem(item: any, ref: HTMLElement) {
    if (this.isChangeColorWhenSelected) {
      const list = document.querySelectorAll('#record').forEach(x => x.classList.remove('selected'));
      ref.classList.add('selected');
    }
    this.handleSelect.emit({ item });
  }

  onUpdateItem(item: any) {
    this.handleUpdate.emit({ item });
  }

  onClickChangePage(action: string | number) {
    let pageIndexSelected = 0;
    if (action === 'prev') {
      if (this.page_index !== 1) {
        pageIndexSelected = this.page_index - 1;
      }
      else {
        return
      }
    }
    else if (action === 'next') {
      if (this.page_index !== this.pageIndexTotal) {
        pageIndexSelected = this.page_index + 1;
      }
      else {
        return
      }
    }
    else if (action === 'prev-range') {
      pageIndexSelected = this.pageIndexRange[0] - 10;
    } else if (action === 'next-range') {
      pageIndexSelected = this.pageIndexRange.slice(-1)[0] + 1;
    }
    else {
      pageIndexSelected = action as number
    }
    this.handleChangePage.emit(pageIndexSelected);
  }

  onChangePageSize(event: any) {
    this.handleChangePageSize.emit(event.target.value);
  }

  onClickSearch() {
    this.handleFilter.emit(this.filters);
  }

  onViewItem(item: any) {
    this.handleView.emit(item);
  }

  onChangeInput(item: any, index: number, value: any, columnName: string) {
    this.handleChangeInput.emit({ item, index, value, columnName });
  }

  onInput(ref: any, max: number, item: any, index: number, columnName: string) {
    const dataFormatPipe = new DataFormatPipe();
    const format = (dataFormat as any)['moneyViewFormat'];

    let value = ref.value.toString().replace(/\D/g, '') || '0';
    value = parseInt(value);
    value = value > max ? max : value;
    ref.value = dataFormatPipe.transform(value, 'number', format);
    this.dataSource[index][columnName] = value;
  }

  onChangeFilter(value: any, name: string) {
    let filter = this.filters.find(e => e.name === name);
    if (filter) {
      if (value) {
        filter.operator = 'like';
        filter.value = `%${value}%`;
      } else {
        const index = this.filters.findIndex(e => e.name === name);
        this.filters.splice(index, 1);
      }
    } else if (value) {
      filter = {
        name: name,
        operator: 'like',
        value: `%${value}%`
      };
      this.filters.push(filter);
    }
  }

  onAddDiscountNG(item: any) {
    this.handleAddDiscountNG.emit({ item });
  }

  // #region enable checkbox
  isEnableCheckbox(columnName: string, record: any) {
    switch (columnName) {
      case 'km_yn':
        return record.km_yn === true
      case 'giam_gia_yn':
        return record.giam_gia_yn === true
      case 'naptien_hh_yn':
        return true;
      default:
        return false;
    }
  }
  // #endregion enable checkbox


  //#region resize table
  private resizeInProgress = false;
  private resizeSubscription: Subscription | undefined;
  startResize(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.resizeInProgress = true;
    let currentX = event.clientX;
    const thElement =
      this.elementRef.nativeElement.querySelectorAll('th')[index].children[0];
    const tdElement = this.elementRef.nativeElement.querySelectorAll(`tr td:nth-child(${index + 1})`);

    this.resizeSubscription = fromEvent(document, 'mousemove').pipe(
      map((e: any) => e.clientX),
      takeUntil(fromEvent(document, 'mouseup'))
    ).subscribe((posX) => {
      if (this.resizeInProgress) {
        let newWidth = 0
        const deltaX = posX - currentX;
        const currentWidth = thElement.offsetWidth;
        newWidth = currentWidth + deltaX;
        currentX = posX
        this.renderer.setStyle(thElement, 'width', `${newWidth}px`);

        tdElement.forEach((el: any) => {
          this.renderer.setStyle(el.children[0], 'width', `${newWidth}px`);
        })
      }
    })

  }
  //#endregion

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

}
