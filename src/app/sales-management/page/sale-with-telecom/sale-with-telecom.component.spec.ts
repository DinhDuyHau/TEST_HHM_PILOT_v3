import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleWithTelecomComponent } from './sale-with-telecom.component';

describe('SaleWithTelecomComponent', () => {
  let component: SaleWithTelecomComponent;
  let fixture: ComponentFixture<SaleWithTelecomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleWithTelecomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleWithTelecomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
