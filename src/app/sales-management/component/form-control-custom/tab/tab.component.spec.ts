import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCustomComponent } from './tab.component';

describe('TabsCustomComponent', () => {
  let component: TabCustomComponent;
  let fixture: ComponentFixture<TabCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TabCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
