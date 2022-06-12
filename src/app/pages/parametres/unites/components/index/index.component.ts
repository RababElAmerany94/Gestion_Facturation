import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';;
import { IPagedResult } from 'app/core/models/general/result-model';
import { IUnite } from 'app/core/models/unite/unite.model';

@Component({
    selector: 'kt-index-unite',
    templateUrl: './index.component.html'
})
export class IndexUniteComponent extends BaseIndexTemplateComponent<IUnite, string> implements OnInit {

    @Input() set data(data: IPagedResult<IUnite>) {
        if (data != null) {
            this.unites = data;
        }
    }

    /** list of unites */
    unites: IPagedResult<IUnite>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog) {
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
                name: 'abbreviation',
                nameTranslate: 'LABELS.ABBREVIATION',
                isOrder: true,
                type: ColumnType.any
            }

        ];
    }

    /**
     * delete button click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('UNITE.DELETE.HEADER'),
            message: this.translate.instant('UNITE.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }
}
