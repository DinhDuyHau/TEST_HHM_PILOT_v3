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
  tien_coc: number = 0;
  thanh_toan: number = 0;
  tien_con_no: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DepositSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dataSource: any[], currentItem: any[], tien_coc: number, t_tong_tien: number },
  ) {
  }

  ngOnInit(): void {
    this.dataSource = this.data.dataSource.map(e => {
      const item = this.data.currentItem.find(i => i.stt_rec_pt === e.stt_rec);
      return {
        ...e,
        tien_pb: item ? item.tien : 0
      };
    });
    this.columns = DEPOSIT_SELECT as any;
    this.title = "Danh sách đặt cọc còn hiệu lực có thể áp dụng";
    this.dataSource.map(e => e.cl_nt_max = e.cl_nt);
    this.loadDepositSelected();
    this.tien_coc = this.data.tien_coc;
    this.thanh_toan = this.dataSource.reduce((sum, x) => sum + (x.tien_pb ?? 0), 0);
  }

  loadDepositSelected() {
    this.itemsSelected = this.data.currentItem;
    const ids = this.itemsSelected.map(e => e.stt_rec_pt);
    this.dataSource.map((e: any) => {
      if (ids.includes(e.stt_rec)) {
        e.selected = true
      }
    });
  }

  updateTienPB(stt_rec: string, value: number) {
    this.dataSource = this.dataSource.map(e =>
      e.stt_rec === stt_rec
        ? { ...e, tien_pb: value }
        : e
    );

    this.thanh_toan = this.dataSource.reduce((s, x) => s + (x.tien_pb ?? 0), 0);
    this.tien_con_no = this.tien_coc - this.thanh_toan;
  }

  handleChangeSelectCheckbox(item: any) {
    if (item.selected == true) {
      if (item.cl_nt > (this.tien_coc - this.thanh_toan))
        this.updateTienPB(item.stt_rec, this.tien_coc - this.thanh_toan);
      else
        this.updateTienPB(item.stt_rec, item.cl_nt);
    }
    else
      this.updateTienPB(item.stt_rec, 0);
  }

  ngOnChanges(): void {

  }

  ngAfterViewInit() {

  }

  onSelect(): void {
    let t_tien_coc = 0;
    const items = this.dataSource.filter((e: any) => e.selected && e.tien_pb != 0);
    items.forEach(item => {
      t_tien_coc += item.tien_pb;
    });
    this.dialogRef.close([items, t_tien_coc]);
  }

  onCancel() {
    this.dialogRef.close([]);
  }

}

