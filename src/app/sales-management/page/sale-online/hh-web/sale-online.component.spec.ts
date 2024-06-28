import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOnlineComponent } from './sale-online.component';

describe('SaleOnlineComponent', () => {
  let component: SaleOnlineComponent;
  let fixture: ComponentFixture<SaleOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleOnlineComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
