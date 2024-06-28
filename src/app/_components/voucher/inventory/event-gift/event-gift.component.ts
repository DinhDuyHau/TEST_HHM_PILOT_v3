import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { EventGiftService } from './event-gift.service';
import { Receipt } from './event-gift.model';
import { VOUCHER_TYPE } from '../../enum/voucher_enum';

@Component({
  selector: 'app-event-gift',
  templateUrl: './event-gift.component.html',
  styleUrls: ['./event-gift.component.scss']
})
export class EventGiftComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  voucherCode = VOUCHER_TYPE.EVENT_GIFT.voucherCode;
  sysid = VOUCHER_TYPE.EVENT_GIFT.sysid;
  constructor(private eventGiftService: EventGiftService) {
    super(eventGiftService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}