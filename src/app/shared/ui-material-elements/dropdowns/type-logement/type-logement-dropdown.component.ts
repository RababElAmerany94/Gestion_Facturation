import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { ITypeLogement } from 'app/pages/parametres/type-Logement/type-Logement.model';
import { TypeLogementService } from '../../../../pages/parametres/type-logement/type-logement.service';

@Component({
    selector: 'kt-type-logement-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName">
                <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
                <mat-option *ngFor="let item of typesLogement" [value]="item?.id">
                    {{item?.name}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `
})
export class TypeLogementDropdownComponent extends BaseCustomUiComponent implements OnInit {

    /**
     * the list of types Logement
     */
    typesLogement: ITypeLogement[] = [];

    constructor(
        private typeLogementService: TypeLogementService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTypesLogement();
    }

    /**
     * get list types Logement
     */
    getTypesLogement() {
        this.typeLogementService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA
        }).subscribe(result => {
            this.typesLogement = result.value;
        });
    }
}
