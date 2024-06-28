import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { CloseShiftPaymentService } from './close-shift-payment.service';
import { Receipt } from './close-shift-payment.model';

@Component({
  selector: 'app-close-shift-payment',
  templateUrl: './close-shift-payment.component.html',
  styleUrls: ['./close-shift-payment.component.scss']
})
export class CloseShiftPaymentComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private CloseShiftPaymentService: CloseShiftPaymentService) {
    super(CloseShiftPaymentService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}