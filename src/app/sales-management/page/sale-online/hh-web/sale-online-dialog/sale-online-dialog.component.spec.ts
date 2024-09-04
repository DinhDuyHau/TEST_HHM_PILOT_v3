import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOnlineDialogComponent } from './sale-online-dialog.component';

describe('SaleOnlineDialogComponent', () => {
  let component: SaleOnlineDialogComponent;
  let fixture: ComponentFixture<SaleOnlineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOnlineDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleOnlineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
