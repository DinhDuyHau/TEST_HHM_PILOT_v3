import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCustomComponent } from './dropdown.component';

describe('TabsCustomComponent', () => {
  let component: DropdownCustomComponent;
  let fixture: ComponentFixture<DropdownCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropdownCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
