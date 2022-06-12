import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { ISourceDuLead } from '../../source-du-lead';

@Component({
    selector: 'kt-index-source-du-lead',
    templateUrl: './index-source-du-lead.component.html'
})
export class IndexSourceDuLeadComponent extends BaseIndexTemplateComponent<ISourceDuLead, string> implements OnInit {

    @Input()
    set data(data: IPagedResult<ISourceDuLead>) {
        if (data != null) {
            this.sourceLeads = { ...data as IPagedResult<any> };
            this.sourceLeads.value = data.value;
        }
    }

    sourceLeads: IPagedResult<ISourceDuLead>;

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
            }
        ];
    }

    //#endregion

    //#region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('SOURCE_DU_LEAD.DELETE.HEADER'),
            message: this.translate.instant('SOURCE_DU_LEAD.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion
}
