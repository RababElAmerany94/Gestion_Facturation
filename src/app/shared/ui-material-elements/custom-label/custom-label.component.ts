import { Component } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-custom-label',
    templateUrl: './custom-label.component.html',
    styleUrls: ['./custom-label.component.scss']
})
export class CustomLabelComponent extends BaseCustomUiComponent {

    constructor() { super(); }

}
