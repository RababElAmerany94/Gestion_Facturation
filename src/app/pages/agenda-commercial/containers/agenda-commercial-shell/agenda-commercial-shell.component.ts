import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AgendaCommercialTabs } from 'app/core/enums/agenda-commercial-tabs.enum';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IEchangeCommercialFilterOption } from './../../../../core/models/general/filter-option.model';
import { StringHelper } from './../../../../core/helpers/string';
import { ArrayHelper } from './../../../../core/helpers/array';
import { AgendaCommercialEditComponent } from './../../components/edit/edit.component';
import { ModeEnum } from './../../../../core/enums/mode.enum';
import { DialogHelper } from './../../../../core/helpers/dialog';
import { IPagedResult } from './../../../../core/models/general/result-model';
import { IEchangeCommercial, IEchangeCommercialModel, IChangeDateEventModel, IAgendaModel } from './../../agenda-commercial.model';
import { ResultStatus } from './../../../../core/enums/result-status';
import { AgendaCommercialService } from './../../agenda-commercial.service';
import { ToastService } from './../../../../core/layout/services/toast.service';
import { BaseContainerTemplateComponent } from './../../../../shared/base-features/base-container.component';
import { NumerationService } from './../../../parametres/numerotation/numerotation.service';
import { TranslationService } from './../../../../core/layout/services/translation.service';
import { EchangeCommercialType } from './../../../../core/enums/echange-commercial-type.enum';
import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';
import { AppSettings } from './../../../../app-settings/app-settings';
import { SortDirection } from './../../../../core/enums/sort-direction';
import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';
import { Memo } from 'app/core/models/general/memo.model';

@Component({
    selector: 'kt-agenda-commercial-shell',
    templateUrl: './agenda-commercial-shell.component.html'
})
export class AgendaCommercialShellComponent extends BaseContainerTemplateComponent implements OnInit {

    @Input()
    set changeRoute(value: boolean) {
        if (value != null) {
            this.isMainRoute = value;
        }
    };

    /** the choice dossier */
    @Input()
    dossierId: string;

    /** the choice client */
    @Input()
    clientId: string;

    @Input()
    changeColor: false;

    /** echange commercial list */
    echangeCommercials: IPagedResult<IEchangeCommercial>;

    /** the current echange commercial to modify */
    echangeCommercial: IEchangeCommercial;

    /** the filter of folder */
    filterOption: IFilterOption = {
        SearchQuery: '',
        OrderBy: 'Id',
        SortDirection: SortDirection.Asc,
        Page: 1,
        PageSize: AppSettings.MAX_GET_DATA,
    };

    /** selected tabs */
    selectedTabs = AgendaCommercialTabs.Agenda;

    /** selected tabs type */
    selectedTabsTpe = AgendaCommercialTabs;

    /** the form of echange Commercial */
    form: FormGroup;

