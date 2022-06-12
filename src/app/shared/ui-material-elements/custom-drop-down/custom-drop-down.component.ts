import { Component, Input } from '@angular/core';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';

@Component({
    selector: 'kt-custom-drop-down',
    templateUrl: './custom-drop-down.component.html',
    styles: [':host {width: 100%;} .example-full-width { width: 100%;}']
})
export class CustomDropDownComponent<TValue, TText> extends BaseCustomUiComponent {

    @Input() label: string;

    @Input()
    showAny = true;

    @Input() set data(val: IDropDownItem<TValue, TText>[]) {
        if (val !== null) {
            this.dropDownItems = val;
        }
    }

    dropDownItems: IDropDownItem<TValue, TText>[] = [];

    constructor() {
        super();
    }

    onSelectionChangedChanged(event: any) {
        this.changeEvent.emit(event);
    }

}
