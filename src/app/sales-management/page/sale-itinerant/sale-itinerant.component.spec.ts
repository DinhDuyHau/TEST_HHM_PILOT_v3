import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItinerantComponent } from './sale-itinerant.component';

describe('SaleItinerant', () => {
  let component: SaleItinerantComponent;
  let fixture: ComponentFixture<SaleItinerantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleItinerantComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaleItinerantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
