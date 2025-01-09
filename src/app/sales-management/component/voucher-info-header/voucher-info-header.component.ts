import { Component, Input, OnChanges } from '@angular/core';
import { getDateTimeFormat } from '@app/_common/commonFunction';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';

@Component({
  selector: 'app-voucher-info-header',
  templateUrl: './voucher-info-header.component.html',
  styleUrls: ['./voucher-info-header.component.scss']
})
export class VoucherInfoHeaderComponent implements OnChanges {
  @Input() entity!: string;
  @Input() voucherId!: string;

  data: any;
  created_at!: any;
  created_by!: any;
  updated_at!: any;
  updated_by!: any;

  constructor(
    private ticketApiService: TicketApiService
  ) {
  }

  ngOnChanges(): void {
    this.handleGetVoucherInfo();
  }

  handleGetVoucherInfo() {
    if (this.voucherId != '') {
      this.ticketApiService.getVoucherInfomation(this.entity, this.voucherId).subscribe(result => {
        if (result && result.success) {
          this.data = result.result;
          this.created_at = getDateTimeFormat(new Date(this.data.createAt));
          this.updated_at = getDateTimeFormat(new Date(this.data.updateAt));
          this.created_by = this.data.createBy;
          this.updated_by = this.data.updateBy;
        }
      });
    }
  }
}
