import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemFilter } from '@app/_components/gridV2/grid.model';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { VNPay, VNPayDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { POSService } from '@app/sales-management/api/pos-api.service';
import { Language } from '@app/sales-management/page/common/language';

@Component({
  selector: 'app-vnpay',
  templateUrl: './vnpay.component.html',
  styleUrls: ['./vnpay.component.scss']
})
export class VNPayComponent implements OnInit {
  dataSource: any[] = [];
  columns!: Cell[];
  page_index = 1;
  page_size = 10;
  recordCount = 0;
  filters!: ItemFilter[];
  getData!: any;
  keyword = '';
  title = '';
  isLoading = false;
  readonly = false;
  detail = new VNPayDetail;
  invalid = false;
  constructor(public dialogRef: MatDialogRef<VNPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vnpay: VNPay, disabled: boolean },
    private commonService: CommonService,
    private posService: POSService) {
    this.readonly = data.disabled;
  }
  ngOnInit(): void {
    const col = [
      { name: 'so_hd_vnpay', title: 'Số hoá đơn' },
      {
        name: 'tien', title: 'Số tiền', type: 'texbox',
        dataType: 'number',
        format: 'moneyViewFormat',
        align: 'right'
      },
    ] as any;
    this.columns = col;
    this.dataSource = this.data.vnpay.detail;
  }
  addDetail() {
    if (this.detail.so_hd_vnpay == '') {
      this.invalid = true;
      return;
    }
    this.data.vnpay.detail.push(this.detail);
    this.data.vnpay.tien += this.detail.tien;
    this.dataSource = this.data.vnpay.detail;
    this.detail = new VNPayDetail;
    this.invalid = false;
  }
  onDeleteItem(event: { item: any }) {
    this.data.vnpay.detail = this.data.vnpay.detail.filter((x => x.so_hd_vnpay != event.item.so_hd_vnpay));
    this.data.vnpay.tien -= event.item.tien;
    this.dataSource = this.data.vnpay.detail;
  }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }

}
