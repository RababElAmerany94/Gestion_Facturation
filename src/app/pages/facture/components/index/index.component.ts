import { Component, OnInit, EventEmitter, Output, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { StringHelper } from 'app/core/helpers/string';
import { DateHelper } from 'app/core/helpers/date';
import { FactureStatus } from 'app/core/enums/facture-status.enum';
import { IconHelpers } from 'app/core/helpers/icon';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { NumberHelper } from 'app/core/helpers/number';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IFactureFilterOption, IFilterOption } from 'app/core/models/general/filter-option.model';
import { SortDirection } from 'app/core/enums/sort-direction';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { IFactureDataTables, IFacture } from '../../facture.model';
import { FactureHelper } from '../../facture-helper';

@Component({
    selector: 'kt-facture-index',
    templateUrl: './index.component.html'
})
export class IndexComponent extends BaseIndexTemplateComponent<IFactureDataTables, string> implements OnInit {

    @Output()
    addFactureGroupEvent = new EventEmitter();

    @Output()
    exportReleveFactureEvent = new EventEmitter();

    @Output()
    cancelFactureEvent = new EventEmitter();

    @Output()
    dupliquerEvent = new EventEmitter();

    @Input()
    set data(values: IPagedResult<IFacture>) {
        if (values != null) {
            this.facture = values.value;
            this.factures = { ...values as IPagedResult<any> };
            this.factures.value = values.value.map<IFactureDataTables>(e => this.mapIFactureIntoIFactureDataTable(e));
        }
    }

    /** filter options */
    filterOptions: IFactureFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    /** the list of facture */
    factures: IPagedResult<IFactureDataTables>;
    facture: IFacture[];

    /** the user profile enumeration */
    userProfile = UserProfile;

    /** the filtre form */
    form: FormGroup;

    /** factures status */
    facturesStatus: IDropDownItem<number, string>[] = [];

    constructor(
        private matDialog: MatDialog,
        private translate: TranslateService,
        private fb: FormBuilder,
        @Inject(CalculationToken) private calculation: ICalculation
    ) {
        super();
        this.initializeForm();
        this.setModule(this.modules.Avoir);
    }

    ngOnInit() {
        this.setColumns();
        this.chargeStatus();
    }

    /**
     * search form initialization
     */
    initializeForm() {
        this.form = this.fb.group({
            status: [null],
            dateFrom: [null],
            dateTo: [null]
        });
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
                type: ColumnType.Html
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
            },
            {
                name: 'clientId',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'dateCreation',
                nameTranslate: 'LABELS.CREATION_DATE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'dateEcheance',
                nameTranslate: 'LABELS.DATE_ECHEANCE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'totalTTC',
                nameTranslate: 'LABELS.TOTAL_TTC',
                isOrder: true,
                type: ColumnType.Html
            },
        ];
    }

    //#region search event

    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOptions = { ...this.filterOptions, ...dataTableOutput };
        this.filters.emit(this.filterOptions);
    }

    /** search event with filter */
    searchEvent() {
        const values = this.form.value;
        this.filterOptions = {
            ...this.filterOptions,
            status: !StringHelper.isEmptyOrNull(values.status) ? [this.form.get('status').value] : null,
            dateFrom: !StringHelper.isEmptyOrNull(values.dateFrom) ? DateHelper.formatDate(values.dateFrom) as any : null,
            dateTo: !StringHelper.isEmptyOrNull(values.dateTo) ? DateHelper.formatDate(values.dateTo) as any : null,
        };
        this.filters.emit(this.filterOptions);
    }

    //#endregion

    /**
     * mapping facture to facture dataTables
     * @param facture the facture information
     */
    mapIFactureIntoIFactureDataTable(facture: IFacture): IFactureDataTables {

        const factureDataTables: IFactureDataTables = {
            id: facture.id,
            reference: `${facture.comptabilise ? IconHelpers.Lock() : ''} ${facture.reference}`,
            clientId: facture.client.fullName,
            dateCreation: facture.dateCreation,
            dateEcheance: facture.dateEcheance,
            type: this.translate.instant('FACTURE_TYPE.' + facture.type),
            status: facture.status,
            totalTTC: this.getTotalTtcFacture(facture),
            isModify: FactureHelper.canEditOrDelete(facture.status)
        };

        return factureDataTables;
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
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LA')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    /** cancel facture */
    cancelFacture(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('CONFIRMATION.CANCEL.HEADER'),
            message: this.translate.instant('CONFIRMATION.CANCEL.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.ANNULEZ_LA')
        }, () => {
            this.cancelFactureEvent.emit(this.facture.filter(x => x.id === id)[0]);
        });
    }

    /**
     * add facture group event
     */
    AddFactureGroup() {
        this.addFactureGroupEvent.emit();
    }

    /**
     * export releve facture event
     */
    ExportReleveFacture() {
        this.exportReleveFactureEvent.emit();
    }

    dupliquer(id: string) {
        this.dupliquerEvent.emit(this.facture.filter(x => x.id === id)[0]);
    }

    //#endregion

    //#region helpers

    /**
     * charge status
     */
    chargeStatus() {
        this.facturesStatus = ConversionHelper.convertEnumToListKeysValues(FactureStatus, 'number');
        this.facturesStatus.forEach(e => e.text = `FACTURE_STATUS.${e.value}`);
    }

    /**
     * get total TTC facture
     */
    getTotalTtcFacture(facture: IFacture): string {
        const totalTTC = `<span class="text-right" >${NumberHelper.formatNumberCurrency(facture.totalTTC)}</span>`;
        const restToPay = `<br/><small class="text-right font-italic" >` + `${NumberHelper.formatNumberCurrency(this.calculation.restPayerFacture(facture))}</small>`;

        if (facture.status === FactureStatus.ENCOURS || facture.status === FactureStatus.ENRETARD) {
            return `${totalTTC}${restToPay}`;
        } else {
            return `${totalTTC}`;
        }
    }

    canAnnuler = (status, id: string) => !FactureHelper.isStatusAnnulee(status, this.facture?.filter(x => x.id === id)[0]?.type);
    //#endregion
}
