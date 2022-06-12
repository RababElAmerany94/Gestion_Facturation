import { Component, OnInit, Input } from '@angular/core';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ISpecialArticle } from '../../special-artical.model';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';

@Component({
    selector: 'kt-special-article-index',
    templateUrl: './special-article-index.component.html'
})
export class SpecialArticleIndexComponent extends BaseIndexTemplateComponent<ISpecialArticle, string> implements OnInit {

    @Input() set data(data: IPagedResult<ISpecialArticle>) {
        if (data != null) {
            this.specialArticles = { ...data as IPagedResult<any> };
            this.specialArticles.value = data.value
                .map<ISpecialArticle>(e => this.mapISpecialArticleIntoISpecialArticleDataTable(e));
        }
    }

    specialArticles: IPagedResult<ISpecialArticle>;

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
                name: 'designation',
                nameTranslate: 'LABELS.DESIGNATION',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'description',
                nameTranslate: 'LABELS.DESCRIPTION',
                isOrder: true,
                type: ColumnType.Html
            },
        ];
    }

    /**
     * mapping specialArticle to specialArticle dataTables
     * @param specialArticle the specialArticle information
     */
    mapISpecialArticleIntoISpecialArticleDataTable(specialArticle: ISpecialArticle): ISpecialArticle {
        const specialArticleDataTable: ISpecialArticle = {
            id: specialArticle.id,
            designation: specialArticle.designation,
            description: specialArticle.description,
        };

        return specialArticleDataTable;
    }

    // #region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('ARTICLES_SPECIAUX.DELETE.HEADER'),
            message: this.translate.instant('ARTICLES_SPECIAUX.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion
}
