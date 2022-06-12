import { Component, Input } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-custom-textarea',
    templateUrl: './custom-textarea.component.html',
    styleUrls: ['./custom-textarea.component.scss']
})
export class CustomTextareaComponent extends BaseCustomUiComponent {

    @Input()
    rows = 3;

    constructor() {
        super();
    }

}
