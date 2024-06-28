import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field } from '@app/_components/gridV2/grid.model';
import { Grid } from '@app/_components/gridV2/grid.model';
import { InternalPurchaseService } from './internal-purchase.service';
import { Receipt } from './internal-purchase.model';

@Component({
  selector: 'app-internal-purchase',
  templateUrl: './internal-purchase.component.html',
  styleUrls: ['./internal-purchase.component.scss']
})
export class InternalPurchaseComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private internalPurchaseService: InternalPurchaseService) {
    super(internalPurchaseService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton];
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}
