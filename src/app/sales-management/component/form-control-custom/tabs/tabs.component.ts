import { Component, OnInit, ElementRef, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'tabs-custom',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsCustomComponent implements OnInit {
  @Input() title!: string;
  @Input() titleListWithCount: any[] = [];
  activatedTab = 0;
  titleList: any = [];

  constructor(private elRef: ElementRef,
  ) {
  }

  // get computedTabList() {
  //   return this.titleListWithCount?.length ? this.titleListWithCount : Array.from(this.elRef.nativeElement.querySelectorAll('tab-custom')).map((e: any) => ({ label: e.attributes['label'].value })) || [];
  // }

  tabChange(tabId: number) {
    this.activatedTab = tabId;
    const tabs = this.elRef.nativeElement.querySelectorAll('tab-custom');
    tabs.forEach((tab: any, index: number) => {
      if (index === tabId) {
        tab.style.display = 'block';
      } else {
        tab.style.display = 'none';
      }
    });

  }

  // ngAfterViewInit(): void {
  //   const tabs = this.elRef.nativeElement.querySelectorAll('tab-custom');
  //   tabs.forEach((tab: any, index: number) => {
  //     if (index === this.activatedTab) {
  //       tab.style.display = 'block';
  //     } else {
  //       tab.style.display = 'none';
  //     }
  //   });
  // }

  ngOnInit(): void {
    const tabs = this.elRef.nativeElement.querySelectorAll('tab-custom');
    tabs.forEach((tab: any, index: number) => {
      if (index === this.activatedTab) {
        tab.style.display = 'block';
      } else {
        tab.style.display = 'none';
      }
    });

    this.titleList = Array.from(this.elRef.nativeElement.querySelectorAll('tab-custom')).map((e: any) => e.attributes['label'].value);
  }

}


