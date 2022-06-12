import { Component, Input } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { ICommercialPlanning } from 'app/pages/users/user.model';
import { UsersService } from 'app/pages/users/users.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-commercials-planning-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{ label }}</mat-label>
            <mat-select [id]="inputName" (selectionChange)="changeSelect($event.value)" [formControlName]="inputName">
                <mat-option *ngFor="let item of commercialsPlanning" [value]="item?.id">
                    {{ item?.fullName }}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `,
    styles: []
})
export class CommercialsPlanningDropdownComponent extends BaseCustomUiComponent {

    @Input()
    set dateRDV(value: Date) {
        if (value != null) {
            this.getCommercialsPlanning(value);
        } else {
            this.commercialsPlanning = [];
            this.resetFormControl();
            this.emitChangeSelection(null);
        }
    }

    /** list of commercials planning */
    commercialsPlanning: ICommercialPlanning[] = [];

    constructor(
        private userService: UsersService
    ) {
        super();
    }

    /**
     * get list commercial planning
     */
    getCommercialsPlanning(dateRDV: Date) {
        this.userService.GetCommercialsPlanning({
            SearchQuery: '',
            OrderBy: 'firstName',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            dateRDV
        }).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.commercialsPlanning = result.value;
            }
        });
    }

    /**
     * change select of commercials planning
     * @param id the id of commercial
     */
    changeSelect(id: string) {
        const commercialPlanning = this.commercialsPlanning.find(e => e.id === id);
        this.emitChangeSelection(commercialPlanning == null ? null : commercialPlanning);
    }

    /**
     * emit change selection
     * @param commercialPlanning the selected commercial planning
     */
    emitChangeSelection(commercialPlanning: ICommercialPlanning) {
        this.changeEvent.emit(commercialPlanning);
    }

    /**
     * reset form control
     */
    resetFormControl() {
        this.formInstant.get(this.inputName).setValue(null);
    }
}
