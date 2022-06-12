import { Component, Input } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-custom-date-time',
    templateUrl: './custom-date-time.component.html'
})
export class CustomDateTimeComponent extends BaseCustomUiComponent {

    @Input() pickerType = 'both';

    constructor() { super(); }
}
