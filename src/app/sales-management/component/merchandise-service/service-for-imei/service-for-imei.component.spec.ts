import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceForImeiComponent } from './service-for-imei.component';

describe('ServiceForImeiComponent', () => {
  let component: ServiceForImeiComponent;
  let fixture: ComponentFixture<ServiceForImeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceForImeiComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ServiceForImeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
