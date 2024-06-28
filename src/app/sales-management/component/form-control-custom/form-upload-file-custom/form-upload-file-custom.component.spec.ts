import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUploadFileCustomComponent } from './form-upload-file-custom.component';

describe('FormUploadFileCustomComponent', () => {
  let component: FormUploadFileCustomComponent;
  let fixture: ComponentFixture<FormUploadFileCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormUploadFileCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormUploadFileCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
