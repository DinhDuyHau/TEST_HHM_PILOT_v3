import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sales-stats',
  templateUrl: './sales-stats.component.html',
  styleUrls: ['./sales-stats.component.scss']
})
export class SalesStatsComponent implements OnChanges {
  @Input() data!: any;
  @Input() month!: any;

  ngOnChanges(changes: SimpleChanges): void {

  }

  formatNumber(value: number | null): string {
    if (value === null || value === undefined) {
      return '0';
    }

    return value.toLocaleString('de-DE');
  }
}
