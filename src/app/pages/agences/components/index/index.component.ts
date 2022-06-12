import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { JsonHelper } from 'app/core/helpers/json';
import { Address } from 'app/core/models/general/address.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IAgence, IAgenceDataTables, IChangeActivateAgenceModel } from '../../agence.model';
import { UserProfile } from 'app/core/enums/user-role.enums';

@Component({
    selector: 'kt-agence-index',
    templateUrl: './index.component.html'
})
export class IndexComponent extends BaseIndexTemplateComponent<IAgenceDataTables, string> implements OnInit {

    /**
     * change activate for agence
     */
    @Output() changeVisibilityEvent = new EventEmitter<IChangeActivateAgenceModel>();

    @Input() set data(data: IPagedResult<IAgence>) {
        if (data != null) {
            this.agences = { ...data as IPagedResult<any> };
            this.agences.value = data.value.map<IAgenceDataTables>
                (e => this.mapIAgenceIntoIAgenceDataTable(e));
        }
    }

    userProfile: typeof UserProfile = UserProfile;

    /** the list of agence */
    agences: IPagedResult<IAgenceDataTables>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.Agences);
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
                name: 'reference',
                nameTranslate: 'LABELS.REFERENCE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'raisonSociale',
                nameTranslate: 'LABELS.RAISON_SOCIALE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'email',
                nameTranslate: 'CONTACTS.EMAIL',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'phoneNumber',
                nameTranslate: 'LABELS.PHONE_NUMBER',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'city',
                nameTranslate: 'ADDRESS.VILLE',
                isOrder: false,
                type: ColumnType.any
            },
            {
                name: 'departement',
                nameTranslate: 'ADDRESS.DEPARTEMENT',
                isOrder: false,
                type: ColumnType.any
            },
            {
                name: 'dateDebutActivite',
                nameTranslate: 'LABELS.DATE_START_ACTIVITY',
                isOrder: true,
                type: ColumnType.Date
            },
        ];
    }

    /**
     * mapping agence to agence dataTables
     * @param agence the agence information
     */
    mapIAgenceIntoIAgenceDataTable(agence: IAgence): IAgenceDataTables {
        const addressFacturation = agence.adressesFacturation[0];
        const agenceDataTables: IAgenceDataTables = {
            id: agence.id,
            reference: agence.reference,
            raisonSociale: agence.raisonSociale,
            email: agence.email,
            phoneNumber: agence.phoneNumber,
            isActive: agence.isActive,
            city: addressFacturation != null ? addressFacturation.ville : '',
            departement: addressFacturation != null ? addressFacturation.departement : '',
            dateDebutActivite: agence.dateDebutActivite
        };

        return agenceDataTables;
    }

    // #region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('LIST.DELETE.HEADER'),
            message: this.translate.instant('LIST.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion

    // #region click events

    /**
     * active agence
     */
    activeClick(id: string) {
        this.changeVisibilityEvent.emit({ id, isActive: true });
    }

    /**
     * deactivate agence
     */
    deactivateClick(id: string) {
        this.changeVisibilityEvent.emit({ id, isActive: false });
    }

    //#endregion
}
