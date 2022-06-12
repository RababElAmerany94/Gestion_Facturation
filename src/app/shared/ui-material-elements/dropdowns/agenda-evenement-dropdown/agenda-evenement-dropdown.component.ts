import { Component, Input, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { AgendaType } from 'app/core/enums/agenda-type.enum';
import { SortDirection } from 'app/core/enums/sort-direction';
import { IAgendaConfig } from 'app/pages/parametres/agenda-config/agenda-config.model';
import { AgendaEvenementService } from 'app/pages/parametres/agenda-config/agenda.evenement.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-agenda-evenement-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName">
                <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
                <mat-option *ngFor="let item of agendaEvenement" [value]="item?.id">
                    {{item?.name}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `
})
export class AgendaEvenementDropdownComponent extends BaseCustomUiComponent implements OnInit {

    @Input()
    types: AgendaType;

    /**
     * the list of types agenda évènement
     */
    agendaEvenement: IAgendaConfig[] = [];

    constructor(
        private agendaEvenementService: AgendaEvenementService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getAgendaEvenement();
    }

    /**
     * get list types agenda d'évènement
     */
    getAgendaEvenement() {
        this.agendaEvenementService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            type: this.types
        }).subscribe(result => {
            this.agendaEvenement = result.value;
        });
    }

}
