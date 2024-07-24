import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import dataFormat from '@app/_common/dataFormat';
import { EcommerceInfomation } from '@app/sales-management/model/ticket/sale-online-ecommerce/model';
import { SEARCH_COMPONENT_NAME, SearchDialogComponent } from '../../search/serach-dialog.component';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { DeliveryEmployeeApiService } from '@app/sales-management/api/delivery-employee-api.service';
import { Customer } from '@app/_components/category/customer/customer.model';
import { Language } from '@app/sales-management/page/common/language';

@Component({
  selector: 'ecommerce-order-infomation',
  templateUrl: './order-infomation.component.html',
  styleUrls: ['./order-infomation.component.scss'],
})
export class OrderInfomationComponent implements OnInit, AfterViewInit {
  @Input() data!: EcommerceInfomation;
  @Input() readonly: boolean = false;

  dataFormat = dataFormat;

  constructor(
    private commonService: CommonService,
    private deliveryEmployeeApiService: DeliveryEmployeeApiService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  // #region delivery empl
  handleAddDeliveryEmpl(ma_dvvc: string) {
    this.data.ma_dvvc = ma_dvvc;
  }

  onEnterDECode(ma_nvvc: string) {
    if (!ma_nvvc) {
      return;
    }
    this.deliveryEmployeeApiService.getOneById(ma_nvvc).subscribe(result => {
      if (result && result.success && result.result) {
        this.handleAddDeliveryEmpl((result.result as any as Customer).ma_kh)
      } else {
        this.commonService.showMessage(Language.content.Staff_not_exist);
      }
    });
  }

  openSearchDEDialog() {
    this.commonService.openDialog(SearchDialogComponent, { keyword: '', componentName: SEARCH_COMPONENT_NAME.DELIVERY_PARNER }, 'search-style-dialog')
      .afterClosed()
      .subscribe((empl: Customer) => {
        if (empl && empl.ma_kh) {
          this.handleAddDeliveryEmpl(empl.ma_kh);
        }
      });
  }

  //#endregion delivery empl

  handleNgayNhanHang(event: any, ref: any) {
    this.data.ngay_nhan_hang = ref.isoDateString.toString();
    console.log(this.data.ngay_nhan_hang);
  }

  onBlurNgayNhanHang(event: any, ref: any) {
    this.data.ngay_nhan_hang = ref.isoDateString.toString();
  }

  onEnterNgayNhanHang(event: any, next_control: any) {
    if (event.key === 'Enter' || event.keyCode === 13 || event.which === 13) {
      if (next_control)
        if (next_control.input)
          next_control.input.nativeElement.focus();
        else
          next_control.focus();
    }

  }

}

