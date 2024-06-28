import { Component, OnInit, OnChanges } from '@angular/core';
import button from '@app/_common/button';
import { Button, Field, Grid } from '@app/_components/gridV2/grid.model';
import { WarrantyOutService } from './warranty-out.service';
import { Receipt } from './warranty-out.model';

@Component({
  selector: 'app-warranty-out',
  templateUrl: './warranty-out.component.html',
  styleUrls: ['./warranty-out.component.scss']
})
export class WarrantyOutComponent extends Grid<Receipt> implements OnInit, OnChanges {
  override fields!: Field[];
  buttonsCustom!: Button[];
  constructor(private eventGiftService: WarrantyOutService) {
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