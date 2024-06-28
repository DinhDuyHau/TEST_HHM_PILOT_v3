import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { StockTranferInService } from './stock-tranfer-in.service';
import { Receipt } from './stock-tranfer-in.model';
@Component({
  selector: 'app-stock-tranfer-in',
  templateUrl: './stock-tranfer-in.component.html',
  styleUrls: ['./stock-tranfer-in.component.scss']
})
export class StockTranferInComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private stockTranferInService: StockTranferInService) {
    super(stockTranferInService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}
