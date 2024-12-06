import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationVoucherComponent } from './navigation-voucher.component';

describe('NavigationVoucherComponent', () => {
  let component: NavigationVoucherComponent;
  let fixture: ComponentFixture<NavigationVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
