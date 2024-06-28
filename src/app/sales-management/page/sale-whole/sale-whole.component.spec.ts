import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleWholeComponent } from './sale-whole.component';

describe('SaleOnlineComponent', () => {
  let component: SaleWholeComponent;
  let fixture: ComponentFixture<SaleWholeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleWholeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleWholeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
