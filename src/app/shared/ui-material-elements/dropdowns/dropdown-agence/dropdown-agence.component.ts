import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { UserProfile } from '../../../../core/enums/user-role.enums';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { IAgence } from 'app/pages/agences/agence.model';
import { AgenceService } from 'app/pages/agences/agence.service';

@Component({
    selector: 'kt-dropdown-agence',
    template: `
    <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
        <mat-label>{{label}}</mat-label>
        <mat-select [id]="inputName" (selectionChange)="changeSelect($event.value)" [formControlName]="inputName">
            <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
            <mat-option *ngFor="let item of agences " [value]="item?.id">
                {{item?.raisonSociale }}
            </mat-option>
        </mat-select>
    </mat-form-field>
  `
})
export class DropdownAgenceComponent extends BaseCustomUiComponent implements OnInit {

    /** list of agence */
    agences: IAgence[] = [];

    constructor(
        private agenceService: AgenceService
    ) { super(); }

    ngOnInit() {
        this.getAgence();
    }

    /**
     * change select agence
     * @param agenceId the agence id
     */
    changeSelect(agenceId: number) {
        if (agenceId != null) {
            this.changeEvent.emit(agenceId);
        } else {
            this.changeEvent.emit();
        }
    }

    /**
     * get list agence
     */
    getAgence() {
        this.agenceService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'raisonSociale',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            rolesId: [UserProfile.Controleur]
        }).subscribe(result => {
            this.agences = result.value;
        });
    }

}
