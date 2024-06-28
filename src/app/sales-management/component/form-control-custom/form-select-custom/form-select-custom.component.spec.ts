import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectCustomComponent } from './form-select-custom.component';

describe('FormSelectCustomComponent', () => {
  let component: FormSelectCustomComponent;
  let fixture: ComponentFixture<FormSelectCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSelectCustomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSelectCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
