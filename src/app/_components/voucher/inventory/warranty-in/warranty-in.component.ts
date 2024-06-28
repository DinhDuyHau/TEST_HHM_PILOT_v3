import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { WarrantyInService } from './warranty-in.service';
import { Receipt } from './warranty-in.model';

@Component({
  selector: 'app-warranty-in',
  templateUrl: './warranty-in.component.html',
  styleUrls: ['./warranty-in.component.scss']
})
export class WarrantyInComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private eventGiftService: WarrantyInService) {
    super(eventGiftService);
    this.buttonsCustom = [button.RefreshButton, button.LockingColumnButton, button.PrintButton, button.AddButton];
  }
  ngOnInit(): void {
    //
  }

  ngOnChanges(): void {
    //
  }
}