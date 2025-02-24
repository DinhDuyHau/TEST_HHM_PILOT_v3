import { Component, OnInit, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'tabs-custom',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsCustomComponent implements AfterViewInit, OnChanges {
  @Input() title!: string;
  @Input() titleListWithCount: any[] = [];
  activatedTab = 0;
  titleList: { label: string; count?: number }[] = [];

  constructor(private elRef: ElementRef,
  ) {
  }

  // get computedTabList() {
  //   return this.titleListWithCount?.length ? this.titleListWithCount : Array.from(this.elRef.nativeElement.querySelectorAll('tab-custom')).map((e: any) => ({ label: e.attributes['label'].value })) || [];
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['titleListWithCount']) {
      this.updateTabList();
    }
  }

  updateTabList(): void {
    this.titleList = this.titleListWithCount?.length
      ? this.titleListWithCount
      : Array.from(this.elRef.nativeElement.querySelectorAll('tab-custom')).map((e) => ({
          label: (e as Element).getAttribute('label') || '',
        })) || [];
  }

  tabChange(tabId: number) {
    this.activatedTab = tabId;
    this.updateTabVisibility();
  }

  updateTabVisibility(): void {
    const tabs = this.elRef.nativeElement.querySelectorAll('tab-custom');
    tabs.forEach((tab: Element, index: number) => {
      (tab as HTMLElement).style.display = index === this.activatedTab ? 'block' : 'none';
    });
  }

  ngAfterViewInit(): void {
    this.updateTabList();
    this.updateTabVisibility();
  }

  ngOnInit(): void {
    // const tabs = this.elRef.nativeElement.querySelectorAll('tab-custom');
    // tabs.forEach((tab: any, index: number) => {
    //   if (index === this.activatedTab) {
    //     tab.style.display = 'block';
    //   } else {
    //     tab.style.display = 'none';
    //   }
    // });

    // this.titleList = Array.from(this.elRef.nativeElement.querySelectorAll('tab-custom')).map((e: any) => e.attributes['label'].value);
  }

}


