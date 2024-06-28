import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { LoanOutService } from './loan-out.service';
import { Receipt } from './loan-out.model';

@Component({
  selector: 'app-loan-out',
  templateUrl: './loan-out.component.html',
  styleUrls: ['./loan-out.component.scss']
})
export class LoanOutComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private eventGiftService: LoanOutService) {
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