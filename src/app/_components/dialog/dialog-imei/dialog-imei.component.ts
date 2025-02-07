import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMEIService } from '@app/_services/imei.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { checkValidImei } from '@app/_common/commonFunction';
import { MerchandiseService } from '@app/sales-management/page/common/merchandise.service';
import { SaleWholeService } from '@app/sales-management/page/sale-whole/sale-whole.service';
import { ImeiApiService } from '@app/sales-management/api/imei-api.service';

@Component({
  selector: 'app-dialog-imei',
  templateUrl: './dialog-imei.component.html',
  styleUrls: ['./dialog-imei.component.scss']
})
export class DialogIMEIComponent {
  ma_imei = '';
  imeiOld: string[] = [];
  // Type = 1, Phiếu nhập kho, Type = 2 Phiếu xuất, Type = 3 Phiếu Nhập
  type = 1;
  current_grid_imeis: string[] = [];
  imei_data: string[] = [];
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogIMEIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private imeiService: IMEIService,
    private commonService: CommonService,
    private imeiApiService: ImeiApiService
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
    } else {
      this.imeiOld = data.ma_imei;
    }

    //danh sách imei đang có trong grid (loại trừ dòng hiện tại)
    if (data.gridImeis && data.gridImeis !== '') {
      this.current_grid_imeis = data.gridImeis.split(',');
      for (let i = 0; i < this.current_grid_imeis.length; i++)
        this.current_grid_imeis[i] = this.current_grid_imeis[i].trim();
    }

  }

  handleImeiInputKeyup(event: any, value: string) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      this.splitImeiText(value);
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

    new_imeis = new_imeis.map(imei => imei.trim()).filter(imei => imei);

    let imeiErrorList: string[] = [];

    // Kiểm tra trùng lặp và thêm vào danh sách
    for (let imei of new_imeis) {
      if (arr_imei.includes(imei)) {
        // thêm vào mảng imei lỗi
        imeiErrorList.push(imei);
      } else {
        arr_imei.push(imei); // Chỉ thêm nếu không trùng lặp
        for (let i = 0; i < arr_imei.length; i++) {
          arr_imei[i] = arr_imei[i].trim();
        }
      }
    }

    if (imeiErrorList.length > 0) {
      const errorMessage = `Các imei sau đã tồn tại: ${imeiErrorList.join(', ')}`;
      this.commonService.showMessage(errorMessage);
    }

    this.ma_imei = '';
    this.imei_data = [];
    this.imei_data = arr_imei.filter(x => x && x !== '');
  }

  onDeleteItem(index: number) {
    if (this.imei_data && this.imei_data.length > index)
      this.imei_data.splice(index, 1);
  }

  onClearAll() {
    this.ma_imei = '';
    this.imei_data = [];
  }

  onClickSave() {
    this.isLoading = true;

    if (this.imei_data) {
      // const list_imei = this.ma_imei.split('\n').filter((item) => item !== '');
      const list_imei = [...this.imei_data];

      for (let i = 0; i < list_imei.length; i++)
        list_imei[i] = list_imei[i].trim();

      /*
      * kiểm tra mã vt và mã kho của imei
      */
      let imeiErrorList: string[] = [];
      const imeiChecks = this.imei_data.map((imei) => {
        return this.imeiApiService.getImeiInStore(imei, this.data.ma_cuahang || '', this.data.ma_ct || '').toPromise().then((result: any) => {
          if (result.success && result.result.length) {
            const imeiInfo = result.result[0];
            if (this.data.ma_vt.trim() != imeiInfo.ma_vt.trim() || this.data.ma_kho.trim() != imeiInfo.ma_kho.trim()) {
              imeiErrorList.push(imei);
            }
          }
        });
      });

      // Sử dụng Promise.all để chờ tất cả các kiểm tra IMEI hoàn thành
      Promise.all(imeiChecks).then(() => {
        if (imeiErrorList.length > 0) {
          const errorMessage = `Mã vật tư và mã kho không khớp các imei sau: ${imeiErrorList.join(', ')}`;
          this.commonService.showMessage(errorMessage);
        } else {
          //check ký tự hợp lệ cho từng imei
          const msg_imei_invalid = this.commonService.getMessage('lblWarningImeiInvalidWithParams');
          for (let imei_item of list_imei) {
            if (!checkValidImei(imei_item)) {
              this.commonService.showMessage(msg_imei_invalid.replace('%value', imei_item));
              return;
            }
          }

          //kiểm tra danh sách imei input tồn tại trong danh sách imei ở grid
          let imeis_exists_in_grid = '';
          for (let imei_item of list_imei) {
            if (this.current_grid_imeis.includes(imei_item)) {
              imeis_exists_in_grid += (imeis_exists_in_grid !== '' ? ',' : '') + imei_item;
            }
          }
          if (imeis_exists_in_grid !== '') {
            const msg_name = this.commonService.getMessage('lblWarningExistImeiDetail');
            this.commonService.showMessage(msg_name.replace('%imei', imeis_exists_in_grid));
            return;
          }

          //kiểm tra duplicate trong chính danh sách imei đang input
          const map = new Map();
          list_imei.forEach((item) => {
            if (map.has(item)) {
              map.set(item, map.get(item) + 1);
            }
            else {
              map.set(item, 1);
            }
          });
          let err = '';
          map.forEach((value, key) => {
            if (value != 1) {
              err += this.commonService.getMessageAdvance('lblDuplicateIMEI', { name: '%imei', value: key }, { name: '%count', value: value });
            }
          });

          //check đối chiếu giữa số lượng chuỗi imei input và trường số lượng tương ứng trong grid
          if (err === '') {
            if (list_imei.length > this.data.so_luong) {
              err = `Mã vật tư ${this.data.ma_vt} chỉ có số lượng là ${this.data.so_luong}. Bạn đã nhập ${list_imei.length} imei`;
            }
          }

          if (err !== '') {
            this.snackBar.open(err, 'Đóng', {
              duration: 2000,
            });
          } else {
            let flag = false;
            if (this.type == 3 || this.type == 5) {
              list_imei.forEach(imei => {
                if (!this.data.ma_imei_xuat) {
                  this.snackBar.open(`Mã vật tư ${this.data.ma_vt} chưa có imei nào ở bên xuất. Vui lòng kiểm tra lại`, 'Đóng', {
                    duration: 2000,
                  });
                  flag = true;
                  return;
                }
                else {
                  let list_imei_xuat: string[] = this.data.ma_imei_xuat.split(',');
                  list_imei_xuat = list_imei_xuat.map((item: any) => {
                    return item.trim();
                  });
                  if (!list_imei_xuat.find(item => item === imei)) {
                    this.snackBar.open(`IMEI ${imei} không có trong imei xuất của mã vật tư ${this.data.ma_vt}. Vui lòng kiểm tra lại`, 'Đóng', {
                      duration: 2000,
                    });
                    flag = true;
                    return;
                  }
                }
              });
            }
            if (!flag) {
              const imeiOld = this.imeiOld || [];
              const imei_new = list_imei.filter(x => !imeiOld.find(imei => imei.trim() == x.trim()));
              if (imei_new.length == 0) {
                this.dialogRef.close(list_imei);
                return;
              }
              this.imeiService.getListImeiInfo(imei_new).subscribe((res) => {
                if (res.success) {
                  let message = '';
                  const imeiInvalid = res.result.find(x => x.ma_vt.trim() !== this.data.ma_vt.trim());
                  if (imeiInvalid && this.type != 1) {
                    this.snackBar.open(`IMEI ${imeiInvalid.ma_imei} không thuộc mã vật tư ${this.data.ma_vt}`, 'Đóng', {
                      duration: 2000,
                    });
                    return;
                  }
                  res.result.forEach((item: any) => {
                    const map = new Map();
                    let mess = '';
                    switch (this.type) {
                      // Nhập kho
                      case 1:
                        map.set('exists_yn', false);
                        map.set('in_store_yn', false);
                        map.set('xuat_yn', false);
                        map.set('dieu_chuyen_yn', false);
                        map.set('dat_hang_yn', false);
                        mess = this.imeiService.GetMessageStatusImei(map, item);
                        if (mess !== '')
                          message += mess + '. ';
                        break;
                      // Xuất điều chuyển
                      case 2:
                        map.set('exists_yn', true);
                        map.set('in_store_yn', true);
                        map.set('xuat_yn', false);
                        map.set('dieu_chuyen_yn', false);
                        map.set('dat_hang_yn', false);
                        mess = this.imeiService.GetMessageStatusImei(map, item);
                        if (mess !== '')
                          message += mess + '. ';
                        break;
                      // Nhập điều chuyển
                      case 3:
                        map.set('exists_yn', true);
                        map.set('in_store_yn', false);
                        map.set('dieu_chuyen_yn', true);
                        map.set('xuat_yn', false);
                        map.set('dat_hang_yn', false);
                        mess = this.imeiService.GetMessageStatusImei(map, item);
                        if (mess !== '')
                          message += mess + '. ';
                        break;
                      // Xuất bán nội bộ
                      case 4:
                        map.set('exists_yn', true);
                        map.set('in_store_yn', true);
                        map.set('xuat_yn', false);
                        map.set('dieu_chuyen_yn', false);
                        map.set('dat_hang_yn', false);
                        mess = this.imeiService.GetMessageStatusImei(map, item);
                        if (mess !== '')
                          message += mess + '. ';
                        break;
                      // Nhập mua nội bộ
                      case 5:
                        map.set('exists_yn', true);
                        map.set('in_store_yn', false);
                        map.set('dieu_chuyen_yn', true);
                        map.set('xuat_yn', true);
                        map.set('dat_hang_yn', false);
                        mess = this.imeiService.GetMessageStatusImei(map, item);
                        if (mess !== '')
                          message += mess + '. ';
                        break;
                      // Phiếu bán buôn
                      case 6:
                        map.set('exists_yn', true);
                        map.set('in_store_yn', true);
                        map.set('dieu_chuyen_yn', false);
                        map.set('xuat_yn', false);
                        map.set('dat_hang_yn', false);
                        mess = this.imeiService.GetMessageStatusImei(map, item);
                        if (mess !== '')
                          message += mess + '. ';
                        break;
                    }
                  });
                  if (message !== '') {
                    this.snackBar.open(message, 'Đóng', {
                      duration: 2000,
                    });
                  }
                  else {
                    this.dialogRef.close(list_imei);
                  }
                }
              });
            }
          }
        }
      });
      /* END */
    }
    else {
      this.dialogRef.close([]);
    }
    // this.dialogRef.close(true);
  }
  onClickClose() {
    this.dialogRef.close(false);
  }

  compareMerchandiseCode(val1: string, val2: string) {
    return val1.replace(/\s+/g, '') === val2.replace(/\s+/g, '');
  }
}

