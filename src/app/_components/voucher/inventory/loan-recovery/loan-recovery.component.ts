import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { LoanRecoveryService } from './loan-recovery.service';
import { Receipt } from './loan-recovery.model';

@Component({
  selector: 'app-loan-recovery',
  templateUrl: './loan-recovery.component.html',
  styleUrls: ['./loan-recovery.component.scss']
})
export class LoanRecoveryComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private eventGiftService: LoanRecoveryService) {
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