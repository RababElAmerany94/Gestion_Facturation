import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
  selector: 'kt-custom-input-password',
  templateUrl: './custom-input-password.component.html',
})
export class CustomInputPasswordComponent extends BaseCustomUiComponent {

  @Output() inputEvent = new EventEmitter();
  type = 'password';

  constructor() {
    super();
  }

  /**
   * Emit input event to parent
   * @param event the input event of the input
   */
  input(event) {
    this.inputEvent.emit(event);
  }

  toggleShowPassword() {
    this.type = this.type === 'password' ? 'text' : 'password';
  }

}
