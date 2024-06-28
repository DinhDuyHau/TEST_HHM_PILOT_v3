import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputCustomComponent } from './form-input-custom.component';

describe('FormInputCustomComponent', () => {
  let component: FormInputCustomComponent;
  let fixture: ComponentFixture<FormInputCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormInputCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormInputCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
