import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppSettings } from '../../../../app-settings/app-settings';
import { EchangeCommercialType } from '../../../../core/enums/echange-commercial-type.enum';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { DialogHelper } from '../../../../core/helpers/dialog';
import { IPagedResult } from '../../../../core/models/general/result-model';
import { AgendaCommercialTabs } from 'app/core/enums/agenda-commercial-tabs.enum';
import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';
import { IEchangeCommercialFilterOption } from 'app/core/models/general/filter-option.model';
import { BaseIndexTemplateComponent } from '../../../../shared/base-features/base-index.component';
import { ColumnType } from '../../../../shared/data-table/data-table.component';
import { IAgendaModel, IEchangeCommercial, IEchangeCommercialDataTables } from '../../agenda-commercial.model';
import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';
import { ArrayHelper } from './../../../../core/helpers/array';

@Component({
    selector: 'kt-agenda-commercial-index',
    templateUrl: './index.component.html'
})
export class AgendaCommercialIndexComponent extends BaseIndexTemplateComponent<IEchangeCommercialDataTables, string> implements OnInit {

    @Output()
    editEventIndex = new EventEmitter<IAgendaModel>();

    /** set data echange Commercial */
    @Input()
    set data(data: IPagedResult<IEchangeCommercial>) {
        if (data != null) {
            this.echangeCommercials = data;
            this.agendasDataTables = { ...data as IPagedResult<any> };
            this.agendasDataTables.value = data.value.map<IEchangeCommercialDataTables>
                (e => this.mapEchangeCommercialIntoEchangeCommercial(e));
        }
    }

    /** set type echange Commercial */
    @Input()
    set type(value: AgendaCommercialTabs) {
        if (value != null) {
            this.typeTabs = value;
            this.title = this.getTitles();
        }
    }

    /** the choice client */
    @Input()
    clientId: number;

    /** list echange Commercial */
    agendasDataTables: IPagedResult<IEchangeCommercialDataTables>;

    /** echange Commercial list */
    echangeCommercials: IPagedResult<IEchangeCommercial>;

    /** the type of this tabs */
    typeTabs: AgendaCommercialTabs;

    /** the type of this tabs */
    typetabs = AgendaCommercialTabs;

    /** the title of this tabs */
    title: string;

    /** the filtre form */
    form: FormGroup;

    /** filter options */
    filterOptions: IEchangeCommercialFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    /** the status of this echange commercial */
    status = EchangeCommercialStatus;

    constructor(
        private matDialog: MatDialog,
        private translate: TranslateService,
        private fb: FormBuilder,
    ) {
        super();
        this.initializeForm();
        this.setModule(this.modules.AgendaCommercial);
    }

    ngOnInit() {
        if (this.typeTabs === AgendaCommercialTabs.Taches)
            this.initializeColumnsTache();
        else if (this.typeTabs === AgendaCommercialTabs.RendezVous)
            this.initializeColumnsRDV();
        else if (this.typeTabs === AgendaCommercialTabs.Appels)
            this.initializeColumnsAppel();
    }

    /**
     * search form initialization
     */
    initializeForm() {
        this.form = this.fb.group({
            responsableId: [null],
            clientId: [null],
            categorieId: [null],
            search: [null, []],
        });
        this.form.valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(res => {
            this.searchEvent();
        });
    }

    /**
     * initialize columns
     */
    initializeColumnsTache() {
        this.columns = [
            {
                name: 'clientId',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'responsableId',
                nameTranslate: 'LABELS.RESPONSABLE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'titre',
                nameTranslate: 'LABELS.TITLE',
                isOrder: true,
                type: ColumnType.Html
            },
            {
                name: 'type',
                nameTranslate: 'LABELS.TYPE',
                isOrder: true,
                type: ColumnType.Translate
            },
            {
                name: 'status',
                nameTranslate: 'LABELS.STATUS',
                isOrder: true,
                type: ColumnType.Status
            },
            {
                name: 'dateEvent',
                nameTranslate: 'LABELS.DATE',
                isOrder: true,
                type: ColumnType.DateTime
            }
        ];
    }

    /**
     * initialize columns
     */
    initializeColumnsRDV() {
        this.columns = [
            {
                name: 'clientId',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'responsableId',
                nameTranslate: 'LABELS.RESPONSABLE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'description',
                nameTranslate: 'LABELS.DESCRIPTION',
                isOrder: true,
                type: ColumnType.Html
            },
            {
                name: 'type',
                nameTranslate: 'LABELS.TYPE',
                isOrder: true,
                type: ColumnType.Translate
            },
            {
                name: 'status',
                nameTranslate: 'LABELS.STATUS',
                isOrder: true,
                type: ColumnType.Status
            },
            {
                name: 'contact',
                nameTranslate: 'CONTACTS.TITLE_CONTACT',
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
                name: 'titre',
                nameTranslate: 'LABELS.TITLE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'adresse',
                nameTranslate: 'ADDRESS.TITLE_ADRESSE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'dateEvent',
                nameTranslate: 'LABELS.DATE',
                isOrder: true,
                type: ColumnType.DateTime
            }
        ];
    }

