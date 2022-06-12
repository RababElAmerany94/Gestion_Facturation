import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { ITypeChauffage } from 'app/pages/parametres/type-chauffage/type-chauffage.model';
import { TypeChauffageService } from 'app/pages/parametres/type-chauffage/type-chauffage.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-type-chauffage',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName">
                <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
                <mat-option *ngFor="let item of typesChauffage" [value]="item?.id">
                    {{item?.name}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `
})
export class TypeChauffageComponent extends BaseCustomUiComponent implements OnInit {

    /**
     * the list of types Chauffage
     */
    typesChauffage: ITypeChauffage[] = [];

    constructor(
        private typeChauffageService: TypeChauffageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTypesChauffage();
    }

    /**
     * get list types Chauffage
     */
    getTypesChauffage() {
        this.typeChauffageService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA
        }).subscribe(result => {
            this.typesChauffage = result.value;
        });
    }

}
