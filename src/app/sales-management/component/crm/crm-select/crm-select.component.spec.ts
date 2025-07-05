import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CRMSelectComponent } from './crm-select.component';


describe('CRMSelectComponent', () => {
  let component: CRMSelectComponent;
  let fixture: ComponentFixture<CRMSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CRMSelectComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CRMSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
