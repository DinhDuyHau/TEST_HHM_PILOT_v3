import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageForImeiComponent } from './package-for-imei.component';

describe('PackageForImeiComponent', () => {
  let component: PackageForImeiComponent;
  let fixture: ComponentFixture<PackageForImeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackageForImeiComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PackageForImeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
