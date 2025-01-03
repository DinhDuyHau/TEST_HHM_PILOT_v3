import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemFilter } from '@app/_components/gridV2/grid.model';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { Transfer, TransferDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { POSService } from '@app/sales-management/api/pos-api.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
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
  chuyen_khoan = new TransferDetail;
  invalid = false;
  t_con_no: number = 0;

  constructor(public dialogRef: MatDialogRef<TransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transfer: Transfer, disabled: boolean, tien_con_no: number },
    private commonService: CommonService) {
    this.readonly = data.disabled;

  }
  ngOnInit(): void {
    const col = [
      {
        name: 'ten_ngan_hang',
        title: 'Tên ngân hàng'
      },
      {
        name: 'tien', title: 'Số tiền', type: 'texbox',
        dataType: 'number',
        format: 'moneyViewFormat',
        align: 'right'
      },
    ] as any;
    this.columns = col;

    // Gán index cho mỗi phần tử trong 'detail' khi khởi tạo
    this.data.transfer.detail = this.data.transfer.detail.map((item, idx) => {
      item.index = idx; // Gán chỉ mục mới dựa trên vị trí trong mảng
      return item;
    });

    this.dataSource = this.data.transfer.detail;

    //set tiền còn nợ khi mở form
    this.t_con_no = this.data.tien_con_no;

  }
  addDetail() {
    if (this.t_con_no < 0) {
      this.commonService.showMessage("Tổng tiền nợ là số âm, không thể thực hiện thanh toán");
      return;
    }

    if (this.chuyen_khoan.ten_ngan_hang == '') {
      this.invalid = true;
      return;
    }
    if (this.chuyen_khoan.ten_ngan_hang.trim() !== '' && this.chuyen_khoan.tien) {
      // Gắn thêm index vào chuyen_khoan
      this.chuyen_khoan.index = this.data.transfer.detail.length;

      this.data.transfer.detail = [...this.data.transfer.detail, this.chuyen_khoan];
      this.data.transfer.tien += this.chuyen_khoan.tien;
      this.dataSource = this.data.transfer.detail;
      this.chuyen_khoan = new TransferDetail;
      this.invalid = false;
    } else {
      this.commonService.showMessage("Ngân hàng chuyển khoản và số tiền không được để trống")
    }
  }
  // onDeleteItem(event: { item: any }) {
  //   this.data.transfer.detail = this.data.transfer.detail.filter((x => x.tk_nh_nhan != event.item.tk_nh_nhan && x.ten_ngan_hang != event.item.ten_ngan_hang));
  //   this.data.transfer.tien -= event.item.tien;
  //   this.dataSource = this.data.transfer.detail;
  // }
  onDeleteItem(event: any) {
    const index = this.data.transfer.detail.findIndex(x => x.index === event.item.index);
    this.data.transfer.tien -= this.data.transfer.detail[index].tien;
    this.data.transfer.detail.splice(index, 1);
    this.dataSource = [...this.data.transfer.detail];
  }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }
  onOpenSearchBankAccount() {
    const dialogRef = this.commonService.openDialog(SearchDialogComponent, { keyword: "CHUYENKHOAN", componentName: SEARCH_COMPONENT_NAME.BANK_ACCOUNT, title: 'Danh sách ngân hàng' }, 'search-style-dialog');
    dialogRef.afterClosed().subscribe(result => {
      this.chuyen_khoan.tk_nh_nhan = result.tknh;
      this.chuyen_khoan.ten_ngan_hang = result.ten_nh;
    });
  }
}
