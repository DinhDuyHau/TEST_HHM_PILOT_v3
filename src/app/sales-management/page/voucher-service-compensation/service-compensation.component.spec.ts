import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCompensationComponent } from './service-compensation.component';

describe('RetailComponent', () => {
  let component: ServiceCompensationComponent;
  let fixture: ComponentFixture<ServiceCompensationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceCompensationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ServiceCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
