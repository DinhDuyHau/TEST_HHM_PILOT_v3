import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { CollectionReceiptService } from './collection-receipt.service';
import { Receipt } from './collection-receipt.model';

@Component({
  selector: 'app-collection-receipt',
  templateUrl: './collection-receipt.component.html',
  styleUrls: ['./collection-receipt.component.scss']
})
export class CollectionReceiptComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private CollectionReceiptService: CollectionReceiptService) {
    super(CollectionReceiptService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}