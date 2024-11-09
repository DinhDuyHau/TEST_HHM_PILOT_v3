import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleServiceDialogComponent } from './sale-service-dialog.component';

describe('SaleServiceDialogComponent', () => {
  let component: SaleServiceDialogComponent;
  let fixture: ComponentFixture<SaleServiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleServiceDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
