import { Component } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
  selector: 'kt-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
})
export class CustomDatePickerComponent extends BaseCustomUiComponent {

  constructor() { super(); }

}
