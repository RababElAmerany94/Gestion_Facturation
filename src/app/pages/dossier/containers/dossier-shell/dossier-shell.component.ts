import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { DossierActionRoute } from 'app/core/enums/dossier-action-route.enum';
import { DossierTabs } from 'app/core/enums/dossier-tabs.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { RouteName } from 'app/core/enums/route-name.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption, ISmsFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IClient } from 'app/pages/clients/client.model';
import { DevisService } from 'app/pages/devis/devis.service';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IDossierFilterOption } from '../../../../core/models/general/filter-option.model';
import { AddDevisDocAssociateComponent } from '../../components/add-devis-doc-associate/add-devis-doc-associate.component';
import { DossierAssignationModel, IDossier, IDossierModel, IVisteTechnique } from '../../dossier.model';
import { DossierService } from '../../dossier.service';
import { DossierStatus } from 'app/core/enums/dossier-status.enums';
import { FactureService } from 'app/pages/facture/facture.service';
import { SmsService } from 'app/shared/sms/sms.service';
import { IEnvoyerSmsModel } from 'app/shared/sms/sms.model';
import { SortDirection } from 'app/core/enums/sort-direction';
import { AppSettings } from 'app/app-settings/app-settings';
import { ClientsService } from 'app/pages/clients/clients.service';
import { DossierShared } from '../../dosssier-shared';
import { Memo } from 'app/core/models/general/memo.model';
import { DocType } from 'app/core/enums/doctype.enums';
import { BonCommandeService } from 'app/pages/bon-commande/bon-commande.service';
import { RaisonAnnulationComponent } from 'app/shared/raison-annulation/raison-annulation.component';
import { AssignCommercialComponent } from '../../components/assign-commercial/assign-commercial.component';

@Component({
    selector: 'kt-dossier-shell',
    templateUrl: './dossier-shell.component.html',
})
export class DossierShellComponent extends BaseContainerTemplateComponent implements OnInit {

    @Input()
    clientId: string;

    @Input()
    showHeader = true;

    @Input()
    set changeRoute(value: boolean) {
        if (value != null) {
            this.isMainRoute = value;
        }
    };

    /** the choice client */
    @Input()
    client: IClient;

    /** FormGroup */
    form: FormGroup;

    /** Folders list */
    dossiers: IPagedResult<IDossier>;

    /** the current folders to modify */
    dossier: IDossier;

