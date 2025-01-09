import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnChanges, OnInit {
  @Input() voucherId!: string;
  @Input() email: string = '';
  @Input() status!: string;

  constructor(
    private ticketApiService: TicketApiService,
    private router: Router,
    private commonService: CommonService
  ) {

  }
  ngOnInit(): void {

  }

  ngOnChanges(): void {
  }

  sendEmail() {
    if (this.email == '') {
      this.commonService.showMessage('Phiếu không có email.')
      return
    }
    if (this.status != '2') {
      this.commonService.showMessage('Phiếu chưa ở trạng thái hoàn thành.')
      return
    }
    this.commonService.sendEmailService(this.voucherId).subscribe((res) => {
      if (res.success) {
        this.commonService.showMessageByName(res.message);
      }
      else
        this.commonService.showMessageByName('send_email_error')
    });
  }
}
