import {
  Directive,
  OnInit,
  Renderer2,
  Input,
  ElementRef,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[resizeColumn]',
})
export class ResizeColumnDirective implements OnInit, OnChanges {
  @Input('resizeColumn')
  resizable!: boolean;

  @Input() index!: number;

  private startX!: number;

  private startWidth!: number;

  private column!: HTMLElement;

  private table!: HTMLElement[];

  private pressed!: boolean;

  private animationFrameId: number | null = null;
  private pendingWidth: number | null = null;
  private cachedCells: HTMLElement[] = [];
  private lastAppliedWidth: number | null = null;
  private removeMouseMoveListener: (() => void) | null = null;
  private removeMouseUpListener: (() => void) | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }

  ngOnInit() {
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer
        .parentNode(thead)
        .closest('#grid')
        .querySelectorAll('table');
      const resizer = this.renderer.createElement('span');
      this.renderer.addClass(resizer, 'resize-holder');
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
    }
  }
  ngOnChanges() {
    // if (!this.resizable) {
    //   const resizer =
    //     this.column.querySelectorAll('.resize-holder') || new Node();
    //   resizer.forEach(item => {
    //     this.column.removeChild(item);
    //   });
    // } else {
    //   const resizable = this.column.querySelectorAll('.resize-holder');
    //   if (resizable.length === 0) {
    //     const row = this.renderer.parentNode(this.column);
    //     const thead = this.renderer.parentNode(row);
    //     this.table = this.renderer
    //       .parentNode(thead)
    //       .closest('#grid')
    //       .querySelectorAll('table');
    //     const resizer = this.renderer.createElement('span');
    //     this.renderer.addClass(resizer, 'resize-holder');
    //     this.renderer.appendChild(this.column, resizer);
    //     this.renderer.listen(resizer, 'mousedown', this.onMouseDown);

    //     this.table.forEach(item =>
    //       this.renderer.listen(item, 'mousemove', this.onMouseMove),
    //     );
    //     // this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
    //     this.renderer.listen('document', 'mouseup', this.onMouseUp);
    //   }
    // }
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;

    // chỉ nghe khi bắt thay đổi kích thước
    this.removeMouseMoveListener = this.renderer.listen('document', 'mousemove', this.onMouseMove);
    this.removeMouseUpListener = this.renderer.listen('document', 'mouseup', this.onMouseUp);

    // cache lại
    this.cachedCells = [];
    this.table.forEach(item => {
      const temp = Array.from(item.querySelectorAll('.mat-mdc-row'));
      temp.forEach((rowItem) => {
        const cell = rowItem.querySelectorAll('.mat-mdc-cell').item(this.index);
        if (cell) this.cachedCells.push(cell as HTMLElement);
      });
    });
    // thêm class
    this.table.forEach(item => {
      this.renderer.addClass(item, 'resizing');
    });
    this.lastAppliedWidth = this.startWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 35;
    if (this.pressed && event.buttons) {
      // Calculate width of column
      const width = this.startWidth + (event.pageX - this.startX - offset);
      // Chỉ update nếu width thực sự thay đổi đáng kể (>=1px)
      if (Math.abs((this.lastAppliedWidth ?? 0) - width) >= 1) {
        this.pendingWidth = width;
        if (!this.animationFrameId) {
          this.animationFrameId = requestAnimationFrame(this.applyResize);
        }
      }
    }
  };

  applyResize = () => {
    if (this.pendingWidth !== null && Math.abs((this.lastAppliedWidth ?? 0) - this.pendingWidth) >= 1) {
      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${this.pendingWidth}px`);
      // Set table cells width
      for (const cell of this.cachedCells) {
        this.renderer.setStyle(cell, 'width', `${this.pendingWidth}px`);
      }
      this.lastAppliedWidth = this.pendingWidth;
      this.pendingWidth = null;
    }
    this.animationFrameId = null;
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      // xóa class
      this.table.forEach(item => {
        this.renderer.removeClass(item, 'resizing');
      });
      // xóa sự kiện sau khi resize xong
      if (this.removeMouseMoveListener) {
        this.removeMouseMoveListener();
        this.removeMouseMoveListener = null;
      }
      if (this.removeMouseUpListener) {
        this.removeMouseUpListener();
        this.removeMouseUpListener = null;
      }
      // Hủy animation frame nếu còn
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.pendingWidth = null;
      this.cachedCells = [];
      this.lastAppliedWidth = null;
    }
  };
}
