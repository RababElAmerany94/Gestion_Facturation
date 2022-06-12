import { Component, OnInit } from '@angular/core';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { ICategoryDocument } from 'app/pages/parametres/document-category/category-document.model';
import { CategoryDocumentService } from 'app/pages/parametres/document-category/category-document.service';

@Component({
    selector: 'kt-categorie-document',
    template: `
        <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
            <mat-label>{{label}}</mat-label>
            <mat-select
                [id]="inputName"
                [formControlName]="inputName"
                (selectionChange)="changeSelect($event.value)">
                <mat-option *ngFor="let item of categories" [value]="item?.id">
                    {{item?.name}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `
})
export class CategorieDocumentComponent extends BaseCustomUiComponent implements OnInit {

    /**
     * the list of categories
     */
    categories: ICategoryDocument[] = [];

    constructor(
        private categoryDocumentService: CategoryDocumentService
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
        this.categoryDocumentService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'Id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.categories = result.value;
        });
    }

    /**
     * change select
     */
    changeSelect(id: string) {
        this.changeEvent.emit(this.categories.find(e => e.id === id));
    }

}
