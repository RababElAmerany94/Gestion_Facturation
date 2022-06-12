import { Component, OnInit } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-custom-time-picker',
    templateUrl: './custom-time-picker.component.html'
})
export class CustomTimePickerComponent extends BaseCustomUiComponent implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {

    }

}
