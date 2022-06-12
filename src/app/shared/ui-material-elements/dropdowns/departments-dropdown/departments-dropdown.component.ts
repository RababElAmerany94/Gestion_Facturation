import { Component, Input } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { Departement } from 'app/core/models/departement/departement.model';
import { DepartementService } from 'app/core/services/departement/departement.service';

@Component({
    selector: 'kt-departments-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName" (selectionChange)="changeSelect($event.value)">
                <kt-mat-select-search (changeEvent)="searchEvent($event)"></kt-mat-select-search>
                <mat-option *ngFor="let item of departmentsFiltered" [value]="item?.departementNom">
                    {{item?.departementNom}}
                </mat-option>
            </mat-select>
        </mat-form-field>
  `
})
export class DepartmentsDropdownComponent extends BaseCustomUiComponent {

    @Input() set country(value: string) {
        if (value != null || this.countryId !== value) {
            this.countryId = value;
            this.getDepartments();
        }
    }

    /** the list of departments */
    departments: Departement[] = [];

    /** the list of department after filter */
    departmentsFiltered: Departement[] = [];

    /** the country the list department belong to */
    countryId: string;

    constructor(
        private departmentService: DepartementService
    ) {
        super();
        this.getDepartments();
    }

    /**
     * get list departments
     */
    getDepartments() {
        this.departmentService.GetAsPagedResult(
            {
                SearchQuery: '',
                OrderBy: 'departementNom',
                SortDirection: SortDirection.Asc,
                Page: 1,
                PageSize: AppSettings.MAX_GET_DATA,
                countryId: this.countryId
            }
        ).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.departments = result.value;
                this.departmentsFiltered = result.value;
            }
        });
    }
    /**
     * search departement
     * @param text the text to search
     */
    searchEvent(text: string) {
        this.departmentsFiltered = this.departments
            .filter(e => e.departementNom.toLowerCase().includes(text.toLowerCase()));
    }
    /**
     * change select
     */
    changeSelect(departementNom: string) {
        if (departementNom != null) {
            this.changeEvent.emit(this.departments.find(e => e.departementNom === departementNom));
        } else {
            this.changeEvent.emit(null);
        }
    }
}
