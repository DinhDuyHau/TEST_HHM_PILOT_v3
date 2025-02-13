import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemFilter } from '@app/_components/gridV2/grid.model';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { POSModel } from '@app/sales-management/model/dto/pos.dto';
import { Card, CardDetail } from '@app/sales-management/model/ticket/common-model/payment.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { POSService } from '@app/sales-management/api/pos-api.service';
import { Language } from '@app/sales-management/page/common/language';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss']
})
export class SwipeCardComponent implements OnInit {
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
  quet_the = new CardDetail;
  invalid = false;
  constructor(public dialogRef: MatDialogRef<SwipeCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { card: Card, keyword: string, shop: string, componentName: number, title: string, ma_ct?: string, filter?: ItemFilter[], disabled: boolean },
    private commonService: CommonService,
    private posService: POSService) {
    this.readonly = data.disabled;

  }
  ngOnInit(): void {
    const col = [
      {
        name: 'ma_may_pos',
        title: 'Mã máy pos'
      },
      {
        name: 'ma_chuan_chi',
        title: 'Mã chuẩn chi'
      },
      {
        name: 'so_the',
        title: 'Số thẻ'
      },
      {
        name: 'tien', title: 'Số tiền',
        type: 'texbox',
        dataType: 'number',
        format: 'moneyViewFormat',
        align: 'right'
      },

    ] as any;
    this.columns = col;
    this.dataSource = this.data.card.detail;
  }
  addDetail() {
    if (this.quet_the.ma_chuan_chi.trim() !== '' && this.quet_the.ma_may_pos.trim() !== '' && this.quet_the.so_the.trim() !== '' && this.quet_the.tien) {
      this.data.card.detail = [...this.data.card.detail, this.quet_the];
      this.data.card.tien += this.quet_the.tien;
      this.dataSource = this.data.card.detail;
      this.quet_the = new CardDetail;
    } else {
      this.commonService.showMessage("Cần nhập đầy đủ thông tin")
    }
  }
  onDeleteItem(event: { item: any }) {
    this.data.card.detail = this.data.card.detail.filter((x => !(x.ma_chuan_chi == event.item.ma_chuan_chi
      && x.ma_may_pos == event.item.ma_may_pos
      && x.so_the == event.item.so_the
      && x.tien == event.item.tien)
    ));
    this.data.card.tien -= event.item.tien;
    this.dataSource = this.data.card.detail;
    this.invalid = false;
  }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }
  handleAddPOS(pos: POSModel) {
    this.quet_the.ma_may_pos = pos.ma_pos;
    this.quet_the.ten_may_pos = pos.ten_pos;
  }

  openSearchPOSDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { shop: this.data.shop, keyword: '', componentName: SEARCH_COMPONENT_NAME.POS, title: 'Danh sách máy POS' }, 'search-style-dialog')
      .afterClosed()
      .subscribe((pos: POSModel) => pos && this.handleAddPOS(pos));
  }
  onEnterPOSCode(ma_pos: string) {
    this.posService.getOneById(ma_pos).subscribe(result => {
      if (result.success && result.result) {
        const pos: any = result.result;
        this.handleAddPOS(pos);
      } else {
        this.commonService.showMessageByContent(Language.content.exists_pos_yn_no, ma_pos);
        this.quet_the.ma_may_pos = '';
      }
    });
  }
}
