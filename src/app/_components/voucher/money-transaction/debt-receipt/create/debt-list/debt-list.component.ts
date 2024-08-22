import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cell } from '@app/sales-management/component/form-control-custom/table-custom/table-custom.component';
import { Platform } from '@angular/cdk/platform';
import { getDate, getFirstDayOfMonth, getLastDayOfMonth } from '@app/_common/commonFunction';

const { DEBT_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'app-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.scss'],
})
export class DebtListComponent implements OnInit {
  @ViewChild('form') form!: ElementRef;

  dataSource!: any[];
  filteredData!: any[];
  currentItem!: any[];
  columns!: Cell[];
  title!: string;
  isMobile = false;
  disabled = false;

  dshd = '';
  tu_so = '';
  den_so = '';
  tu_ngay = getFirstDayOfMonth(new Date());
  den_ngay = getLastDayOfMonth(new Date());

  page_index = 1;
  page_size = 10;
  recordCount = 0;
  isAdvanceSearch = false;
  params: any;

  constructor(
    public dialogRef: MatDialogRef<DebtListComponent>,
    private platform: Platform,
    @Inject(MAT_DIALOG_DATA) public data: { dataSource: any[], currentItem: any[] },
  ) {
  }
  ngOnInit(): void {
    this.isMobile = this.platform.IOS || this.platform.ANDROID;
    this.columns = DEBT_LIST as any;
    this.filteredData = this.data.dataSource;
    this.dataSource = this.filteredData.slice(0, 10);
    this.currentItem = this.data.currentItem;
    this.title = 'Danh sách công nợ';
    this.loadDebtSelected(this.currentItem, this.data.dataSource);
    this.loadDebtSelected(this.currentItem, this.filteredData);
    this.recordCount = this.filteredData.length;
    // console.log(this.data.currentItem);
  }
  loadData() {
    let index = 1;
    this.filteredData = this.data.dataSource
      .filter(item => this.filterData(item));
    this.filteredData.forEach((item: any) => {
      item.line_nbr = index++;
    })

    this.dataSource = this.filteredData.slice(this.page_index * this.page_size - this.page_size, this.page_index * this.page_size);
    this.recordCount = this.filteredData.length;
  }
  loadDebtSelected(itemsSelected: any[], items: any[]) {
    const debtCodeSelected = new Set<string>(
      itemsSelected
        .filter(e => e.selected)
        .map(e => e.so_hd_tt?.trim())
        .filter(Boolean)
    );
    items.forEach((e: any) => {
      if (e.selected === true) { }
      e.selected = debtCodeSelected.has(e.so_hd_tt?.trim());
    });
  }
  onCancel() {
    this.dialogRef.close(this.currentItem);
  }
  onSelect(): void {
    const item = this.filteredData.filter((e: any) => e.selected);
    this.dialogRef.close(item);
  }
  onChangePage(event: number) {
    if (event !== this.page_index) {
      this.page_index = event
    }
    this.loadData()
  }
  onChangePageSize(event: string) {
    this.page_size = +event;
    this.page_index = 1;
    this.loadData()
  }
  onEnter(event: any) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter (submit form)
    const inputs = this.form.nativeElement.querySelectorAll('input:not([readonly]):not([disabled]):not([type="date"])');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === event.target) {
        if (i < inputs.length - 1) {
          inputs[i + 1].focus(); // Focus vào phần tử tiếp theo
          break;
        }
      }
    }
  }
  onEnterDate(event: any) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13)
      this.onEnter(event);
  }
  onBlurDateStart(event: any, ref: any, name: string) {
    if (name === 'tu_ngay') {
      this.tu_ngay = ref.isoDateString.toString();
    } else if (name === 'den_ngay') {
      this.den_ngay = ref.isoDateString.toString();
    }
  }
  onNumberChange(field: string, value: string) {
    if (field === 'tu_so') {
      this.tu_so = value;
    } else if (field === 'den_so') {
      this.den_so = value;
    }
  }
  onNumberListChange(value: string) {
    this.dshd = value.replace(/\s*,\s*/g, ',');
  }
  resetHours(date: Date): Date {
    const resetDate = new Date(date);
    resetDate.setHours(0, 0, 0, 0);
    return resetDate;
  }
  checkDateRange(item: any) {
    if (this.tu_ngay && this.den_ngay) {
      const itemDate = this.resetHours(new Date(item.ngay_hd_tt));
      const fromDate = this.resetHours(new Date(this.tu_ngay));
      const toDate = this.resetHours(new Date(this.den_ngay));
      return itemDate >= fromDate && itemDate <= toDate;
    }
    return true;
  }
  checkNumberRange(item: any) {
    if (this.tu_so && this.den_so) {
      const itemNumber = item.so_hd_tt;
      const fromNumber = this.tu_so;
      const toNumber = this.den_so;
      return itemNumber >= fromNumber && itemNumber <= toNumber;
    }
    return true;
  }
  checkInvoiceNumber(item: any) {
    if (this.dshd) {
      const invoiceNumbers = this.dshd.split(',').map(num => num.trim()).filter(num => num.length > 0);
      return invoiceNumbers.includes(item.so_hd_tt.trim());
    }
    return true;
  }
  filterData(item: any): boolean {
    const dateValid = this.checkDateRange(item);
    const numberValid = this.checkNumberRange(item);
    const invoiceNumberValid = this.checkInvoiceNumber(item);

    return numberValid && dateValid && invoiceNumberValid;
  }
  onSearch() {
    this.page_index = 1;
    this.loadData();
    this.loadDebtSelected(this.data.dataSource, this.filteredData);
  }
}

