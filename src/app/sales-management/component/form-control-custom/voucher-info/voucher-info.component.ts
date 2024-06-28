import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { VoucherInfoDialogComponent } from './voucher-info-dialog/voucher-info-dialog.component';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-voucher-info',
  templateUrl: './voucher-info.component.html',
  styleUrls: ['./voucher-info.component.scss']
})

export class VoucherInfoComponent implements OnChanges {
  @Input() entity!: string;
  @Input() voucherId!: string;
  constructor(private ticketApiService: TicketApiService, private dialog: MatDialog, private commonService: CommonService) {
    //
  }
  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  handleClickGetVoucherInfo() {
    if (this.voucherId != '') {
      this.ticketApiService.getVoucherInfomation(this.entity, this.voucherId).subscribe(result => {
        if (result && result.success) {
          this.commonService.openDialog(VoucherInfoDialogComponent,
            { data: result.result }, 'search-style-dialog')
            .afterClosed()
            .subscribe((data) => {
              //
              //this.onChange();
              // pos && this.handleAddPOS(pos)
            });
        }
      });
    }
  }


}
