import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { OtherPaymentService } from './other-payment.service';
import { Receipt } from './other-payment.model';

@Component({
  selector: 'app-other-payment',
  templateUrl: './other-payment.component.html',
  styleUrls: ['./other-payment.component.scss']
})
export class OtherPaymentComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private OtherPaymentService: OtherPaymentService) {
    super(OtherPaymentService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}