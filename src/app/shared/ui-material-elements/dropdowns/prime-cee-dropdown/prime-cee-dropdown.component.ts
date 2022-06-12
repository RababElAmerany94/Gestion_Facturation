import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { ClientType } from 'app/core/enums/client-type.enum';
import { SortDirection } from 'app/core/enums/sort-direction';
import { IClient } from 'app/pages/clients/client.model';
import { ClientsService } from 'app/pages/clients/clients.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-prime-cee-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName">
                <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
                <mat-option *ngFor="let item of clientObliges" [value]="item?.id">
                    {{item?.fullName}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `
})
export class PrimeCEEDropdownComponent extends BaseCustomUiComponent implements OnInit {

    /** the list of clientObliges */
    clientObliges: IClient[] = [];

    constructor(private clientsService: ClientsService) {
        super();
    }

    ngOnInit() {
        this.getClientObligees();
    }

    /**
     * get list of client obliges
     */
    getClientObligees() {
        this.clientsService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'Id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            type: ClientType.Obliges
        }).subscribe(result => {
            this.clientObliges = result.value;
        });
    }

}
