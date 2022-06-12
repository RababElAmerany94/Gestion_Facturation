import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DevisRouteActions } from 'app/core/enums/Devis-route-actions.enum';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { DocumentParamterType } from 'app/core/enums/document-parameter-type.enum';
import { FactureRouteActions } from 'app/core/enums/facture-route-actions.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { RouteName } from 'app/core/enums/route-name.enum';
import { FileHelper } from 'app/core/helpers/file';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IMailModel } from 'app/core/models/general/mail.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { DossierService } from 'app/pages/dossier/dossier.service';
import { DocumentParameterService } from 'app/pages/parametres/document-parameters/document-parameter.service';
import { IDevisParameters } from 'app/pages/parametres/document-parameters/document-parameter.model';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IDevis, IDevisModel, IFactureDevisData } from '../../devis.model';
import { DevisService } from '../../devis.service';
import { DialogHelper } from 'app/core/helpers/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DisplayFileComponent } from 'app/shared/display-file/display-file.component';

@Component({
    selector: 'kt-devis-shell',
    templateUrl: './devis-shell.component.html',
    styles: []
})
export class DevisShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** FormGroup */
    form: FormGroup;

    /** devis list */
    devisPagedResult: IPagedResult<IDevis>;

    /** the current devis to modify */
    devis: IDevis;

    /** the type of devis */
    type: DevisType;

    /** the dossier associate with this of devis */
    dossier: IDossier;

    /** the filter of devis */
    filterOption: IFilterOption;

    /** document type */
    documentType = DocumentParamterType.Devis;

    /** is in mode duplique devis */
    isDupliquer = false;

    /** navigationExtras */
    navigationExtras: NavigationExtras;

    constructor(
        private devisService: DevisService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        private dossierService: DossierService,
        private numerationService: NumerationService,
        protected toastService: ToastService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        protected router: Router,
        private dialog: MatDialog,
        private documentParametersService: DocumentParameterService
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Devis);
        this.subscribeRouteChanges();
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    //#region route

    /**
     * subscribe route changes
     */
    private subscribeRouteChanges() {
        const navigationData = this.router.getCurrentNavigation()?.extras?.state;
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams?.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum | DevisRouteActions;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        if (queryParams?.isMainRoute && !this.isAddMode()) {
                            this.dossier = navigationData?.dossier;
                            this.addEvent(navigationData?.type);
                        } else if (!this.isAddMode()) {
                            this.addEvent(null);
                        }
                        break;

                    case DevisRouteActions.TransferBonCommandeToDevis:
                        this.devis = navigationData?.data;
                        if (navigationData?.data?.dossierId) {
                            this.getDossierById(navigationData?.data?.dossierId, (result: IDossier) => {
                                this.dossier = result;
                                this.devis.bonCommandeId = navigationData?.data?.id;
                                this.type = this.devis.type == null ? DevisType.Normal : this.devis.type;
                                this.initForm();
                                this.modeAdd();
                                this.setDataInForm(this.devis);
                                this.generateReference();
                            });
                        } else {
                            this.devis.bonCommandeId = navigationData?.data?.id;
                            this.type = this.devis.type == null ? DevisType.Normal : this.devis.type;
                            this.initForm();
                            this.modeAdd();
                            this.setDataInForm(this.devis);
                            this.generateReference();
                        }
                        break;

                    case ModeEnum.Edit:
                        if (queryParams?.isMainRoute && !this.isEditMode()) {
                            this.dossier = navigationData?.dossier;
                            this.editEvent(queryParams.id);
                        } else if (!this.isEditMode()) {
                            this.editEvent(queryParams.id);
                        }
                        break;

                    case ModeEnum.Show:
                        this.dossier = navigationData?.dossier;
                        this.showEvent(queryParams.id);
                        break;
                }
            }
        });
    }

    //#endregion

    //#region forms

    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            reference: [null, [Validators.required]],
            dateVisit: [null, [Validators.required]],
            dateCreation: [new Date(), [Validators.required]],
            dateVisitePrealable: [null],
            note: [null],
            userId: [null, [Validators.required]],
            clientId: [null, [Validators.required]],
            siteIntervention: [null],
        });
    }

    /**
     * setData form
     */
    setDataInForm(devis: IDevis) {
        this.form.setValue({
            reference: devis.reference,
            dateVisit: devis.dateVisit,
            dateCreation: devis?.dateCreation ? devis?.dateCreation : new Date(),
            dateVisitePrealable: devis?.dateVisitePrealable ? devis?.dateVisitePrealable : null,
            note: devis.note,
            clientId: devis.clientId,
            siteIntervention: devis.siteIntervention,
            userId: devis.userId,
        });
    }

    /**
     * check reference is unique
     */
    checkReferenceIsUnique(devisModel: IDevisModel, isAdd: boolean, callback: (result: boolean) => void) {
        this.subs.sink = this.devisService.IsUniqueReference(devisModel.reference)
            .subscribe((result) => {
                if (result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.devis.reference !== devisModel.reference)) {
                    this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                    callback(false);
                    return;
                }
                callback(true);
            });
    }

    //#endregion

    //#region services

    /**
     * get dossier by id
     */
    getDossierById(id: string, callback): void {
        this.dossierService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get devis by id
     */
    getDevisById(id: string, callback) {
        this.subs.sink = this.devisService.Get(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    callback(result.value);
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get list devis as paged
     * @param filter display all devis
     */
    getDevis(filter: IFilterOption) {
        this.devisService.GetAsPagedResult(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.devisPagedResult = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Add devis action
     */
    addDevis(devisModel: IDevisModel) {
        this.checkReferenceIsUnique(devisModel, true, (checkResult: boolean) => {
            if (checkResult) {
                this.devisService.Add(devisModel).subscribe(result => {
                    if (result.hasValue) {
                        this.toastAddSuccess();
                        this.setModeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * Update devis
     */
    updateDevis(devisModel: IDevisModel) {
        this.checkReferenceIsUnique(devisModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.devisService.Update(this.devis.id, devisModel).subscribe(result => {
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.setModeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * generate reference devis
     */
    generateReference() {
        this.subs.sink = this.numerationService
            .GenerateNumerotation(NumerationType.DEVIS)
            .subscribe(item => {
                if (item.status === ResultStatus.Succeed) {
                    this.form.get('reference').setValue(item.value);
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
                this.getDevis(this.filterOption);
                this.setModeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * set default values of bon de commande in form
     */
    setDefaultValues() {
        this.subs.sink = this.documentParametersService.Get().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                const bonCommandeDocumentParameter = result.value.devis as IDevisParameters;
                this.form.get('note').setValue(bonCommandeDocumentParameter.note);
                if (bonCommandeDocumentParameter.validateDelay != null) {
                    const dateToday = new Date();
                    dateToday.setDate(dateToday.getDate() + parseInt(bonCommandeDocumentParameter.validateDelay.toString(), 10));
                    this.form.get('dateVisit').setValue(dateToday);
                }
            }
        });
    }

    /**
     * visualize pdf devis example
     */
    visualizationPDFDevis(id: string) {
        this.devisService.DownloadPdf(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                const displayData = FileHelper.viewPdfExample(result.value, 'Devis');
                DialogHelper.openDialog(this.dialog, DisplayFileComponent, DialogHelper.SIZE_LARGE, {
                    displayData,
                });
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    //#endregion

    //#region events

    /**
     * download pdf event
     */
    downloadPdfEvent() {
        this.subs.sink = this.devisService.DownloadPdf(this.devis.id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    FileHelper.DownloadPDF(result.value, 'Devis');
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * print devis
     */
    printDevis() {
        this.subs.sink = this.devisService.DownloadPdf(this.devis.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.printPDF(result.value, 'Devis');
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * send email
     * @param mailModel the mail model
     */
    sendEmail(mailModel: IMailModel) {
        this.subs.sink = this.devisService.SendEmail(this.devis.id, mailModel)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.devis.emails = result.value;
                } else {
                    this.toastErrorServer();
                }
            }, err => {
                this.toastErrorServer();
            });
    }

    /**
     * transfer devis to facture
     */
    transferToFactureEvent(data: IFactureDevisData) {
        const navigationExtras: NavigationExtras = {
            state: {
                ...data
            },
            queryParams: {
                mode: FactureRouteActions.TransferDevisToFacture,
                isMainRoute: false,
            }
        };
        this.router.navigate([`/${RouteName.Facture}`], navigationExtras);
    }

    /**
     * add event
     */
    addEvent(type: DevisType) {
        if (!this.isDupliquer) {
            this.devis = null;
        }
        this.type = type == null ? DevisType.Normal : type;
        this.initForm();
        this.setDefaultValues();
        this.modeAdd();
        if (this.isDupliquer && this.devis) {
            this.setDataInForm(this.devis);
        }
        this.generateReference();
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getDevisById(id, (result: IDevis) => {
            this.devis = result;
            this.type = this.devis.type;
            this.initForm();
            this.setDataInForm(result);
            this.form.disable();
            this.modeShow(id);
        });
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getDevisById(id, (result: IDevis) => {
            this.devis = result;
            this.type = result.type;
            this.initForm();
            this.setDataInForm(result);
            this.modeEdit(id);
        });
    }

    /**
     *  dupliquer event
     */
    dupliquer(devis: IDevis) {
        this.devis = devis;
        this.isDupliquer = true;
        this.addEvent(this.devis.type);
    }

    /**
     * change mode to list
     */
    setModeList() {
        if (!this.dossier?.id) {
            this.modeList();
        } else {
            this.navigationExtras = {
                queryParams: {
                    mode: ModeEnum.Show,
                    id: this.dossier.id
                }
            };
            this.router.navigate([`/${RouteName.Dossier}`], this.navigationExtras);
        }
    }

    modeChangeEvent(mode) {
        this.dossier = null;
        this.modeList();
    }

    //#endregion

}
