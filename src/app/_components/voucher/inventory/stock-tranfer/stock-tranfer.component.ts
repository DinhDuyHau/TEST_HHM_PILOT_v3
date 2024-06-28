import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { StockTranferService } from './stock-tranfer.service';
import { Receipt } from './stock-tranfer.model';

@Component({
  selector: 'app-stock-tranfer',
  templateUrl: './stock-tranfer.component.html',
  styleUrls: ['./stock-tranfer.component.scss']
})
export class StockTranferComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private stockTranferService: StockTranferService) {
    super(stockTranferService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}