    isGetAgendaRefresh = false;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        protected toastService: ToastService,
        protected numerationService: NumerationService,
        protected echangeCommercialService: AgendaCommercialService,
        private fb: FormBuilder,
        protected router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.AgendaCommercial);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.subscribeRouteChanges();
    }
    //#region routes

    /**
     * subscribe route changes
     */
    private subscribeRouteChanges() {
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams?.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        if (this.isMainRoute)
                            this.addEvent();
                        break;

                    case ModeEnum.Edit:
                        if (this.isMainRoute)
                            this.editEvent(queryParams.id);
                        break;

                    case ModeEnum.Show:
                        if (this.isMainRoute)
                            this.showEvent(queryParams.id);
                        break;
                }
            }
        });
    }

    //#endregion

    //#region form

    /**
     * init Form tache
     */
    initFormTache() {
        this.form = this.fb.group({
            responsableId: [null, [Validators.required]],
            clientId: [null],
            dossierId: [null],
            categorieId: [null],
            typeAppelId: [null],
            titre: [null, [Validators.required]],
            rdvTypeId: [null],
            tacheTypeId: [null],
            description: [null],
            adresse: [null],
            phoneNumber: [null],
            dateEvent: [null, [Validators.required]],
            time: [null],
            duree: [null],
            sourceRDVId: [null],
            priorite: [null],
        });
    }

    /**
     * init Form rdv
     */
    initFormRDV() {
        this.form = this.fb.group({
            responsableId: [null, [Validators.required]],
            clientId: [null],
            dossierId: [null],
            categorieId: [null],
            typeAppelId: [null],
            titre: [null, [Validators.required]],
            rdvTypeId: [null],
            tacheTypeId: [null],
            description: [null],
            adresse: [null],
            phoneNumber: [null],
            dateEvent: [null, [Validators.required]],
            time: [null, [Validators.required]],
            duree: [null],
            sourceRDVId: [null],
            priorite: [null],
        });
    }

    /**
     * init Form appel
     */
    initFormAppel() {
        this.form = this.fb.group({
            responsableId: [null, [Validators.required]],
            clientId: [null],
            dossierId: [null],
            categorieId: [null],
            typeAppelId: [null],
            titre: [null, [Validators.required]],
            rdvTypeId: [null],
            tacheTypeId: [null],
            description: [null],
            adresse: [null],
            phoneNumber: [null],
            dateEvent: [null, [Validators.required]],
            time: [null],
            duree: [null],
            sourceRDVId: [null],
            priorite: [null],
        });
    }

    /**
     * setData form
     */
    setDataInForm(echangeCommercial: IEchangeCommercial) {
        setTimeout(() => {
            this.form.patchValue({
                responsableId: echangeCommercial.responsableId,
                clientId: echangeCommercial.clientId,
                dossierId: echangeCommercial.dossierId,
                tacheTypeId: echangeCommercial.tacheTypeId,
                rdvTypeId: echangeCommercial.rdvTypeId,
                categorieId: echangeCommercial.categorieId,
                titre: echangeCommercial.titre,
                description: echangeCommercial.description,
                dateEvent: echangeCommercial.dateEvent,
                time: new Date(echangeCommercial?.dateEvent),
                priorite: echangeCommercial.priorite,
                phoneNumber: echangeCommercial.phoneNumber,
                typeAppelId: echangeCommercial.typeAppelId,
                sourceRDVId: echangeCommercial.sourceRDVId,
                duree: echangeCommercial?.duree?.slice(0, 5),
            })
        });
    }

    //#endregion

    //#region service

    /**
     * get list folders as paged
     * @param filter display all folders
     */
    getEchangeCommercial(filter: IEchangeCommercialFilterOption) {
        this.injectClientIdIntoFilterOption(filter);
        this.injectDossierIdIntoFilterOption(filter);
        filter.type = this.getTypeTabs();
        this.echangeCommercialService.GetAsPagedResult(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.echangeCommercials = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get Echange Commercial by id
     */
    getEchangeCommercialById(id: string, callback): void {
        this.echangeCommercialService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Add agenda action
     */
    addEchangeCommercial(EchangeCommercialModel: IEchangeCommercialModel) {
        this.echangeCommercialService.Add(EchangeCommercialModel).subscribe(result => {
            if (result.hasValue) {
                if (this.isGetAgendaRefresh === false) {
                    this.toastAddSuccess();
                    this.getEchangeCommercial(this.filterOption);
                    this.modeList();
                }
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Update folder
     */
    editEchangeCommercial(EchangeCommercialModel: IEchangeCommercialModel) {
        this.echangeCommercialService.Update(this.echangeCommercial.id, EchangeCommercialModel).subscribe(result => {
            if (result.hasValue) {
                if (this.isGetAgendaRefresh === false) {
                    this.toastEditSuccess();
                    this.getEchangeCommercial(this.filterOption);
                    this.modeList();
                }
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete EchangeCommercial
     */
    deleteEchangeCommercial(id: string) {
        this.subs.sink = this.echangeCommercialService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getEchangeCommercial(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * change status
     */
    ChangeStatusEchangeCommercial(status: EchangeCommercialStatus) {
        this.echangeCommercialService.Get(this.echangeCommercial.id).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                res.value.status = status;
                this.echangeCommercialService.Update(this.echangeCommercial.id, res.value).subscribe(result => {
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.showEvent(result.value.id);
                    } else {
                        this.toastErrorServer();
                    }
                });
            } else {
                this.toastErrorServer();
            }
        });

    }

    /**
     * save Addresse Event
     */
    saveAddresseEvent(event: Address[]) {
        this.echangeCommercialService.Get(this.echangeCommercial.id).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                res.value.addresses = event;
                this.echangeCommercialService.Update(this.echangeCommercial.id, res.value).subscribe(result => {
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.showEvent(result.value.id);
                    } else {
                        this.toastErrorServer();
                    }
                });
            } else {
                this.toastErrorServer();
            }
        });

    }

    /**
     * save Contact Event
     */
    saveContactEvent(event: Contact[]) {
        this.echangeCommercialService.Get(this.echangeCommercial.id).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                res.value.contacts = event;
                this.echangeCommercialService.Update(this.echangeCommercial.id, res.value).subscribe(result => {
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.showEvent(result.value.id);
                    } else {
                        this.toastErrorServer();
                    }
                });
            } else {
                this.toastErrorServer();
            }
        });

    }

    /**
     * Update Date Event
     */
    updateDate(changeDateEventModel: IChangeDateEventModel) {
        this.echangeCommercialService.UpdateDateEvent(changeDateEventModel).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
            } else {
                this.toastErrorServer();
            }
        });

    }

    //#endregion

    // #region memos

    /**
     * add memo to echange Commercial object
     */
    saveMemoToEchangeCommercial(memos: Memo[]) {
        this.subs.sink = this.echangeCommercialService.SaveMemos(this.echangeCommercial.id, memos).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.echangeCommercial.memos = memos;
            }
        });
    }

    // #endregion

    // #region events

    /**
     * add event
     */
    addEvent(agendaModel?: IAgendaModel) {
        this.echangeCommercial = null;
        if (this.selectedTabs === AgendaCommercialTabs.Taches || agendaModel?.type === EchangeCommercialType.Tache)
            this.initFormTache();
        else if (this.selectedTabs === AgendaCommercialTabs.RendezVous || agendaModel?.type === EchangeCommercialType.RDV)
            this.initFormRDV();
        else if (this.selectedTabs === AgendaCommercialTabs.Appels || agendaModel?.type === EchangeCommercialType.Appel)
            this.initFormAppel();
        DialogHelper.openDialog(this.dialog, AgendaCommercialEditComponent, DialogHelper.SIZE_LARGE, {
            mode: ModeEnum.Add,
            form: this.form,
            type: agendaModel != null ? agendaModel.type : this.getTypeTabs(),
            dateEvent: agendaModel?.dateEvent,
            clientId: this.clientId,
            dossierId: this.dossierId,
        }).subscribe(result => {
            if (!ArrayHelper.isEmptyOrNull(result)) {
                result.type = agendaModel != null ? agendaModel.type : this.getTypeTabs();
                this.isGetAgendaRefresh = agendaModel?.isFromAgenda ? true : false;
                this.addEchangeCommercial(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(agendaModel?: IAgendaModel) {
        this.getEchangeCommercialById(agendaModel?.id.toString(), (echangeCommercial) => {
            this.echangeCommercial = echangeCommercial;
            if (this.selectedTabs === AgendaCommercialTabs.Taches || echangeCommercial?.type === EchangeCommercialType.Tache)
                this.initFormTache();
            else if (this.selectedTabs === AgendaCommercialTabs.RendezVous || echangeCommercial?.type === EchangeCommercialType.RDV)
                this.initFormRDV();
            else if (this.selectedTabs === AgendaCommercialTabs.Appels || echangeCommercial?.type === EchangeCommercialType.Appel)
                this.initFormAppel();
            this.setDataInForm(this.echangeCommercial);
            DialogHelper.openDialog(this.dialog, AgendaCommercialEditComponent, DialogHelper.SIZE_LARGE, {
                mode: ModeEnum.Edit,
                form: this.form,
                echangeCommercial: this.echangeCommercial,
                type: this.getTypeTabs(),
            }).subscribe((result) => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    result.type = this.getTypeTabs();
                    this.isGetAgendaRefresh = agendaModel?.isFromAgenda ? true : false;
                    this.editEchangeCommercial(result);
                }
            });
        });
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getEchangeCommercialById(id, (echangeCommercial) => {
            this.echangeCommercial = echangeCommercial;
            if (this.selectedTabs === AgendaCommercialTabs.Taches || echangeCommercial?.type === EchangeCommercialType.Tache)
                this.initFormTache();
            else if (this.selectedTabs === AgendaCommercialTabs.RendezVous || echangeCommercial?.type === EchangeCommercialType.RDV)
                this.initFormRDV();
            else if (this.selectedTabs === AgendaCommercialTabs.Appels || echangeCommercial?.type === EchangeCommercialType.Appel)
                this.initFormAppel();
            this.setDataInForm(this.echangeCommercial);
            this.modeShow(id);
        });
    }

    /** get type of tabs and synchronize with type backend */
    getTypeTabs() {
        if (this.selectedTabs === AgendaCommercialTabs.Taches)
            return EchangeCommercialType.Tache;
        else if (this.selectedTabs === AgendaCommercialTabs.RendezVous)
            return EchangeCommercialType.RDV;
        else if (this.selectedTabs === AgendaCommercialTabs.Appels)
            return EchangeCommercialType.Appel;
        else if (this.selectedTabs === AgendaCommercialTabs.Agenda)
            return this.echangeCommercial != null ? this.echangeCommercial.type : null;
    }

    // #endregion

    //#region helpers

    private injectClientIdIntoFilterOption(filter: IEchangeCommercialFilterOption) {
        if (this.clientId != null) {
            filter.clientId = this.clientId;
        }
    }

    private injectDossierIdIntoFilterOption(filter: IEchangeCommercialFilterOption) {
        if (this.dossierId != null) {
            filter.dossierId = this.dossierId;
        }
    }

    //#endregion
}
