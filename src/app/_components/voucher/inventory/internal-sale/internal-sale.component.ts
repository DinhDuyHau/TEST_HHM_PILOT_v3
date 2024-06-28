import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { InternalSaleService } from './internal-sale.service';
import { Receipt } from './internal-sale.model';

@Component({
  selector: 'app-internal-sale',
  templateUrl: './internal-sale.component.html',
  styleUrls: ['./internal-sale.component.scss']
})
export class InternalSaleComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private internalSaleService: InternalSaleService) {
    super(internalSaleService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}