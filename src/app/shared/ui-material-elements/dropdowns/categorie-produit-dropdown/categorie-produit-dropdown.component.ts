import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { CategoryProductService } from 'app/pages/parametres/product-category/category-product.service';
import { ICategoryProduct } from '../../../../pages/parametres/product-category/category-product.model';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-categorie-produit-dropdown',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="inputName" [formControlName]="inputName">
                <mat-option *ngFor="let item of categories" [value]="item?.id">
                    {{item?.name}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `
})
export class CategorieProduitDropdownComponent extends BaseCustomUiComponent implements OnInit {

    /**
     * the list of categories
     */
    categories: ICategoryProduct[] = [];

    constructor(
        private categoryProductService: CategoryProductService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getCategories();
    }

    /**
     * get list categories
     */
    getCategories() {
        this.categoryProductService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'name',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA
        }).subscribe(result => {
            this.categories = result.value;
        });
    }
}
