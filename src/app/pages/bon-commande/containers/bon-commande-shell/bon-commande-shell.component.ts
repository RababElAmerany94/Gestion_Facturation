import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BonCommandeStatus } from 'app/core/enums/bon-commande-status.enum';
import { DevisRouteActions } from 'app/core/enums/Devis-route-actions.enum';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { DocumentParamterType } from 'app/core/enums/document-parameter-type.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { RouteName } from 'app/core/enums/route-name.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { FileHelper } from 'app/core/helpers/file';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IMailModel } from 'app/core/models/general/mail.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { IBonCommandeParameters } from 'app/pages/parametres/document-parameters/document-parameter.model';
import { DocumentParameterService } from 'app/pages/parametres/document-parameters/document-parameter.service';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { DisplayFileComponent } from 'app/shared/display-file/display-file.component';
import { IBonCommande, IBonCommandeModel } from '../../bon-commande.model';
import { BonCommandeService } from '../../bon-commande.service';

@Component({
    selector: 'kt-bon-commande-shell',
    templateUrl: './bon-commande-shell.component.html'
})
export class BonCommandeShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** FormGroup */
    form: FormGroup;

    /** bonCommande list */
    bonCommandePagedResult: IPagedResult<IBonCommande>;

    /** the current bonCommande to modify */
    bonCommande: IBonCommande;

    /** the type of bonCommande */
    type: DevisType;

    /** the dossier associate with this of bonCommande */
    dossier: IDossier;

    /** the filter of bonCommande */
    filterOption: IFilterOption;

    /** document type */
    documentType = DocumentParamterType.BonCommande;

    /** is in mode duplique bonCommande */
    isDupliquer = false;

    /** navigationExtras */
    navigationExtras: NavigationExtras;

    constructor(
        private bonCommandeService: BonCommandeService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        private numerationService: NumerationService,
        protected toastService: ToastService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        protected router: Router,
        private dialog: MatDialog,
        private documentParametersService: DocumentParameterService
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.BonCommande);
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
                const mode = parseInt(queryParams.mode, 10) as ModeEnum;
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

                    case ModeEnum.Edit:
                        if (queryParams?.isMainRoute && !this.isEditMode()) {
                            this.dossier = navigationData?.dossier;
                            this.editEvent(queryParams.id);
                        } else if (!this.isAddMode()) {
                            this.editEvent(queryParams.id);
                        }
                        break;

                    case ModeEnum.Show:
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
            note: [null],
            userId: [null, [Validators.required]],
            clientId: [null, [Validators.required]],
            siteIntervention: [null],
            raisonAnnulation: [null],
        });
    }

    /**
     * setData form
     */
    setDataInForm(bonCommande: IBonCommande) {
        this.form.setValue({
            reference: bonCommande.reference,
            dateVisit: bonCommande.dateVisit,
            note: bonCommande.note,
            clientId: bonCommande.clientId,
            siteIntervention: bonCommande.siteIntervention,
            userId: bonCommande.userId,
            raisonAnnulation: bonCommande.raisonAnnulation,
        });
    }

    /**
     * check reference is unique
     */
    checkReferenceIsUnique(bonCommandeModel: IBonCommandeModel, isAdd: boolean, callback: (result: boolean) => void) {
        this.subs.sink = this.bonCommandeService.IsUniqueReference(bonCommandeModel.reference)
            .subscribe((result) => {
                if (result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.bonCommande.reference !== bonCommandeModel.reference)) {
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
     * get bonCommande by id
     */
    getBonCommandeById(id: string, callback) {
        this.subs.sink = this.bonCommandeService.Get(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    callback(result.value);
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get list bonCommande as paged
     * @param filter display all bonCommande
     */
    getBonCommande(filter: IFilterOption) {
        this.bonCommandeService.GetAsPagedResult(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.bonCommandePagedResult = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Add bonCommande action
     */
    addBonCommande(bonCommandeModel: IBonCommandeModel) {
        this.checkReferenceIsUnique(bonCommandeModel, true, (checkResult: boolean) => {
            if (checkResult) {
                this.bonCommandeService.Add(bonCommandeModel).subscribe(result => {
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
     * Update bonCommande
     */
    updateBonCommande(bonCommandeModel: IBonCommandeModel) {
        this.checkReferenceIsUnique(bonCommandeModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.bonCommandeService.Update(this.bonCommande.id, bonCommandeModel).subscribe(result => {
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
     * generate reference bonCommande
     */
    generateReference() {
        this.subs.sink = this.numerationService
            .GenerateNumerotation(NumerationType.BONCOMMANDE)
            .subscribe(item => {
                if (item.status === ResultStatus.Succeed) {
                    this.form.get('reference').setValue(item.value);
                }
            });
    }

    /**
     * delete bonCommande
     */
    deleteBonCommande(id: string) {
        this.subs.sink = this.bonCommandeService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getBonCommande(this.filterOption);
                this.setModeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * change status bon commande
     */
    markBonCommandeAnnuler(bonCommande: IBonCommande) {
        this.subs.sink = this.bonCommandeService.Get(bonCommande?.id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    result.value.raisonAnnulation = bonCommande.raisonAnnulation;
                    result.value.status = BonCommandeStatus.Annule;
                    this.bonCommandeService.Update(bonCommande.id, result.value).subscribe(res => {
                        if (res.hasValue) {
                            this.toastEditSuccess();
                            this.showEvent(bonCommande.id);
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
     * set default values of bon de commande in form
     */
    setDefaultValues() {
        this.subs.sink = this.documentParametersService.Get().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                const bonCommandeDocumentParameter = result.value.bonCommande as IBonCommandeParameters;
                this.form.get('note').setValue(bonCommandeDocumentParameter.note);
                if (bonCommandeDocumentParameter.validateDelay != null) {
                    const dateToday = new Date();
                    dateToday.setDate(dateToday.getDate() + parseInt(bonCommandeDocumentParameter.validateDelay.toString(), 10));
                    this.form.get('dateVisit').setValue(dateToday);
                }
            }
        });
    }

    //#endregion

    //#region events

    /**
     * download pdf event
     */
    downloadPdfEvent() {
        this.subs.sink = this.bonCommandeService.DownloadPdf(this.bonCommande.id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    FileHelper.DownloadPDF(result.value, 'BonCommande');
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * print bonCommande
     */
    printBonCommande() {
        this.subs.sink = this.bonCommandeService.DownloadPdf(this.bonCommande.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.printPDF(result.value, 'BonCommande');
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
        this.subs.sink = this.bonCommandeService.SendEmail(this.bonCommande.id, mailModel)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.bonCommande.emails = result.value;
                } else {
                    this.toastErrorServer();
                }
            }, err => {
                this.toastErrorServer();
            });
    }

    /**
     * visualize pdf bon commande example
     */
    visualizationPDFBonCommande(id: string) {
        this.bonCommandeService.DownloadPdf(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                const displayData = FileHelper.viewPdfExample(result.value, 'Bon Commande');
                DialogHelper.openDialog(this.dialog, DisplayFileComponent, DialogHelper.SIZE_LARGE, {
                    displayData,
                });
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * transfer bonCommande to devis
     */
    transferBonCommandeToDevis(data: IBonCommande) {
        const navigationExtras: NavigationExtras = {
            state: {
                data
            },
            queryParams: {
                mode: DevisRouteActions.TransferBonCommandeToDevis,
            }
        };
        this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
    }

    /**
     * add event
     */
    addEvent(type: DevisType) {
        if (!this.isDupliquer) {
            this.bonCommande = null;
        }
        this.type = type == null ? DevisType.Normal : type;
        this.initForm();
        this.setDefaultValues();
        this.modeAdd();
        if (this.isDupliquer && this.bonCommande) {
            this.setDataInForm(this.bonCommande);
        }
        this.generateReference();
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getBonCommandeById(id, (result: IBonCommande) => {
            this.bonCommande = result;
            this.type = this.bonCommande.type;
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
        this.getBonCommandeById(id, (result: IBonCommande) => {
            this.bonCommande = result;
            this.type = result.type;
            this.initForm();
            this.setDataInForm(result);
            this.modeEdit(id);
        });
    }

    /**
     *  dupliquer event
     */
    dupliquer(bonCommande: IBonCommande) {
        this.bonCommande = bonCommande;
        this.isDupliquer = true;
        this.addEvent(this.bonCommande.type);
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
