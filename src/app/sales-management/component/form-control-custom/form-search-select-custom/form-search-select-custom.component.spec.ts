import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSearchSelectCustomComponent } from './form-search-select-custom.component';

describe('FormSelectCustomComponent', () => {
  let component: FormSearchSelectCustomComponent;
  let fixture: ComponentFixture<FormSearchSelectCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSearchSelectCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormSearchSelectCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
