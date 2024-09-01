import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceDialogComponent } from './ecommerce-dialog.component';

describe('EcommerceDialogComponent', () => {
  let component: EcommerceDialogComponent;
  let fixture: ComponentFixture<EcommerceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcommerceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcommerceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
