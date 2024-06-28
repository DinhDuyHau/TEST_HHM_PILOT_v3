import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckboxCustomComponent } from './form-checkbox-custom.component';

describe('FormCheckboxCustomComponent', () => {
  let component: FormCheckboxCustomComponent;
  let fixture: ComponentFixture<FormCheckboxCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCheckboxCustomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCheckboxCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
