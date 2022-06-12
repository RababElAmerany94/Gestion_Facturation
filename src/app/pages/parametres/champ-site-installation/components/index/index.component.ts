import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { IChampSiteInstallation } from '../../champ-site-installation.model';

@Component({
    selector: 'kt-index-champs',
    templateUrl: './index.component.html'
})
export class IndexChampsComponent extends BaseIndexTemplateComponent<IChampSiteInstallation, string> implements OnInit {

    @Input()
    set data(data: IPagedResult<IChampSiteInstallation>) {
        if (data != null) {
            this.champs = data;
        }
    }

    champs: IPagedResult<IChampSiteInstallation>;

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
        ];
    }

    /**
     * delete button click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('CHAMPS_SITE_INTERVENTION.DELETE.HEADER'),
            message: this.translate.instant('CHAMPS_SITE_INTERVENTION.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }
}
