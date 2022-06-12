import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { Country } from 'app/core/models/country/country.model';
import { CountryService } from 'app/core/services/country/country.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-countries-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName">
                <mat-option *ngFor="let item of countries" [value]="item?.nomFrFr">
                    {{item?.nomFrFr}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `
})
export class CountriesDropdownComponent extends BaseCustomUiComponent implements OnInit {

    countries: Country[] = [];

    constructor(
        private countryService: CountryService
    ) { super(); }

    ngOnInit() {
        this.getCountries();
    }

    getCountries() {
        this.countryService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'nomFrFr',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.countries = result.value;
        });
    }
}
