import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TicketApiService } from '@app/sales-management/api/ticket-api.service';
import { CommonService } from '@app/sales-management/page/common/common.service';

@Component({
  selector: 'app-navigation-voucher',
  templateUrl: './navigation-voucher.component.html',
  styleUrls: ['./navigation-voucher.component.scss']
})
export class NavigationVoucherComponent implements OnChanges, OnInit {
  @Input() mode!: any;
  @Input() data!: any;
  @Input() entity!: any;
  @Input() table_name!: any;
  @Input() voucherId!: string;

  disabled: boolean = false;
  is_prev: boolean = true;
  is_next: boolean = true;
  prev_sttrec: any;
  next_sttrec: any;
  tickets: any;

  constructor(
    private ticketApiService: TicketApiService,
    private router: Router,
    private commonService: CommonService
  ) {

  }
  ngOnInit(): void {

  }

  ngOnChanges(): void {
    // this.handleInitPrevAndNext();
    this.handleInitPrevAndNext2();
    this.handleModeView();
  }

  /*
  * Hàm xử lý prev và next phiếu từ local
  */
  handleInitPrevAndNext2() {
    // Lấy dữ liệu từ localStorage
    const tickets = this.commonService.getTicketFromLocalStorage();

    if (tickets && tickets.length > 0) {
      const currentIndex = tickets.indexOf(this.voucherId);

      // Kiểm tra nếu không tìm thấy stt_rec trong mảng
      if (currentIndex === -1) {
        this.prev_sttrec = '';
        this.next_sttrec = '';
      } else {
        // Tìm prev và next dựa trên chỉ số hiện tại trong mảng
        this.prev_sttrec = currentIndex > 0 ? tickets[currentIndex - 1] : '';
        this.next_sttrec = currentIndex < tickets.length - 1 ? tickets[currentIndex + 1] : '';
      }
    } else {
      this.prev_sttrec = '';
      this.next_sttrec = '';
    }

    // Cập nhật trạng thái các nút
    this.handleProcessDisableButton(this.prev_sttrec, this.next_sttrec);
  }

  /*
  * Hàm xử lý prev và next phiếu từ api
  */
  handleInitPrevAndNext() {
    if (this.entity != '' && this.data.stt_rec != '' && this.table_name != '') {
      this.ticketApiService.navigationVoucher(this.table_name, this.data.stt_rec, this.data.ngay_ct).subscribe((result: any) => {
        if (!result) {
          this.prev_sttrec = '';
          this.next_sttrec = '';
        } else {
          this.prev_sttrec = result.prev || '';
          this.next_sttrec = result.next || '';
        }
        this.handleProcessDisableButton(this.prev_sttrec, this.next_sttrec);
      });
    }
  }

  handleModeView() {
    switch (this.mode) {
      // create
      case 0:
        this.disabled = false;
        break;
      // update
      case 1:
        this.disabled = true;
        break;
      // view
      case 2:
        this.disabled = true;
        break;
    }
  }

  handleProcessDisableButton(prev: any, next: any) {
    if(!prev)
      this.is_prev = true;
    else
      this.is_prev = false;

    if(!next)
      this.is_next = true;
    else
      this.is_next = false;
  }

  onClickPrev() {
    const queryParams = { ...this.router.parseUrl(this.router.url).queryParams, key: this.prev_sttrec };
    this.router.navigate([], { queryParams }).then(() => {
      window.location.reload();
    });
  }

  onClickNext() {
    const queryParams = { ...this.router.parseUrl(this.router.url).queryParams, key: this.next_sttrec };
    this.router.navigate([], { queryParams }).then(() => {
      window.location.reload();
    });
  }
}
