import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { DeposistReturnReceiptService } from './deposist-return-payment.service';
import { Receipt } from './deposist-return-payment.model';

@Component({
  selector: 'app-deposist-return-payment',
  templateUrl: './deposist-return-payment.component.html',
  styleUrls: ['./deposist-return-payment.component.scss']
})
export class DeposistReturnReceiptComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private DeposistReturnReceiptService: DeposistReturnReceiptService) {
    super(DeposistReturnReceiptService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}