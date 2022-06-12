import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IFournisseur, IFournisseurDataTables } from '../../suppliers';

@Component({
    selector: 'kt-supplier-index',
    templateUrl: './index.component.html',
})
export class IndexComponent extends BaseIndexTemplateComponent<IFournisseurDataTables, string> implements OnInit {


    @Input() set Suppliers(data: IPagedResult<IFournisseur>) {
        if (data != null) {
            this.suppliers = { ...data as IPagedResult<any> };
            this.suppliers.value = data.value.map<IFournisseurDataTables>(e => this.mapIFournisseurToIFournisseurDataTable(e));
        }
    }

    suppliers: IPagedResult<IFournisseurDataTables>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.Fournisseurs);
    }

    ngOnInit() {
        this.columns = [
            {
                name: 'reference',
                nameTranslate: 'LABELS.REFERENCE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'raisonSociale',
                nameTranslate: 'LABELS.RAISONSOCIAL',
                isOrder: true,
                type: ColumnType.any
            }
        ];
    }

    mapIFournisseurToIFournisseurDataTable(fournisseur: IFournisseur) {
        const FournisseurDataTable: IFournisseurDataTables = {
            id: fournisseur.id,
            raisonSociale: fournisseur.raisonSociale,
            reference: fournisseur.reference
        };
        return FournisseurDataTable;
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
}
