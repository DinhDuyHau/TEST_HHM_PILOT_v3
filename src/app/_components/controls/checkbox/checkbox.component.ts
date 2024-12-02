import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {
  @Input() value: boolean = true;
  @Input() name!: string;
  @Input() label!: string;

  @Output() handleChangeValue = new EventEmitter<any>();


  onChangeValue(event: any) {
    this.handleChangeValue.emit(event);
  }
}
