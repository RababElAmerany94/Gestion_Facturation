import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { IFournisseur } from 'app/pages/suppliers/suppliers';
import { SuppliersService } from 'app/pages/suppliers/suppliers.service';

@Component({
    selector: 'kt-fournisseur-dropdown',
    template: `
      <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
          <mat-label>{{label}}</mat-label>
		  <mat-select [id]="inputName" [formControlName]="inputName"
		   (selectionChange)="changeSelect($event.value)">
              <mat-option *ngFor="let item of fournisseurs" [value]="item?.id">
                  {{item?.raisonSociale}}
              </mat-option>
          </mat-select>
      </mat-form-field>
    `
})
export class FournisseurDropdownComponent extends BaseCustomUiComponent implements OnInit {

    /**
     * the list of fournisseurs
     */
    fournisseurs: IFournisseur[] = [];

    constructor(
        private fournisseurService: SuppliersService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getFournisseurs();
    }

    /**
     * get list fournisseurs
     */
    getFournisseurs() {
        this.fournisseurService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'raisonSociale',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.fournisseurs = result.value;
        });
    }
    /**
     * change select
     */
    changeSelect(fournisseurId: string) {
        if (fournisseurId != null) {
            this.changeEvent.emit(this.fournisseurs.find(e => e.id === fournisseurId));
        } else {
            this.changeEvent.emit(null);
        }
    }
}
