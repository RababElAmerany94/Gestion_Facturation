import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DateHelper } from 'app/core/helpers/date';
import { StringHelper } from 'app/core/helpers/string';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { IPaiementDataTables, IPaiement } from '../../paiement.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IPaimentFilterOption, IFilterOption } from 'app/core/models/general/filter-option.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';

@Component({
    selector: 'kt-paiement-index',
    templateUrl: './index.component.html'
})
export class IndexComponent extends BaseIndexTemplateComponent<IPaiementDataTables, string>  {

    @Output() transferCompteEvent = new EventEmitter();

    @Output() paiementGroupEvent = new EventEmitter();

    @Input() currentBalance: number;

    @Input() set data(values: IPagedResult<IPaiement>) {
        if (values != null) {
            this.paiements = { ...values as IPagedResult<any> };
            this.paiements.value = values.value.map<IPaiementDataTables>(e => this.mapIPaiementIntoPaiementDataTable(e));
        }
    }

    form: FormGroup;

    filterOptions: IPaimentFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''

    };

    /** the list of paiement */
    paiements: IPagedResult<IPaiementDataTables>;

    constructor(
        private matDialog: MatDialog,
        private translate: TranslateService,
        private fb: FormBuilder
    ) {
        super();
        this.setColumns();
        this.initializeForm();
        this.setModule(this.modules.Paiement);
    }

    /**
     * search form initialization
     */
    initializeForm() {
        this.form = this.fb.group({
            dateFrom: [],
            dateTo: [],
            bankAccountId: [null]
        });
    }

    /**
     * change dataTables event
     */
    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOptions = { ...this.filterOptions, ...dataTableOutput };
        this.filters.emit(this.filterOptions);
    }

    searchEvent() {
        const values = this.form.value;
        this.filterOptions = {
            ...this.filterOptions,
            bankAccountId: !StringHelper.isEmptyOrNull(values.bankAccountId) ? this.form.get('bankAccountId').value : null,
            dateFrom: !StringHelper.isEmptyOrNull(values.dateFrom) ? DateHelper.formatDate(values.dateFrom) as any : null,
            dateTo: !StringHelper.isEmptyOrNull(values.dateTo) ? DateHelper.formatDate(values.dateTo) as any : null,
        };
        this.filters.emit(this.filterOptions);
    }

    /**
     * set columns
     */
    setColumns() {
        this.columns = [
            {
                name: 'description',
                nameTranslate: 'LABELS.DESCRIPTION',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'bankAccountId',
                nameTranslate: 'LABELS.BANK_COMPTE',
                isOrder: true,
                type: ColumnType.Translate
            },
            {
                name: 'type',
                nameTranslate: 'LABELS.TYPE',
                isOrder: true,
                type: ColumnType.Translate
            },
            {
                name: 'datePaiement',
                nameTranslate: 'LABELS.DATE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'montant',
                nameTranslate: 'LABELS.AMOUNT',
                isOrder: true,
                type: ColumnType.Currency
            },
        ];
    }

    /**
     * map paiement to paiement dataTables
     */
    mapIPaiementIntoPaiementDataTable(paiement: IPaiement): IPaiementDataTables {
        const paiementDataTables: IPaiementDataTables = {
            id: paiement.id,
            description: paiement.description,
            bankAccountId: paiement.bankAccountId != null ? `${paiement.bankAccount.name}` : '',
            type: `PAIEMENT_TYPE.${paiement.type}`,
            montant: paiement.montant,
            datePaiement: paiement.datePaiement,
            hasDeleteAction: !paiement.comptabilise
        };

        return paiementDataTables;
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

    /** paiement group event */
    addPaiementGroup() {
        this.paiementGroupEvent.emit();
    }

    /** mouvement compte a compte */
    movementAccountToAccount() {
        this.transferCompteEvent.emit();
    }

    //#endregion
}
