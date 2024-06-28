import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemFilter } from '@app/_components/gridV2/grid.model';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { EWallet, EWalletDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { POSService } from '@app/sales-management/api/pos-api.service';
import { Language } from '@app/sales-management/page/common/language';

@Component({
  selector: 'app-e-wallet',
  templateUrl: './e-wallet.component.html',
  styleUrls: ['./e-wallet.component.scss']
})
export class EWalletComponent implements OnInit {
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
  vi_dien_tu = new EWalletDetail;
  invalid = false;
  constructor(public dialogRef: MatDialogRef<EWalletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eWallet: EWallet, disabled: boolean },
    private commonService: CommonService,
    private posService: POSService) {
    this.readonly = data.disabled;
  }
  ngOnInit(): void {
    const col = [
      { name: 'thong_tin', title: 'Ví điện tử' },
      { name: 'so_hd_vnpay', title: 'Số hoá đơn' },
      {
        name: 'tien', title: 'Số tiền', type: 'texbox',
        dataType: 'number',
        format: 'moneyViewFormat',
        align: 'right'
      },
    ] as any;
    this.columns = col;
    this.dataSource = this.data.eWallet.detail;
  }
  onOpenSearchWallet() {
    this.commonService.openDialog(SearchDialogComponent, { keyword: '', componentName: SEARCH_COMPONENT_NAME.WALLET, title: 'Danh sách ví điện tử' }, 'search-style-dialog')
      .afterClosed().subscribe(result => {
        this.vi_dien_tu.thong_tin = result.ma_kh;
      });
  }
  addDetail() {
    if (this.vi_dien_tu.thong_tin == '') {
      this.invalid = true;
      return;
    }
    this.data.eWallet.detail.push(this.vi_dien_tu);
    this.data.eWallet.tien += this.vi_dien_tu.tien;
    this.dataSource = this.data.eWallet.detail;
    this.vi_dien_tu = new EWalletDetail;
    this.invalid = false;
  }
  onDeleteItem(event: { item: any }) {
    this.data.eWallet.detail = this.data.eWallet.detail.filter((x => x.thong_tin != event.item.thong_tin));
    this.data.eWallet.tien -= event.item.tien;
    this.dataSource = this.data.eWallet.detail;
  }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }

}
