import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogIMEIComponent } from '@app/_components/dialog/dialog-imei/dialog-imei.component';
import { IMEIService } from '@app/_services/imei.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

const {
  IMPORT_IMEI_LIST
} = require('@assets/fields/grid/voucher-stock-transfer-from-shop.json');

export const enum ImportImeiTypeEnum {
  STOCK_TRANSFER = 'stock transfer',
  STOCK_CHECK = 'stock check'
}


@Component({
  selector: 'app-import-imei',
  templateUrl: './import-imei.component.html',
  styleUrls: ['./import-imei.component.scss']
})
export class ImportImeiComponent {
  ma_imei = '';
  columns = IMPORT_IMEI_LIST;
  dataSource: any[] = [];
  ma_vt = '';
  merchandise = {} as any;

  constructor(
    public dialogRef: MatDialogRef<DialogIMEIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private imeiService: IMEIService,
    private commonService: CommonService,
  ) {
    this.merchandise = this.data.item;
    if (this.merchandise) {
      this.ma_vt = this.merchandise.ma_vt;
      this.handleAddImei(this.merchandise.ma_imei);
    }
  }

  isCanAdd(item: any) {
    if (!this.data.type || this.data.type === ImportImeiTypeEnum.STOCK_TRANSFER) {
      if (item.in_store_yn &&
        item.exists_yn &&
        item.in_stock_yn &&
        !item.dieu_chuyen_yn &&
        !item.dat_hang_yn &&
        !item.ban_hang_yn &&
        !item.bao_hanh_yn) {
        return true;
      }
    } else if (this.data.type === ImportImeiTypeEnum.STOCK_CHECK) {
      return true;
    }
    return false;
  }

  handleAddImei(imeis: string) {
    if (!imeis) return;
    const imei_data = this.splitImeiText(imeis);
    this.imeiService.getListImeiInfo(imei_data, this.data.ma_kho).subscribe((result) => {
      if (result.success && result.result.length) {
        result.result.map(item => {
          if (this.isCanAdd(item)) {
            const rs = this.dataSource.find((e: any) => e.ma_imei === item.ma_imei);
            if (!rs) {
              this.dataSource = [...this.dataSource, item];
              this.dataSource.map((e, index: number) => { e.line_nbr = index });
            } else {
              this.commonService.showMessageByNameAdvance('lblWarningExistImeiDetail', { name: '%imei', value: item.ma_imei });
            }
          }
          else {
            this.commonService.showMessage("Trạng thái của imei không hợp lệ");
          }
        });
      }
      else {
        this.commonService.showMessage("Không tìm thấy thông tin imei");
      }
    })
    this.ma_imei = '';
  }

  handleImeiInputKeyup(event: any, value: string) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      this.handleAddImei(value);
    }
  }

  splitImeiText(text: string) {
    let new_imeis: string[] = [];

    //split imei với seperator là dấy phảy (,)
    if (text.includes(',') || text.indexOf(',') >= 0) {
      new_imeis = text.split(',');
    }

    //split imei với separator là ký tự Enter (\n)
    if (!new_imeis || new_imeis.length === 0) {
      new_imeis = text.split('\n');
    }

    return new_imeis.filter(e => e).map(e => e.trim());
  }

  onDeleteItem(event: { item: any }) {
    this.dataSource = this.dataSource.filter((e: any) => e.line_nbr !== event.item.line_nbr);
  }

  onClearAll() {
    this.ma_imei = '';
    this.dataSource = [];
  }

  onClickSave() {
    this.dialogRef.close(this.dataSource);
  }

  onClickClose() {
    this.dialogRef.close(false);
  }
}


