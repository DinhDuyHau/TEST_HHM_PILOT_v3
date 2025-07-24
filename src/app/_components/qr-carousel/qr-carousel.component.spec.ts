import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCarouselComponent } from './qr-carousel.component';

describe('QrCarouselComponent', () => {
  let component: QrCarouselComponent;
  let fixture: ComponentFixture<QrCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
