import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'app/core/helpers/dialog';
import { DevisStatus } from '../../../../core/enums/devis-status.enum';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DevisHelper } from '../../devis-helper';
import { IDevisDataTables, IDevis } from '../../devis.model';
import { ICalculation, CalculationToken } from 'app/core/helpers/calculation/icalculation';

@Component({
    selector: 'kt-index',
    templateUrl: './index.component.html',
    styles: []
})
export class IndexComponent extends BaseIndexTemplateComponent<IDevisDataTables, string> implements OnInit {

    @Input()
    set data(data: IPagedResult<IDevis>) {
        if (data != null) {
            this.devis = { ...data as IPagedResult<any> };
            this.devis.value = data.value.map<IDevisDataTables>(e => this.mapIDevisIntoIDevisDataTables(e));
        }
    }

    /** list of devis */
    devis: IPagedResult<IDevisDataTables>;

    status = DevisStatus;

    constructor(
        @Inject(CalculationToken) private calculation: ICalculation,
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.Devis);
    }

    ngOnInit() {
        this.initializeColumns();
    }

    /**
     * initialize columns
     */
    initializeColumns() {
        this.columns = [
            {
                name: 'reference',
                nameTranslate: 'LABELS.REFERENCE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'dateVisit',
                nameTranslate: 'LABELS.DATE_VISITE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'clientId',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'type',
                nameTranslate: 'LABELS.TYPE',
                isOrder: false,
                type: ColumnType.any
            },
            {
                name: 'status',
                nameTranslate: 'LABELS.STATUS',
                isOrder: true,
                type: ColumnType.Status
            }
        ];
    }

    /** map devis to devis dataTable model */
    mapIDevisIntoIDevisDataTables(devis: IDevis): IDevisDataTables {
        const devisDataTables: IDevisDataTables = {
            id: devis.id,
            reference: devis.reference,
            dateVisit: devis.dateVisit,
            clientId: devis.client.fullName,
            status: devis.status,
            type: this.translate.instant(`DEVIS_TYPE.${devis.type}`),
            nouveauAvancementPercent: DevisHelper.percentFacturationDevis(this.calculation, devis),
            canModify: DevisHelper.canEdit(devis.status)
        };
        return devisDataTables;
    }

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('DELETE.HEADER_TEXT'),
            message: this.translate.instant('DELETE.QUESTION'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });

    }

    //#endregion

}
