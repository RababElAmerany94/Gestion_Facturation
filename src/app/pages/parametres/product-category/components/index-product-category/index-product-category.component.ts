import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ICategoryProduct, ICategoryProductDataTables } from '../../category-product.model';

@Component({
    selector: 'kt-index-product-category',
    templateUrl: './index-product-category.component.html'
})
export class IndexProductCategoryComponent extends BaseIndexTemplateComponent<ICategoryProductDataTables, string> implements OnInit {

    @Input()
    set data(data: IPagedResult<ICategoryProduct>) {
        if (data != null) {
            this.categoryProducts = { ...data as IPagedResult<any> };
            this.categoryProducts.value = data.value
                .map<ICategoryProductDataTables>(e => this.mapICategoryProductIntoICategoryProductDataTable(e));
        }
    }

    categoryProducts: IPagedResult<ICategoryProductDataTables>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.CategoryProduct);
    }

    ngOnInit() {
        this.setColumns();
    }

    //#region mapping

    /**
     * set columns
     */
    setColumns() {
        this.columns = [
            {
                name: 'name',
                nameTranslate: 'LABELS.FIRSTNAME',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'accountingCode',
                nameTranslate: 'LABELS.ACCOUNTING_CODE',
                isOrder: true,
                type: ColumnType.any
            }
        ];
    }

    /**
     * mapping categoryProduct to categoryProduct dataTables
     * @param categoryProduct the categoryProduct information
     */
    mapICategoryProductIntoICategoryProductDataTable(categoryProduct: ICategoryProduct): ICategoryProductDataTables {
        const categoryProductDataTables: ICategoryProductDataTables = {
            id: categoryProduct.id,
            name: categoryProduct.name,
            accountingCode: categoryProduct.accountingCode
        };

        return categoryProductDataTables;
    }

    //#endregion

    //#region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('CATEGORY_PRODUCT.DELETE.HEADER'),
            message: this.translate.instant('CATEGORY_PRODUCT.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion

}
