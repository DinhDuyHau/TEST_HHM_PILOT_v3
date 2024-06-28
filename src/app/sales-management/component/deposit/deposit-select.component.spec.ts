import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositSelectComponent } from './deposit-select.component';


describe('DepositSelectComponent', () => {
  let component: DepositSelectComponent;
  let fixture: ComponentFixture<DepositSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositSelectComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DepositSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
