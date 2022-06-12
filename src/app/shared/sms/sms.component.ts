import { Component, Output, Input, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IModeleSMS } from './../../pages/parametres/modele-sms/modele-sms.model';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { DialogHelper } from './../../core/helpers/dialog';
import { BaseIndexTemplateComponent } from '../base-features/base-index.component';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ColumnType } from '../data-table/data-table.component';
import { IEnvoyerSmsModel, ISmsDataTables, ISmsModel } from './sms.model';
import { DetailSmsComponent } from './detail-sms/detail-sms.component';
import { StringHelper } from 'app/core/helpers/string';

@Component({
    selector: 'kt-sms',
    templateUrl: './sms.component.html'
})
export class SmsComponent extends BaseIndexTemplateComponent<IModeleSMS, string>{

    /** add sms event */
    @Output() saveSmsEvent = new EventEmitter<IEnvoyerSmsModel>();

    @Input() set SMS(data: ISmsModel[]) {
        if (data != null) {
            this.sms = data;
            this.smsPagedResult = this.mapISMSIntoPagedResult(data);
            this.smsPagedResult.value = data.map<ISmsDataTables>(e => this.mapISmsIntoISmsDataTables(e));
        }
    }

    /** the title */
    title = 'SMS.TITLE';

    /** list of sms */
    sms: ISmsModel[] = [];

    /** list of sms */
    smsPagedResult: IPagedResult<ISmsDataTables>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.initializeColumns();
    }

    /**
     * initialize columns
     */
    initializeColumns() {
        this.columns = [
            {
                name: 'date',
                nameTranslate: 'LABELS.DATE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'numeroTelephone',
                nameTranslate: 'LABELS.PHONE_NUMBER',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'message',
                nameTranslate: 'LABELS.MESSAGE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'IsBloquer',
                nameTranslate: 'LABELS.IS_BLOQUER',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'NombreReponse',
                nameTranslate: 'LABELS.NUMBER_REPONSE',
                isOrder: true,
                type: ColumnType.any
            },
        ];
    }

    /**
     * mapping sms to sms dataTables
     * @param sms the sms information
     */
    mapISMSIntoPagedResult(smsModel: ISmsModel[]): IPagedResult<ISmsDataTables> {
        const sms: IPagedResult<ISmsDataTables> = {
            currentPage: null,
            pageCount: null,
            pageSize: null,
            rowCount: smsModel.length,
            firstRowOnPage: null,
            lastRowOnPage: null,
            value: null,
            error: null,
            hasError: null,
            hasValue: null,
            messageCode: null,
            message: null,
            status: null,
        };

        return sms;
    }

    /** map sms to sms dataTable model */
    mapISmsIntoISmsDataTables(dossier: ISmsModel): ISmsDataTables {
        const DossierDataTables: ISmsDataTables = {
            id: dossier.id,
            numeroTelephone: dossier.numeroTelephone,
            message: dossier.message,
            isBloquer: dossier.isBloquer === true ? 'Oui' : 'Non',
            date: dossier.date,
            reponses: dossier.reponses.length,
        };
        return DossierDataTables;
    }

    /**
     * send sms
     */
    sendSms() {
        DialogHelper.openDialog(this.matDialog, SendSmsComponent, DialogHelper.SIZE_MEDIUM, null)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.saveSmsEvent.emit(result);
                }
            });
    }

    showSms(id: string) {
        const index = this.sms.findIndex(x => x.id === id);
        const data = { sms: this.sms[index] };
        DialogHelper.openDialog(this.matDialog, DetailSmsComponent, DialogHelper.SIZE_MEDIUM, data);
    }
}
