import { Component } from '@angular/core';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { DelayValidateDocument } from 'app/core/enums/delay-validate-document.enum';

@Component({
    selector: 'kt-delay-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{ label }}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName">
                <mat-option *ngFor="let item of validateDelay" [value]="item?.value">
                    {{ item?.text | translate }}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `,
})
export class DelayDropDownComponent extends BaseCustomUiComponent {

    /** list of delay de validity */
    validateDelay: IDropDownItem<string, string>[];

    constructor() {
        super();
        this.getValidateDelay();
    }

    /**
     * set validate delay
     */
    getValidateDelay() {
        const items = ConversionHelper.convertEnumToListKeysValues<string, string>(DelayValidateDocument, 'number');
        this.validateDelay = items.map(item => ({ value: item.value, text: `VALIDATE_DELAY.${item.text}` }));
    }

}