    /**
     * initialize columns
     */
    initializeColumnsAppel() {
        this.columns = [
            {
                name: 'clientId',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'responsableId',
                nameTranslate: 'LABELS.RESPONSABLE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'description',
                nameTranslate: 'LABELS.DESCRIPTION',
                isOrder: true,
                type: ColumnType.Html
            },
            {
                name: 'type',
                nameTranslate: 'LABELS.TYPE',
                isOrder: true,
                type: ColumnType.Translate
            },
            {
                name: 'status',
                nameTranslate: 'LABELS.STATUS',
                isOrder: true,
                type: ColumnType.Status
            },
            {
                name: 'titre',
                nameTranslate: 'LABELS.TITLE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'contact',
                nameTranslate: 'CONTACTS.TITLE_CONTACT',
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
                name: 'dateEvent',
                nameTranslate: 'LABELS.DATE',
                isOrder: true,
                type: ColumnType.DateTime
            }
        ];
    }

    /**
     * map folder to echange Commercial dataTables model
     */
    mapEchangeCommercialIntoEchangeCommercial(echangeCommercial: IEchangeCommercial): IEchangeCommercialDataTables {
        const addresses = echangeCommercial.addresses as Address[];
        const contacts = echangeCommercial.contacts as Contact[];
        const clientDataTables: IEchangeCommercialDataTables = {
            id: echangeCommercial.id,
            description: echangeCommercial.description,
            clientId: echangeCommercial.client?.firstName,
            type: this.translate.instant(`ECHANGE_COMMERCIAL_TYPE.${echangeCommercial.type}`),
            status: echangeCommercial.status,
            responsableId: echangeCommercial.responsable?.fullName,
            phoneNumber: echangeCommercial.phoneNumber,
            dateEvent: new Date(echangeCommercial.dateEvent),
            adresse: !ArrayHelper.isEmptyOrNull(addresses) && addresses.length > 0 ? `${addresses[0]?.ville} ${addresses[0]?.codePostal}` : '',
            contact: !ArrayHelper.isEmptyOrNull(contacts) && contacts.length > 0 ? `${contacts[0]?.nom} ${contacts[0]?.prenom} ${contacts[0]?.mobile}` : '',
            titre: echangeCommercial.titre,
        };
        return clientDataTables;
    }

    //#region click events

    /**
     * delete click
     */
    deleteTache(id: string) {
        const name = this.getNameType(this.typeTabs);
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant(`${name}.DELETE.HEADER`),
            message: this.translate.instant(`${name}.DELETE.MESSAGE`),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    /**
     * title of pop up
     */
    getTitles() {
        switch (this.typeTabs) {
            case AgendaCommercialTabs.Appels:
                return 'APPELS.LIST_TITLE';

            case AgendaCommercialTabs.RendezVous:
                return 'RENDEZ-VOUS.LIST_TITLE';

            case AgendaCommercialTabs.Taches:
                return 'TACHE.LIST_TITLE';
        }
    }

    /**
     * name of pop up
     */
    getNameType(type: AgendaCommercialTabs) {
        switch (type) {
            case AgendaCommercialTabs.Appels:
                return 'APPELS';

            case AgendaCommercialTabs.RendezVous:
                return 'RENDEZ-VOUS';

            case AgendaCommercialTabs.Taches:
                return 'TACHE';
        }
    }

    /** search event with filter */
    searchEvent() {
        const values = this.form.value;
        this.filterOptions = {
            ...this.filterOptions,
            SearchQuery: values.search,
            responsableId: values?.responsableId,
            clientId: values?.clientId,
            categorieId: values?.categorieId,
            type: this.getTypeTabs(),
        };
        this.filters.emit(this.filterOptions);
    }

    /** get type of tabs and synchronize with type backend */
    getTypeTabs() {
        if (this.typeTabs === AgendaCommercialTabs.Taches)
            return EchangeCommercialType.Tache;
        else if (this.typeTabs === AgendaCommercialTabs.RendezVous)
            return EchangeCommercialType.RDV;
        else if (this.typeTabs === AgendaCommercialTabs.Appels)
            return EchangeCommercialType.Appel;
    }

    editClickEvent(id: string) {
        const agendaModel: IAgendaModel = {
            id,
        }
        this.editEventIndex.emit(agendaModel);
    }

    //#endregion
}
