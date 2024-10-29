import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { OtherMoneyTransferService } from './other-money-transfer.service';
import { Receipt } from './other-money-transfer.model';

@Component({
  selector: 'app-other-money-transfer',
  templateUrl: './other-money-transfer.component.html',
  styleUrls: ['./other-money-transfer.component.scss']
})
export class OtherMoneyTransferComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private OtherMoneyTransferService: OtherMoneyTransferService) {
    super(OtherMoneyTransferService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}