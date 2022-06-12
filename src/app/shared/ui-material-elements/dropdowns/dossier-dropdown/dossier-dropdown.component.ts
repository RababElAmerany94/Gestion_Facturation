import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { DossierService } from './../../../../pages/dossier/dossier.service';
import { IDossier } from './../../../../pages/dossier/dossier.model';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { DialogSelectDossierComponent } from './dialog-select-dossier/dialog-select-dossier.component';

@Component({
    selector: 'kt-dossier-dropdown',
    styleUrls: ['./../client-dropdown/client-dropdown.component.scss'],
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant">
            <mat-label>{{label}}</mat-label>
            <input
                matInput
                disabled
                type="string"
                [value]="selectedDossier?.reference"
                placeholder="{{ placeholder }}"/>
            <input type="hidden" [id]="'inputName'" [formControlName]="inputName"/>

            <span matSuffix>
                <span
                    class="material-icons pointer-cursor"
                    (click)="selectDossierDialog()"
                    [matTooltip]="'LABELS.LIST' | translate">
                    list
                </span>
            </span>

            <mat-hint class="text-danger">
                <kt-custom-error-display [control]="control"></kt-custom-error-display>
            </mat-hint>
        </mat-form-field>
    `
})
export class DossierDropdownComponent extends BaseCustomUiComponent implements OnInit {

    @Input() clientId: string;

    @Input()
    set dossier(value: boolean) {
        if (value === true) {
            this.selectedDossier = null;
            this.formInstant.get(this.inputName).setValue('');
        }
    }

    /**
     * the list of dossier
     */
    dossiers: IDossier[] = [];

    selectedDossier: IDossier;

    constructor(
        private dialog: MatDialog,
        private dossierService: DossierService
    ) {
        super();
    }


    ngOnInit(): void {
        this.getDossiers();
    }

    selectDossierDialog(): void {
        const data = {
            clientId: this.clientId,
        }
        DialogHelper
            .openDialog(this.dialog, DialogSelectDossierComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe((result) => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.selectedDossier = result as IDossier;
                    this.changeSelect();
                    this.setValueInForm();
                }
            });
    }

    /**
     * get list dossier
     */
    getDossiers() {
        this.dossierService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA
        }).subscribe(result => {
            this.dossiers = result.value;
        });
    }

    private setValueInForm() {
        this.formInstant.get(this.inputName).setValue(this.selectedDossier.id);
    }

    /**
     * change select
     */
    changeSelect() {
        this.changeEvent.emit(this.selectedDossier);
    }

}
