import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmDialogComponent } from './crm-dialog.component';

describe('CrmDialogComponent', () => {
  let component: CrmDialogComponent;
  let fixture: ComponentFixture<CrmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
