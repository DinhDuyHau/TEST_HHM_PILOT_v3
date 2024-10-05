import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchV2DialogComponent } from './serach-v2-dialog.component';

describe('SearchV2DialogComponent', () => {
  let component: SearchV2DialogComponent;
  let fixture: ComponentFixture<SearchV2DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchV2DialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchV2DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
