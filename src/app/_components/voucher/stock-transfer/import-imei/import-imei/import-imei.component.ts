import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogIMEIComponent } from '@app/_components/dialog/dialog-imei/dialog-imei.component';
import { IMEIService } from '@app/_services/imei.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

const {
  IMPORT_IMEI_LIST
} = require('@assets/fields/grid/voucher-stock-transfer-from-shop.json');

@Component({
  selector: 'app-import-imei',
  templateUrl: './import-imei.component.html',
  styleUrls: ['./import-imei.component.scss']
})
export class ImportImeiComponent {
  ma_imei = '';
  imeiOld: string[] = [];
  type = 1;
  current_grid_imeis: string[] = [];
  imei_data: string[] = [];
  columns = IMPORT_IMEI_LIST;
  dataSource: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogIMEIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private imeiService: IMEIService,
    private commonService: CommonService
  ) {
    if (data.ma_imei) {
      this.ma_imei = data.ma_imei.join('\n');
      this.splitImeiText(this.ma_imei);
    }
    if (data.type) {
      this.type = data.type;
    }
    if (data.imeiOld) {
      this.imeiOld = data.imeiOld;
    }

    if (data.gridImeis && data.gridImeis !== '') {
      this.current_grid_imeis = data.gridImeis.split(',');
      for (let i = 0; i < this.current_grid_imeis.length; i++)
        this.current_grid_imeis[i] = this.current_grid_imeis[i].trim();
    }

  }

  handleImeiInputKeyup(event: any, value: string) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      this.splitImeiText(value);
      this.dataSource = this.imei_data.map((e: any, index: number) => ({ line_br: index + 1, ma_imei: e }))
    }
  }

  splitImeiText(text: string) {
    let arr_imei: string[] = [...this.imei_data];
    let new_imeis: string[] = [];

    //split imei với seperator là dấy phảy (,)
    if (text.includes(',') || text.indexOf(',') >= 0) {
      new_imeis = text.split(',');
    }

    //split imei với separator là ký tự Enter (\n)
    if (!new_imeis || new_imeis.length === 0) {
      new_imeis = text.split('\n');
    }

    //add vào danh sách
    if (new_imeis && new_imeis.length > 0) {
      arr_imei.push(...new_imeis);
      for (let i = 0; i < arr_imei.length; i++) {
        arr_imei[i] = arr_imei[i].trim();
      }
    }

    this.ma_imei = '';
    this.imei_data = [];
    this.imei_data = arr_imei.filter(x => x && x !== '');
  }

  onDeleteItem(event: any) {
    this.dataSource = this.dataSource.filter((e: any) => e.line_br === event.line_br);
  }

  onClearAll() {
    this.ma_imei = '';
    this.imei_data = [];
    this.dataSource = [];
  }

  onClickSave() {
  }

  onClickClose() {
    this.dialogRef.close(false);
  }
}


