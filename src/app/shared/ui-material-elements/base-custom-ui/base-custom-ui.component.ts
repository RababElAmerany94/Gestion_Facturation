import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'kt-base-custom-ui',
    template: ``
})
export class BaseCustomUiComponent {

    @Input() placeholder: string;
    @Input() label: string;
    @Input() hint: string;
    @Input() inputName: string;
    @Input() formInstant: FormGroup;
    @Output() changeEvent = new EventEmitter();

    constructor() { }


    get control() {
        return this.formInstant.controls[this.inputName];
    }

}
