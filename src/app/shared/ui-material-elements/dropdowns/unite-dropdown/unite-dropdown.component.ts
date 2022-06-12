import { OnInit, Component } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { IUnite } from 'app/core/models/unite/unite.model';
import { UniteService } from 'app/core/services/unite/unite.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-unite-dropdown',
    template: `
      <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
          <mat-label>{{label}}</mat-label>
          <mat-select [id]="inputName" [formControlName]="inputName">
              <mat-option *ngFor="let item of unites" [value]="item?.name">
                  {{item?.name}}
              </mat-option>
          </mat-select>
      </mat-form-field>
    `
})
export class UniteDropdownComponent extends BaseCustomUiComponent implements OnInit {

    /**
     * the list of categories
     */
    unites: IUnite[] = [];

    constructor(
        private uniteService: UniteService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getUnites();
    }

    /**
     * get list categories
     */
    getUnites() {
        this.uniteService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'name',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.unites = result.value;
        });
    }
}
