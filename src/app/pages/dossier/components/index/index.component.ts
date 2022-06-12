import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocType } from 'app/core/enums/doctype.enums';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { DossierStatus } from 'app/core/enums/dossier-status.enums';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { StringHelper } from '../../../../core/helpers/string';
import { AssignCommercialComponent } from '../assign-commercial/assign-commercial.component';
import { DossierShared } from '../../dosssier-shared';
import { DossierTabs } from '../../../../core/enums/dossier-tabs.enum';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { AppSettings } from '../../../../app-settings/app-settings';
import { IDossierFilterOption, IFilterOption } from '../../../../core/models/general/filter-option.model';
import { DossierAssignationModel, IDossier, IDossierDataTable } from '../../dossier.model';

@Component({
    selector: 'kt-dossier-index',
    templateUrl: './index.component.html',
})
export class IndexComponent extends BaseIndexTemplateComponent<IDossierDataTable, string> implements OnInit {

    @Output() addDevisEvent = new EventEmitter<{ type: DocType, dossier: IDossier }>();
    @Output() dossierAssignationEvent = new EventEmitter<DossierAssignationModel>();
    @Output() syncAntsrouteEvent = new EventEmitter();
    @Output() markDossierAplanifierEvent = new EventEmitter();
    @Output() syncAntsrouteClickEvent = new EventEmitter();

    @Input()
    set data(data: IPagedResult<IDossier>) {
        if (data != null) {
            this.Dossiers = { ...data as IPagedResult<any> };
            this.Dossiers.value = data.value.map<IDossierDataTable>(e => this.mapIDossierIntoIDossierDataTables(e));
        }
    }

    @Input()
    set tabType(value: DossierTabs) {
        if (value != null) {
            this.type = value;
            this.initializeFilter();
        }
    }

    /** list of dossier */
    Dossiers: IPagedResult<IDossierDataTable>;

    status = DossierStatus;

    /** the filter option */
    filterOptions: IDossierFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: '',
    };

    /** the selected tabs */
    type: DossierTabs;
    types = DossierTabs;
    form: FormGroup;
    dossiersStatus: IDropDownItem<number, string>[] = [];

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog,
        private fb: FormBuilder,
    ) {
        super();
        this.setModule(this.modules.Dossiers);
        this.initializeForm();
    }

    ngOnInit() {
        this.initializeColumns();
        this.chargeStatus()
    }

    /**
     * search form initialization
     */
    initializeForm() {
        this.form = this.fb.group({
            status: [null],
        });
    }

    /** initialize filter component */
    initializeFilter() {
        switch (this.type) {

            case DossierTabs.AReplanifier:
                this.filterOptions.status = DossierStatus.EnRetard;
                break;

            case DossierTabs.AValider:
                this.filterOptions.status = DossierStatus.EnAttente;
                break;

            case DossierTabs.AVenir:
                this.filterOptions.status = DossierStatus.Assigne;
                const today = new Date();
                const tomorrow = new Date(today.setDate(today.getDate() + 1));
                this.filterOptions.dateRdvFrom = tomorrow;
                break;

        }
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
                name: 'phoneNumber',
                nameTranslate: 'LABELS.PHONE_NUMBER',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'datePose',
                nameTranslate: 'LABELS.DATE_POSE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'client',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'status',
                nameTranslate: 'LABELS.STATUS',
                isOrder: true,
                type: ColumnType.Status
            },
            {
                name: 'commercial',
                nameTranslate: 'LABELS.COMMERCIAL',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'dateRDV',
                nameTranslate: 'LABELS.DATE_RDV',
                isOrder: true,
                type: ColumnType.DateTime
            },
            {
                name: 'technicienId',
                nameTranslate: 'LABELS.TECHNICIEN',
                isOrder: false,
                type: ColumnType.any
            },
            {
                name: 'dateDebutTravaux',
                nameTranslate: 'LABELS.DATE_DEBUT_TRAVAUX',
                isOrder: false,
                type: ColumnType.DateTime
            }
        ];
    }

    /** map dossier to dossier dataTable model */
    mapIDossierIntoIDossierDataTables(dossier: IDossier): IDossierDataTable {
        const DossierDataTables: IDossierDataTable = {
            id: dossier.id,
            reference: dossier.reference,
            client: dossier.client?.fullName,
            phoneNumber: dossier.firstPhoneNumber,
            datePose: dossier.datePose,
            status: dossier.status,
            dateRDV: dossier.dateRDV,
            commercial: dossier?.commercial?.fullName,
            commercialId: dossier?.commercialId,
            dateDebutTravaux: dossier?.dossierInstallations[0]?.dateDebutTravaux,
            clientId: dossier.clientId,
            primeCEEId: dossier.primeCEEId,
            siteIntervention: dossier.siteIntervention,
            technicienId: dossier?.dossierInstallations[0]?.technicien?.fullName,
            isModify: DossierShared.canEditOrDelete(dossier.status)
        };
        return DossierDataTables;
    }

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('DELETE_DOSSIER.HEADER_TEXT'),
            message: this.translate.instant('DELETE_DOSSIER.QUESTION'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    /**
     * sync dossier with anstroute
     */
    syncAntsroute(id: string) {
        this.syncAntsrouteEvent.emit(id);
    }

    MarkDossierAplanifier(id: string) {
        this.markDossierAplanifierEvent.emit(id);
    }

    /**
     * add devis associate with dossier
     */
    addDevis(dossier: IDossier) {
        const data = {
            type: DocType.Devis,
            dossier,
        }
        this.addDevisEvent.emit(data);
    }

    /**
     * can dossier be assigne
     */
    canAssigne(status: DossierStatus) {
        return DossierShared.canAssigne(status);
    }

    /**
     * can dossier be async
     */
    canSyncAntsroute = (status) => status === DossierStatus.Aplanifie;

    /**
     * can Mark Dossier A planifier
     */
    canMarkDossierAplanifier = (status) => status === DossierStatus.Signe;

    /**
     * assigner dossier to commercial
     */
    assignerDossier(dossier: IDossierDataTable) {
        const data = {
            commercialId: dossier.commercialId,
            dateRDV: dossier.dateRDV,
            dossierId: dossier.id,
        };
        DialogHelper
            .openDialog(this.matDialog, AssignCommercialComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    const dossierAssignee: DossierAssignationModel = {
                        ...result,
                        status: dossier.status,
                        dossierId: dossier.id
                    };
                    this.dossierAssignationEvent.emit(dossierAssignee);
                }
            });
    }

    /**
     * change filter of dataTables
     * @param dataTableOutput the filter of dataTables
     */
    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOptions = { ...this.filterOptions, ...dataTableOutput };
        this.filters.emit(this.filterOptions);
    }

    /** search event with filter */
    searchEvent() {
        const values = this.form.value;
        this.filterOptions = {
            ...this.filterOptions,
            status: !StringHelper.isEmptyOrNull(values.status) ? this.form.get('status').value : null,
        };
        this.filters.emit(this.filterOptions);
    }

    /**
     * charge status
     */
    chargeStatus() {
        this.dossiersStatus = ConversionHelper.convertEnumToListKeysValues(DossierStatus, 'number');
        this.dossiersStatus.forEach(e => e.text = `DOSSIER_STATUS.${e.value}`);
    }

    //#endregion
}