    /** the filter of folder */
    filterOption: IFilterOption = {
        OrderBy: 'createOn',
        SortDirection: SortDirection.Desc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    /** selected tabs */
    selectedTabs = DossierTabs.AValider;

    /** dossier tabs */
    dossierTabs = DossierTabs;

    /** navigation data */
    navigationData: any;

    smsFilterOption: ISmsFilterOption = {
        ...this.filterOption
    };

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        protected toastService: ToastService,
        private dossierService: DossierService,
        private devisService: DevisService,
        private factureService: FactureService,
        private clientsService: ClientsService,
        private smsService: SmsService,
        protected numerationService: NumerationService,
        private bonCommandeService: BonCommandeService,
        private fb: FormBuilder,
        protected router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Dossiers);
        this.navigationData = this.router.getCurrentNavigation()?.extras?.state;
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.subscribeRouteChanges();
    }

    //#region forms

    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            reference: [null, [Validators.required]],
            firstPhoneNumber: [null, [Validators.required]],
            secondPhoneNumber: [null],
            note: [null],
            datePose: [null],
            siteIntervention: [null, [Validators.required]],
            dateRDV: [null],
            dateCreation: [null],
            dateExpiration: [null],
            commercial: [null],
            clientId: [null, [Validators.required]],
            primeCEEId: [null],
            raisonAnnulation: [null],
            typeTravaux: [null],
            numeroAH: [null],
            revenueFiscaleReference: [null],
            precarite: [null],
            isMaisonDePlusDeDeuxAns: [null],
            nombrePersonne: [null],
            sourceLeadId: [null],
            typeChauffageId: [null],
            surfaceTraiter: [null],
            parcelleCadastrale: [null],
            logementTypeId: [null],
            dateReceptionLead: [null],
        });
    }

    /**
     * check reference is unique
     */
    checkReferenceIsUnique(dossierModel: IDossierModel, isAdd: boolean, callback) {
        this.subs.sink = this.dossierService.IsUniqueReference(dossierModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed &&
                !result.value &&
                (isAdd ? true : this.dossier.reference !== dossierModel.reference)) {
                this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                callback(false);
                return;
            }
            callback(true);
        });
    }

    //#endregion

    //#region routes

    /**
     * subscribe route changes
     */
    private subscribeRouteChanges() {
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams?.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum | DossierActionRoute;
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

                    case DossierActionRoute.AddFromClient:
                        this.client = this.navigationData?.client;
                        this.addEvent(DossierActionRoute.AddFromClient);
                        break;
                }
            }
        });
    }

    /**
     * navigate to add devis
     * @param devisType the type of devis
     */
    navigateToAddDevis(devisType: DevisType, dossierTable: IDossier) {
        const navigationExtras: NavigationExtras = {
            state: {
                dossier: dossierTable,
                type: devisType,
            },
            queryParams: {
                mode: ModeEnum.Add,
                isMainRoute: false,
            }
        };
        this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
    }

    /**
     * navigate to add Bon Commande
     * @param devisType the type of Bon Commande
     */
    navigateToAddBonCommande(devisType: DevisType, dossierTable: IDossier) {
        const navigationExtras: NavigationExtras = {
            state: {
                dossier: dossierTable,
                type: devisType,
            },
            queryParams: {
                mode: ModeEnum.Add,
                isMainRoute: false,
            }
        };
        this.router.navigate([`/${RouteName.BonCommande}`], navigationExtras);
    }

    //#endregion

    //#region service

    /**
     * get list folders as paged
     * @param filter display all folders
     */
    getDossiers(filter: IDossierFilterOption) {
        if (filter != null) {
            this.injectClientIdIntoFilterOption(filter);
            this.dossierService.GetAsPagedResult(filter).subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.dossiers = result;
                    this.filterOption = filter;
                } else {
                    this.toastErrorServer();
                }
            });
        }
    }

    /**
     * get dossier by id
     */
    getDossierById(id: string, callback): void {
        this.dossierService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.getSMS(result.value.id, (sms) => {
                    result.value.sms = sms;
                    callback(result.value);
                });
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get SMS as paged result
     */
    getSMS(id: string, callback): void {
        this.smsFilterOption.dossierId = id;
        this.smsService.GetAsPagedResult(this.smsFilterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Add folder action
     */
    addDossier(dossierModel: IDossierModel) {
        this.checkReferenceIsUnique(dossierModel, true, (checkResult: boolean) => {
            if (checkResult) {
                this.dossierService.Add(dossierModel).subscribe(result => {
                    if (result.hasValue) {
                        this.toastAddSuccess();
                        this.getDossiers(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * add memo dossier to dossier
     * @param memo the memo to add
     */
    saveMemoDossierToDossier(memos: Memo[]) {
        this.subs.sink = this.dossierService.SaveMemos(this.dossier.id, memos)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.toastSaveSuccess();
                    this.dossier.memos = memos;
                }
            });
    }

    /**
     * Update folder
     */
    updateDossier(dossierModel: IDossierModel) {
        this.checkReferenceIsUnique(dossierModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.dossierService.Update(this.dossier.id, dossierModel).subscribe(result => {
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.getDossiers(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * add dossier assignation
     */
    dossierAssignationEvent(dossierAssignationModel: DossierAssignationModel) {
        this.getDossierById(dossierAssignationModel.dossierId, (result: IDossier) => {
            this.dossier = result;
            result.commercialId = dossierAssignationModel.commercialId;
            result.dateRDV = dossierAssignationModel.dateRDV;
            result.status = DossierStatus.Assigne;
            this.dossierService.Update(this.dossier.id, result).subscribe(res => {
                if (res.hasValue) {
                    this.toastEditSuccess();
                    this.getDossiers(this.filterOption);
                    this.modeList();
                } else {
                    this.toastErrorServer();
                }
            });
        });
    }

    /**
     * generate reference dossier
     */
    generateReference(type: NumerationType) {
        this.subs.sink = this.numerationService
            .GenerateNumerotation(type)
            .subscribe(item => {
                if (item.status === ResultStatus.Succeed) {
                    this.form.get('reference').setValue(item.value);
                }
            });
    }

    /**
     * generate reference dossier par client
     */
    generateReferenceDossier(id: string) {
        this.clientsService.Get(id).subscribe(item => {
            if (item.status === ResultStatus.Succeed) {
                const type = item.value.isSousTraitant ?
                    this.generateReference(NumerationType.SOUS_TRAITANT) : this.generateReference(NumerationType.DOSSIER);
            }
        });
    }

    /**
     * delete dossier
     */
    deleteDossier(id: string) {
        this.subs.sink = this.dossierService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getDossiers(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * sync dossier with anstroute
     */
    syncAntsroute(id: string) {
        this.subs.sink = this.dossierService.SynchronizeWithAntsroute(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getDossiers(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * sync dossier with anstroute
     */
    markDossierAplanifier(id: string) {
        this.subs.sink = this.dossierService.MarkDossierAplanifier(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getDossiers(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * mark dossier perdu
     */
    UpdateDossier(dossier: IDossier) {
        this.dossierService.Update(dossier.id, dossier).subscribe(res => {
            if (res.hasValue) {
                this.toastEditSuccess();
                this.showEvent(dossier.id);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete devis
     */
    deleteDevis(id: string) {
        this.subs.sink = this.devisService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.showEvent(this.dossier.id);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete bon commande
     */
    deleteBonCommande(id: string) {
        this.subs.sink = this.bonCommandeService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.showEvent(this.dossier.id);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete facture
     */
    deleteFacture(id: string) {
        this.subs.sink = this.factureService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.showEvent(this.dossier.id);
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * send SMS
     * @param smsModel the SMS model
     */
    sendSMS(smsModel: IEnvoyerSmsModel) {
        smsModel.dossierId = this.dossier.id;
        this.subs.sink = this.smsService.Send(smsModel)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.dossier.sms = result.value;
                } else {
                    this.toastErrorServer();
                }
            }, err => {
                this.toastErrorServer();
            });
    }

    /**
     * save visite technique to dossier
     * @param smsModel the SMS model
     */
    saveVisiteTechniqueToDossier(visiteTechnique: IVisteTechnique) {
        this.dossierService.SaveVisteTechnique(this.dossier.id, visiteTechnique).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                this.dossier.visteTechnique = visiteTechnique;
                this.toastEditSuccess();
                this.showEvent(this.dossier.id);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * sync dossier with antsroute
     * @param filter display all folders sync
     */
    syncAntsrouteAllDossier() {
        this.dossierService.SynchronizeWithAntsrouteAllDossiers().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.getDossiers(this.filterOption);
                this.toastService.success(this.translate.instant('LABELS.ALL_DOSSIER_SYNCHRONIZED_SUCCESSFULLY'));
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

    //#region events

    /**
     * add event
     */
    addEvent(mode: ModeEnum | DossierActionRoute = ModeEnum.Add) {
        this.dossier = null;
        this.initForm();
        this.modeAdd(mode);
    }

    /**
     * show event
     */
    showEvent(dossierId: string) {
        this.getDossierById(dossierId, (result: IDossier) => {
            this.dossier = result;
            this.initForm();
            this.modeShow(dossierId);
        });
    }

    /**
     * edit event
     */
    editEvent(dossierId: string) {
        this.getDossierById(dossierId, (result: IDossier) => {
            this.dossier = result;
            this.initForm();
            this.modeEdit(dossierId);
        });
    }

    /**
     * add Devis associate with dossier
     */
    addDocument(value: { type: DocType, dossier: IDossier }) {
        const data = { isPrimeCEE: value.dossier.primeCEEId != null, type: value.type };
        DialogHelper.openDialog(this.dialog, AddDevisDocAssociateComponent, DialogHelper.SIZE_SMALL, data)
            .subscribe((resultTypeDevis) => {
                if (!StringHelper.isEmptyOrNull(resultTypeDevis)) {
                    this.getDossierById(value.dossier.id, (result: IDossier) => {
                        value.type === DocType.BonCommande ? this.navigateToAddBonCommande(resultTypeDevis as DevisType, result) :
                            this.navigateToAddDevis(resultTypeDevis as DevisType, result);
                    });
                }
            });
    }

    /**
     * mark dossier perdu
     */
    markDossierPerduDialog(id: string) {
        DialogHelper
            .openDialog(this.dialog, RaisonAnnulationComponent, DialogHelper.SIZE_SMALL, null)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.getDossierById(id, (dossier: IDossier) => {
                        dossier.raisonAnnulation = result.raisonAnnulation;
                        dossier.status = DossierStatus.Perdu;
                        this.UpdateDossier(dossier);
                    });
                }
            });
    }

    /**
     * mark dossier assigner
     */
    markDossierAssigneDialog(id: string) {
        this.getDossierById(id, (dossier: IDossier) => {
            const data = dossier == null ? null : {
                commercialId: dossier.commercialId,
                dateRDV: dossier.dateRDV,
                dossierId: dossier.id,
            };
            DialogHelper
                .openDialog(this.dialog, AssignCommercialComponent, DialogHelper.SIZE_MEDIUM, data)
                .subscribe(result => {
                    if (!StringHelper.isEmptyOrNull(result)) {
                        dossier.commercialId = result.commercialId;
                        dossier.dateRDV = result.dateRDV;
                        dossier.status = DossierStatus.Assigne;
                        this.UpdateDossier(dossier);
                    }
                });
        });
    }

    //#endregion

    //#region helpers

    private injectClientIdIntoFilterOption(filter: IDossierFilterOption) {
        if (this.clientId != null) {
            filter.clientId = this.clientId;
        }
    }

    modeChangeEvent(mode) {
        this.dossier = null;
        this.client = null;
        this.mode = mode;
    }

    canAddVisiteTechnique = () => !DossierShared.canAddVisiteTechnique(this.dossier?.status);

    //#endregion

}
