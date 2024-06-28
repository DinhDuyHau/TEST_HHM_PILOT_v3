import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { DebtReceiptService } from './debt-receipt.service';
import { Receipt } from './debt-receipt.model';

@Component({
  selector: 'app-debt-receipt',
  templateUrl: './debt-receipt.component.html',
  styleUrls: ['./debt-receipt.component.scss']
})
export class DebtReceiptComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private DebtReceiptService: DebtReceiptService) {
    super(DebtReceiptService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}