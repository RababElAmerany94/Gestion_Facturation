import { Component, OnInit, Input } from '@angular/core';
import { BaseCustomUiComponent } from '../ui-material-elements/base-custom-ui/base-custom-ui.component';
import { StringHelper } from 'app/core/helpers/string';

@Component({
    selector: 'kt-color-picker',
    templateUrl: './color-picker.component.html'
})
export class ColorPickerComponent extends BaseCustomUiComponent implements OnInit {

    @Input() isShowmode: boolean;

    // color = this.inputName || '039BE5';
    color: string;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.color = this.formInstant.get(this.inputName).value;
    }

    /**
     * change color
     */
    changeColor(color: string) {
        if (!StringHelper.isEmptyOrNull(color)) {
            this.color = color;
            this.formInstant.get(this.inputName).setValue(color);
        }
    }

}
