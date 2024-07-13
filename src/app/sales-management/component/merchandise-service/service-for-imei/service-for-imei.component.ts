import { AfterViewInit, Component, Inject, OnChanges, OnInit, ViewEncapsulation, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MerchandiseServiceApiService } from '@app/sales-management/api/merchandiseService-api.service';
import { Cell } from '../../form-control-custom/table-custom/table-custom.component';
import { Service } from '@app/sales-management/model/ticket/common-model/service.model';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { ServiceOfMerchandiseService } from '@app/sales-management/page/common/service.service';

const { SERVICE_SELECT_LIST } = require('@assets/fields/grid/sales-fields-table.json');

@Component({
  selector: 'service-for-imei',
  templateUrl: './service-for-imei.component.html',
  styleUrls: ['./service-for-imei.component.scss'],
})
export class ServiceForImeiComponent implements OnInit, OnChanges, AfterViewInit {
  ma_imei = '';
  gia_ban = 0;
  ma_vt = '';
  columns!: Cell[];
  dataSource: Service[] = [];
  title!: string;
  value!: string;
  ma_cuahang!: string;
  gia_vat = 0;

  preious_quantity: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<ServiceForImeiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ma_imei: string, gia_ban: number, ma_vt: string, gia_vat: number },
    private merchandiseServiceApiService: MerchandiseServiceApiService,
    private commonService: CommonService,
    private serviceOfMerchandiseService: ServiceOfMerchandiseService,

  ) {
    this.ma_imei = this.data.ma_imei;
    this.gia_ban = this.data.gia_ban;
    this.ma_vt = this.data.ma_vt;
    this.gia_vat = this.data.gia_vat;
  }

  ngOnInit(): void {
    this.columns = SERVICE_SELECT_LIST as any as Cell[];
    this.title = 'Thêm dịch vụ';
    const userJson = localStorage.getItem('user');
    const userObj = userJson !== null && JSON.parse(userJson);
    this.ma_cuahang = userObj['shop'];
  }

  ngOnChanges(): void {
  }

  ngAfterViewInit(): void {
  }

  onSearch(value: string): void {
    this.commonService.openDialog(SearchDialogComponent, { keyword: value, componentName: SEARCH_COMPONENT_NAME.SERVICE })
      .afterClosed().subscribe(result => {
        if (result) {
          this.handleAddService(result);
        }
      });
  }

  openDialogSearch() {
    this.commonService.openDialog(SearchDialogComponent, { keyword: '', componentName: SEARCH_COMPONENT_NAME.SERVICE })
      .afterClosed().subscribe(result => {
        if (result) {
          this.handleAddService(result);
        }
      });
  }

  handleAddService(service: Service) {
    const isExist = this.dataSource.find(e => e.ma_dv === service.ma_dv);
    if (isExist) {
      this.commonService.showMessage('Dịch vụ đã được thêm');
    }
    else {
      if (service.ad_key) {
        this.merchandiseServiceApiService.getKeyOfService(service.ma_dv).subscribe((result_key) => {
          if (result_key.success && result_key.result) {
            this.merchandiseServiceApiService.getServicePrice(this.ma_vt, service.ma_dv, this.ma_cuahang, this.gia_vat).subscribe((result) => {
              if (result.success) {
                const serviceNew = new Service(service);
                serviceNew.ma_thue = (result.result as any).ma_thue;
                serviceNew.gia_ban = (result.result as any).gia_ban;
                serviceNew.gia_vat = (result.result as any).gia_vat;

                serviceNew.thue_suat = (result.result as any).thue_suat;
                serviceNew.thanh_tien = serviceNew.gia_ban * serviceNew.so_luong;

                // serviceNew.tien_thue = serviceNew.gia_ban * serviceNew.so_luong * serviceNew.thue_suat / 100;
                // serviceNew.tong_tien = serviceNew.gia_ban + serviceNew.tien_thue;

                //2024-05-15: begin
                serviceNew.tong_tien = serviceNew.gia_vat * serviceNew.so_luong;
                serviceNew.tien_thue = serviceNew.tong_tien - serviceNew.thanh_tien;
                //2024-05-15: end

                this.serviceOfMerchandiseService.addNew(this.data.ma_imei, [serviceNew], this.dataSource);
                this.preious_quantity.push(1);
              }
              else {
                this.commonService.showMessage('Không tìm thấy thông tin của dịch vụ');
              }
            });
          }
          else {
            this.commonService.showMessageByName('not_found_key');
          }
        });

      }
      else {
        this.merchandiseServiceApiService.getServicePrice(this.ma_vt, service.ma_dv, this.ma_cuahang, this.gia_vat).subscribe((result) => {
          if (result.success) {
            const serviceNew = new Service(service);
            serviceNew.ma_thue = (result.result as any).ma_thue;
            serviceNew.gia_ban = (result.result as any).gia_ban;
            serviceNew.gia_vat = (result.result as any).gia_vat;

            serviceNew.thue_suat = (result.result as any).thue_suat;
            serviceNew.thanh_tien = serviceNew.gia_ban * serviceNew.so_luong;

            // serviceNew.tien_thue = serviceNew.gia_ban * serviceNew.so_luong * serviceNew.thue_suat / 100;
            // serviceNew.tong_tien = serviceNew.gia_ban + serviceNew.tien_thue;

            //2024-05-15: begin
            serviceNew.tong_tien = serviceNew.gia_vat * serviceNew.so_luong;
            serviceNew.tien_thue = serviceNew.tong_tien - serviceNew.thanh_tien;
            //2024-05-15: end

            this.serviceOfMerchandiseService.addNew(this.data.ma_imei, [serviceNew], this.dataSource);
            this.preious_quantity.push(1);
          }
          else {
            this.commonService.showMessage('Không tìm thấy thông tin của dịch vụ');
          }
        });
      }
    }
  }

  onChangeQuantity(event: { item: any, index: number, value: any, columnName: string }) {
    if (event.item.ad_key) {
      this.merchandiseServiceApiService.getKeyOfService(event.item.ma_dv, +event.value).subscribe((result_key) => {
        if (result_key.success && result_key.result) {
          this.preious_quantity[event.index] = +event.value;
          this.dataSource[event.index].so_luong = +event.value;
          this.dataSource[event.index].thanh_tien = this.dataSource[event.index].gia_ban * event.value;

          // this.dataSource[event.index].tien_thue = this.dataSource[event.index].gia_ban * this.dataSource[event.index].so_luong * this.dataSource[event.index].thue_suat;
          // this.dataSource[event.index].tong_tien = this.dataSource[event.index].thanh_tien + this.dataSource[event.index].tien_thue;

          this.dataSource[event.index].tong_tien = this.dataSource[event.index].gia_vat * this.dataSource[event.index].so_luong;
          this.dataSource[event.index].tien_thue = this.dataSource[event.index].tong_tien - this.dataSource[event.index].thanh_tien;
        }
        else {
          this.dataSource[event.index].so_luong = this.preious_quantity[event.index];
          this.commonService.showMessageByName('not_found_key');
        }
      });
    }
    else {
      this.preious_quantity[event.index] = +event.value;
      this.dataSource[event.index].so_luong = +event.value;
      this.dataSource[event.index].thanh_tien = this.dataSource[event.index].gia_ban * event.value;

      // this.dataSource[event.index].tien_thue = this.dataSource[event.index].gia_ban * this.dataSource[event.index].so_luong * this.dataSource[event.index].thue_suat;
      // this.dataSource[event.index].tong_tien = this.dataSource[event.index].thanh_tien + this.dataSource[event.index].tien_thue;

      this.dataSource[event.index].tong_tien = this.dataSource[event.index].gia_vat * this.dataSource[event.index].so_luong;
      this.dataSource[event.index].tien_thue = this.dataSource[event.index].tong_tien - this.dataSource[event.index].thanh_tien;
    }

  }

  onRemoveItem(event: { item: Service }) {
    this.dataSource = this.dataSource.filter((e, i) => {
      if (e.ma_dv !== event.item.ma_dv) {
        this.preious_quantity.splice(i, 1);
        return true;
      }
      return false;
    });

  }

  onCancel() {
    this.dialogRef.close();
  }

  onSelect() {
    this.dialogRef.close(this.dataSource);
  }

}

