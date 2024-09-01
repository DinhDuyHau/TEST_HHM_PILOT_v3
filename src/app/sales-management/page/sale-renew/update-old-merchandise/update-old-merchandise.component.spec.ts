import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOldMerchandiseComponent } from './update-old-merchandise.component';

describe('UpdateOldMerchandiseComponent', () => {
  let component: UpdateOldMerchandiseComponent;
  let fixture: ComponentFixture<UpdateOldMerchandiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOldMerchandiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOldMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

