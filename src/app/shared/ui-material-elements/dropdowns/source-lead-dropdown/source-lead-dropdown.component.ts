import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { ISourceDuLead } from 'app/pages/parametres/source-du-lead/source-du-lead';
import { SourceDuLeadService } from 'app/pages/parametres/source-du-lead/source-du-lead.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-source-lead-dropdown',
    template: `
  <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
      <mat-label>{{label}}</mat-label>
      <mat-select [id]="inputName" [formControlName]="inputName">
            <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
            <mat-option *ngFor="let item of sourceLead" [value]="item?.id">
                {{item?.name}}
            </mat-option>
      </mat-select>
  </mat-form-field>
`
})
export class SourceLeadDropdownComponent extends BaseCustomUiComponent implements OnInit {

    sourceLead: ISourceDuLead[] = [];
    constructor(private sourceDuLeadService: SourceDuLeadService
    ) {
        super();
    }
    ngOnInit() {
        this.getSourceLead();
    }
    /**
     * get list source lead
     */
    getSourceLead() {
        this.sourceDuLeadService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.sourceLead = result.value;
        });
    }
}
