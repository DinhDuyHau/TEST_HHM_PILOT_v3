import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesStatsComponent } from './sales-stats.component';

describe('SalesStatsComponent', () => {
  let component: SalesStatsComponent;
  let fixture: ComponentFixture<SalesStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
