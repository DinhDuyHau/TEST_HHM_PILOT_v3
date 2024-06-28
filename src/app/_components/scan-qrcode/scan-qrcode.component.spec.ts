import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanQrcodeComponent } from './scan-qrcode.component';

describe('ScanQrcodeComponent', () => {
  let component: ScanQrcodeComponent;
  let fixture: ComponentFixture<ScanQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanQrcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
