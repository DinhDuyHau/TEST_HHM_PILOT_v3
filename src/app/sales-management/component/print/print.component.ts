import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';
import { MenuReport } from '@app/_models';
import { GridService } from '@app/_components/gridV2/grid.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnChanges, OnInit {
  @Input() voucherId!: string;
  @Input() status!: string;
  @Input() entityName!: string;

  isOnpenInFile = false;
  isLoading = false;

  menu_report: MenuReport[] = [];

  constructor(
    private ticketApiService: TicketApiService,
    private router: Router,
    private commonService: CommonService,
    private gridService: GridService
  ) {

  }
  ngOnInit(): void {
    // do remove useGridCached nên khi quay lại phiếu sẽ ko còn data đã tìm kiếm
    // localStorage.removeItem('useGridCached');
    // console.log('entity', this.entityName)
    if (this.entityName) {
      this.ticketApiService.getMenuReport(this.entityName).subscribe(result => {
        if (result && result.result && result.result.length) {
          this.menu_report = [...result.result];
        }
      });
    }
  }

  ngOnChanges(): void {
  }

  toggleOpenOptionInFile() {
    this.isOnpenInFile = !this.isOnpenInFile;
  }

  onClickInvoicePrint(option_report: MenuReport) {
    if (this.voucherId && option_report.controller && option_report.form_id) {
      if (this.status === '0' || this.status === '1') {
        this.commonService.showMessage('Không thể in phiếu chưa hoàn thành');
        return;
      }

      this.isLoading = true;
      option_report.controller = option_report.controller.trim();
      option_report.form_id = option_report.form_id.trim();
      this.gridService.openPrintDialog(this.voucherId, option_report).then((value) => {
        this.isLoading = false;
        if (value) {
          // this.handleButton.emit({ buttonId: button.PrintButton.id, data: this.dataSource.data[this.focusRow] });
        }
      });
    } else {
      this.commonService.showMessage('Chưa chọn chứng từ cần in');
    }
  }
}
