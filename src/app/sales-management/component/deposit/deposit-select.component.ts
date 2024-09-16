import { AfterViewInit, Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cell } from '../form-control-custom/table-custom/table-custom.component';

const { DEPOSIT_SELECT } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'deposit-select',
  templateUrl: './deposit-select.component.html',
  styleUrls: ['./deposit-select.component.scss'],
})
export class DepositSelectComponent implements OnInit, OnChanges, AfterViewInit {
  itemsSelected: any[] = [];
  dataSource!: any[];
  columns!: Cell[];
  title!: string;

  constructor(
    public dialogRef: MatDialogRef<DepositSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dataSource: any[], currentItem: any[] },
  ) {
  }

  ngOnInit(): void {
    this.columns = DEPOSIT_SELECT as any;
    this.dataSource = this.data.dataSource;
    this.title = "Danh sách đặt cọc còn hiệu lực có thể áp dụng";
    this.dataSource.map(e => e.cl_nt_max = e.cl_nt);
    this.loadDepositSelected();
  }

  loadDepositSelected() {
    this.itemsSelected = this.data.currentItem;
    const ids = this.itemsSelected.map(e => e.stt_rec);
    this.dataSource.map((e: any) => {
      if (ids.includes(e.stt_rec)) {
        e.selected = true
      }
    });
  }

  ngOnChanges(): void {

  }

  ngAfterViewInit() {

  }

  onSelect(): void {
    const items = this.dataSource.filter((e: any) => e.selected);
    this.dialogRef.close(items);
  }

  onCancel() {
    this.dialogRef.close([]);
  }

}

