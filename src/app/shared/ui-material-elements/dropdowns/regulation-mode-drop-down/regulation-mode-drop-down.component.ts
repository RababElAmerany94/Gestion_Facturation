import { Component, OnInit, Input } from '@angular/core';
import { IRegulationMode } from 'app/core/models/regulation-mode/regulation-mode.model';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { RegulationModeService } from 'app/core/services/regulation-mode/regulation-mode.service';
import { SortDirection } from 'app/core/enums/sort-direction';
import { AppSettings } from 'app/app-settings/app-settings';

@Component({
    selector: 'kt-regulation-mode-drop-down',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName" (selectionChange)="changeSelect($event.value)">
                <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
                <mat-option *ngFor="let item of regulationModes" [value]="item?.id">
                    {{item?.name}}
                </mat-option>
            </mat-select>
        </mat-form-field>
`
})
export class RegulationModeDropDownComponent extends BaseCustomUiComponent implements OnInit {

    @Input()
    set exclude(val: string[]) {
        if (val) {
            this.excludeRegulationMode = val;
            this.removeExclude();
        }
    }

    /** the list of regulation modes  */
    regulationModes: IRegulationMode[] = [];

    /** the list ids of exclude regulation mode */
    excludeRegulationMode: string[] = [];

    constructor(
        private regulationModeService: RegulationModeService
    ) {
        super();
    }

    ngOnInit() {
        this.getModeRegulations();
    }

    /**
     * change select mode reglement
     */
    changeSelect(modeRegulationId: string) {
        if (modeRegulationId != null) {
            this.changeEvent.emit(this.regulationModes.find(e => e.id === modeRegulationId));
        } else {
            this.changeEvent.emit(null);
        }
    }

    /**
     * get list mode de regulation
     */
    getModeRegulations() {
        this.regulationModeService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'Classement',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.regulationModes = result.value;
            this.removeExclude();
        });
    }

    /**
     * remove exclude regulation mode from the list
     */
    removeExclude() {
        this.regulationModes = this.regulationModes
            .filter(e => this.excludeRegulationMode.filter(c => c === e.id).length === 0);
    }
}
