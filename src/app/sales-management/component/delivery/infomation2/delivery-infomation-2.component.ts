import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { Transport, DELIVERY_TYPE } from '@app/sales-management/model/common/delivery.mode';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { Customer } from '@app/_components/category/customer/customer.model';
import { DeliveryEmployeeApiService } from '@app/sales-management/api/delivery-employee-api.service';
import { Language } from '@app/sales-management/page/common/language';

@Component({
  selector: 'delivery-infomation-2',
  templateUrl: './delivery-infomation-2.component.html',
  styleUrls: ['./delivery-infomation-2.component.scss'],
})
export class DeliveryInfomationComponent2 implements OnInit, AfterViewInit, OnChanges {
  @Input() data!: Transport;
  @Input() readonly: boolean = false;
  @Input() l_ma_don_vi: string = 'Mã đơn vị';
  @Input() l_ten_don_vi: string = 'Tên đơn vị';
  @Input() dataDefault: string = '';
  @Input() isOtherLabel: boolean = false;

  deliveryType = DELIVERY_TYPE;
  dataFormat = dataFormat;
  constructor(
    private commonService: CommonService,
    private deliveryEmployeeApiService: DeliveryEmployeeApiService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.data.ma_loaivc = this.dataDefault;
  }

  ngAfterViewInit(): void {
  }

  onChange(type: any) {
    this.data.ma_loaivc = type;

    // reset data
    this.data.cod.so_dh_vc = '';
    this.data.cod.ma_van_don = '';
    this.data.cod.tien_phi_cod = 0;
    this.data.cod.ma_nv_giao = '';
    this.data.cod.ten_nv = '';
    this.data.cod.ghi_chu_gh = '';
  }

  changeValue(value: string) {
    console.log(value);

  }

  onOpenDialog() {
    this.commonService.openDialog(SearchDialogComponent,
      { keyword: '', componentName: SEARCH_COMPONENT_NAME.DELIVERY_EMP, title: 'Danh sách đơn vị vận chuyển' }, 'search-style-dialog')
      .afterClosed()
      .subscribe((customer: Customer) => {
        if (customer) {
          this.data.cod.ma_nv_giao = customer.ma_kh;
          this.data.cod.ten_nv = customer.ten_kh;

          this.data.cod.ma_nv_giao = customer.ma_kh;
          this.data.cod.ten_nv = customer.ten_kh;
        }
      })
  }

  onEnterDECode(ma_nvvc: string) {
    if (!ma_nvvc) {
      return;
    }
    this.deliveryEmployeeApiService.getOneById(ma_nvvc).subscribe(result => {
      if (result.success && result.result) {
        this.handleAddDeliveryEmpl((result.result as any));
      } else {
        this.commonService.showMessage(Language.content.Staff_not_exist);
      }
    });
  }

  handleAddDeliveryEmpl(empl: any) {
    this.data.cod.ma_nv_giao = empl.ma_kh;
    this.data.cod.ten_nv = empl.ten_kh;
    this.data.cod.ten_nv = empl.ten_kh;
  }

}

