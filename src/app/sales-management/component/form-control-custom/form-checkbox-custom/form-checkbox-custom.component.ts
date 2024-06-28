import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-checkbox-custom',
  templateUrl: './form-checkbox-custom.component.html',
  styleUrls: ['./form-checkbox-custom.component.scss']
})
export class FormCheckboxCustomComponent {
  @Input() value!: boolean;
  @Input() title!: string;
  @Input() label!: string;

}
