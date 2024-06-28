import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleChangeComponent } from './sale-change.component';

describe('SaleChangeComponent', () => {
  let component: SaleChangeComponent;
  let fixture: ComponentFixture<SaleChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleChangeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
