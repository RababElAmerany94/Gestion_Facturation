import { Component } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
  selector: 'kt-custom-toggle-button',
  templateUrl: './custom-toggle-button.component.html'
})
export class CustomToggleButtonComponent extends BaseCustomUiComponent {

  constructor() {
    super();
  }

  onEndpointValChange(event: any) {
    this.changeEvent.emit(event);
  }

}
