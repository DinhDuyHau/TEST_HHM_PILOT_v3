import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailComponent } from './stock-transfer.component';

describe('RetailComponent', () => {
  let component: RetailComponent;
  let fixture: ComponentFixture<RetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
