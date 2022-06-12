import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BonCommandeStatus } from 'app/core/enums/bon-commande-status.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { RaisonAnnulationComponent } from 'app/shared/raison-annulation/raison-annulation.component';
import { BonCommandeHelper } from '../../bon-commande-helper';
import { IBonCommande, IBonCommandeDataTables } from '../../bon-commande.model';

@Component({
    selector: 'kt-index-bon-commande',
    templateUrl: './index.component.html'
})
export class IndexComponent extends BaseIndexTemplateComponent<IBonCommandeDataTables, string> implements OnInit {

    @Output()
    markBonCommandeAnnulerEvent = new EventEmitter<IBonCommande>();

    /** transfer bon de commande to devis */
    @Output()
    transferToDevisEvent = new EventEmitter<IBonCommande>();

    @Input()
    set data(data: IPagedResult<IBonCommande>) {
        if (data != null) {
            this.bonCommande = { ...data as IPagedResult<any> };
            this.bonCommandes = data.value;
            this.bonCommande.value = data.value.map<IBonCommandeDataTables>(e => this.mapIBonCommandeIntoIBonCommandeDataTables(e));
        }
    }

    /** list of bon Commande */
    bonCommande: IPagedResult<IBonCommandeDataTables>;
    bonCommandes: IBonCommande[];

    status = BonCommandeStatus;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.BonCommande);
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

    /** map bonCommande to bonCommande dataTable model */
    mapIBonCommandeIntoIBonCommandeDataTables(bonCommande: IBonCommande): IBonCommandeDataTables {
        const bonCommandeDataTables: IBonCommandeDataTables = {
            id: bonCommande.id,
            reference: bonCommande.reference,
            dateVisit: bonCommande.dateVisit,
            clientId: bonCommande.client.fullName,
            status: bonCommande.status,
            type: this.translate.instant(`DEVIS_TYPE.${bonCommande.type}`),
            canModify: BonCommandeHelper.canEditOrDelete(bonCommande.status)
        };
        return bonCommandeDataTables;
    }

    //#endregion

    //#region dialog

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('LIST.DELETE.HEADER'),
            message: this.translate.instant('LIST.DELETE.QUESTION'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });

    }

    /**
     * annuler bon commande
     */
    annuleeBonCommande(id: string) {
        const index = this.bonCommandes.findIndex(x => x.id === id);
        DialogHelper
            .openDialog(this.matDialog, RaisonAnnulationComponent, DialogHelper.SIZE_SMALL, null)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.bonCommandes[index].raisonAnnulation = result.raisonAnnulation;
                    this.markBonCommandeAnnulerEvent.emit(this.bonCommandes[index]);
                }
            });
    }

    /** transfer bonCommande to facture */
    transferBonCommandeToDevis(id: string) {
        this.transferToDevisEvent.emit(this.bonCommandes.filter(x => x.id === id)[0]);
    }

    //#endregion

    //#region

    /**
     * can bon de commande be annulee
     */
    canCancel = (status) => !BonCommandeHelper.canAnnuler(status);

    /**
     * can bon de commande be transfered
     */
    canTransfer = (status) => BonCommandeHelper.canTransferToDevis(status);

    //#endregion
}
