import { Component, OnInit, Input } from '@angular/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ICategoryDocumentDataTables, ICategoryDocument } from '../../category-document.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ColumnType } from 'app/shared/data-table/data-table.component';

@Component({
    selector: 'kt-index-documents-category',
    templateUrl: './index-documents-category.component.html'
})
export class IndexDocumentsCategoryComponent extends BaseIndexTemplateComponent<ICategoryDocumentDataTables, string> implements OnInit {

    @Input() set data(data: IPagedResult<ICategoryDocument>) {
        if (data != null) {
            this.categoriesDocuments = { ...data as IPagedResult<any> };
            this.categoriesDocuments.value = data.value
                .map<ICategoryDocumentDataTables>(e => this.mapICategoryDocumentsIntoICategoryDocumentsDataTable(e));
        }
    }

    categoriesDocuments: IPagedResult<ICategoryDocumentDataTables>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.Parameters);
    }

    ngOnInit() {
        this.setColumns();
    }

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
                name: 'color',
                nameTranslate: 'LABELS.COLOR',
                isOrder: true,
                type: ColumnType.colorNews
            },
        ];
    }

    /**
     * mapping categoryDocuments to categoryDocuments dataTables
     * @param categoryDocuments the categoryDocuments information
     */
    mapICategoryDocumentsIntoICategoryDocumentsDataTable(categoryDocuments: ICategoryDocument): ICategoryDocumentDataTables {
        const categoryDocumentsDataTable: ICategoryDocumentDataTables = {
            id: categoryDocuments.id,
            name: categoryDocuments.name,
            color: categoryDocuments.color
        };

        return categoryDocumentsDataTable;
    }

    // #region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('CATEGORY_DOCUMENTS.DELETE.HEADER'),
            message: this.translate.instant('CATEGORY_DOCUMENTS.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion
}
