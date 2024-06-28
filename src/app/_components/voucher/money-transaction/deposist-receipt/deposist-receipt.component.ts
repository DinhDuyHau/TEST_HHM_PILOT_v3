import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { DeposistReceiptService } from './deposist-receipt.service';
import { Receipt } from './deposist-receipt.model';

@Component({
  selector: 'app-deposist-receipt',
  templateUrl: './deposist-receipt.component.html',
  styleUrls: ['./deposist-receipt.component.scss']
})
export class DeposistReceiptComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private DeposistReceiptService: DeposistReceiptService) {
    super(DeposistReceiptService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}