import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchImeiWarrantyComponent } from './search-imei-warranty.component';

describe('SearchImeiWarrantyComponent', () => {
  let component: SearchImeiWarrantyComponent;
  let fixture: ComponentFixture<SearchImeiWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchImeiWarrantyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchImeiWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
