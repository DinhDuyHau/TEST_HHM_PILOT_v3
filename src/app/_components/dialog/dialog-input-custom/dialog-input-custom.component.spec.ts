import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInputCustomComponent } from './dialog-input-custom.component';

describe('DialogInputComponent', () => {
  let component: DialogInputCustomComponent;
  let fixture: ComponentFixture<DialogInputCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInputCustomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogInputCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
