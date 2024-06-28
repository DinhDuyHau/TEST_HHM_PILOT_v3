import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsCustomComponent } from './tabs.component';

describe('TabsCustomComponent', () => {
  let component: TabsCustomComponent;
  let fixture: ComponentFixture<TabsCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsCustomComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TabsCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
