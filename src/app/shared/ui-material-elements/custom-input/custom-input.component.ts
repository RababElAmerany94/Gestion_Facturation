import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-custom-input',
    templateUrl: './custom-input.component.html',
})
export class CustomInputComponent extends BaseCustomUiComponent {

    /** add event  */
    @Output()
    addEvent = new EventEmitter();

    @Input()
    type = 'text';

    @Input()
    isAddMode = false;

    @Input()
    suffixIcon: string;

    @Input()
    readOnly = false;

    constructor() {
        super();
    }

    /**
     * Emit input event to parent
     * @param event the input event of the input
     */
    input(event) {
        this.changeEvent.emit(event);
    }

    /**
     * open add address dialog
     */
    addValue(event): void {
        event.stopPropagation();
        if (this.formInstant.get(this.inputName).valid) {
            this.addEvent.emit(this.formInstant.get(this.inputName).value);
            this.formInstant.get(this.inputName).setValue('');
        }
    }
}
