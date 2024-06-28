import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ViewChildren,
  QueryList,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  Renderer2,
  OnInit
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LookupComponent } from '../lookup/lookup.component';
import { CustomerService } from '../category/customer/customer.service';

@Directive({
  selector: '[appLookup]'
})
export class LookupDirective implements OnInit {

  @Input('reference') reference!: any;

  @ContentChild(TemplateRef) inputFieldsTemplateRef!: TemplateRef<any>;
  private inputRefs!: QueryList<ElementRef>;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private customerService: CustomerService
  ) {
  }
  ngOnInit(): void {
    console.log(this.el.nativeElement.parentNode);
    // const button = this.renderer.('span');
    // button.classList.add('search-button');
    // button.classList.add('px-1');
    // button.classList.add('cursor-pointer');
    // button.classList.add('hover:text-primary');
    // button.innerHTML = iconHtml;
    // this.renderer.listen(button, 'click', () => {
    //   const dialogConfig = new MatDialogConfig();
    //   dialogConfig.width = '100%';
    //   dialogConfig.height = '90%';
    //   dialogConfig.disableClose = true;
    //   dialogConfig.data = {
    //     title: 'Danh mục khách hàng',
    //     service: this.customerService
    //   };
    //   const dialogRef = this.dialog.open(LookupComponent, dialogConfig);
    //   dialogRef.afterClosed().subscribe(result => {
    //     this.reference.forEach((item: any) => {
    //       item.value = result[item.name] || '';
    //     });
    //   });
    // });
    // this.el.nativeElement.after(button);
  }
}
