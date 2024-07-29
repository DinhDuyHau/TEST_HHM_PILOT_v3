import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportImeiComponent } from './import-imei.component';

describe('ImportImeiComponent', () => {
  let component: ImportImeiComponent;
  let fixture: ComponentFixture<ImportImeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportImeiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportImeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
