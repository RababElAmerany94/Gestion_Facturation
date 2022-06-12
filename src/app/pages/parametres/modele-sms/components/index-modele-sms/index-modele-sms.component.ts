import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input } from '@angular/core';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IModeleSMS } from '../../modele-sms.model';
import { ColumnType } from './../../../../../shared/data-table/data-table.component';
import { DialogHelper } from './../../../../../core/helpers/dialog';
import { BaseIndexTemplateComponent } from './../../../../../shared/base-features/base-index.component';

@Component({
    selector: 'kt-index-modele-sms',
    templateUrl: './index-modele-sms.component.html'
})
export class IndexModeleSmsComponent extends BaseIndexTemplateComponent<IModeleSMS, string> implements OnInit {

    @Input()
    set data(data: IPagedResult<IModeleSMS>) {
        if (data != null) {
            this.ModeleSMS = { ...data as IPagedResult<any> };
            this.ModeleSMS.value = data.value
                .map<IModeleSMS>(e => this.mapIModeleSMSIntoIModeleSMSDataTable(e));
        }
    }

    ModeleSMS: IPagedResult<IModeleSMS>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.ModeleSms);
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
                name: 'text',
                nameTranslate: 'LABELS.TEXT',
                isOrder: true,
                type: ColumnType.longText
            },
        ];
    }

    /**
     * mapping ModeleSMS to ModeleSMS dataTables
     * @param ModeleSMS the ModeleSMS information
     */
    mapIModeleSMSIntoIModeleSMSDataTable(ModeleSMS: IModeleSMS): IModeleSMS {
        const ModeleSMSDataTables: IModeleSMS = {
            id: ModeleSMS.id,
            name: ModeleSMS.name,
            text: ModeleSMS.text,
        };

        return ModeleSMSDataTables;
    }

    //#endregion

    //#region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('MODELE_SMS.DELETE.HEADER'),
            message: this.translate.instant('MODELE_SMS.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion

}
