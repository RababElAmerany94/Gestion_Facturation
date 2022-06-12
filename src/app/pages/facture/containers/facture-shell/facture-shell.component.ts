import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Location } from '@angular/common';
import { MsgCode } from 'app/core/constants/msg-code';
import { FactureRouteActions } from 'app/core/enums/facture-route-actions.enum';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DateHelper } from 'app/core/helpers/date';
import { DialogHelper } from 'app/core/helpers/dialog';
import { FileHelper } from 'app/core/helpers/file';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFactureFilterOption, IFilterOption, IReleveFacturesFilterOption } from 'app/core/models/general/filter-option.model';
import { IMailModel } from 'app/core/models/general/mail.model';
import { DocumentComptableReferenceStatus, ReferenceResultModel } from 'app/core/models/general/reference-result-model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IDevis, IFactureDevisData } from 'app/pages/devis/devis.model';
import { IPaiementModel } from 'app/pages/paiement/paiement.model';
import { PaiementService } from 'app/pages/paiement/paiement.service';
import { IFactureDocumentParameters } from 'app/pages/parametres/document-parameters/document-parameter.model';
import { DocumentParameterService } from 'app/pages/parametres/document-parameters/document-parameter.service';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ExportReleveFactureComponent } from '../../components/export-releve-facture/export-releve-facture.component';
import { FactureGroupComponent } from '../../components/facture-group/facture-group.component';
import { IFacture, IFactureModel } from '../../facture.model';
import { FactureService } from '../../facture.service';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { FactureType } from 'app/core/enums/facture-type.enum';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { Memo } from 'app/core/models/general/memo.model';
import { DisplayFileComponent } from 'app/shared/display-file/display-file.component';

@Component({
    selector: 'kt-facture-shell',
    templateUrl: './facture-shell.component.html'
})
export class FactureShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the form group */
    form: FormGroup;

    /** the current facture */
    facture: IFacture;

    /** list of factures */
    factures: IPagedResult<IFacture>;

    /** filter option */
    filterOption: IFilterOption;

    /** the current reference */
    currentReference: ReferenceResultModel;

    /** data transfer devis to facture */
    data: IFactureDevisData = null;

    /* list devis to transfer to an facture */
    devis: IDevis[] = [];

    /** the dossier associate with this of devis */
    dossier: IDossier;

    /** is action of duplicate */
    isDuplicate = false;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private fb: FormBuilder,
        private factureService: FactureService,
        protected toastService: ToastService,
        private numerationService: NumerationService,
        private dialog: MatDialog,
        private paiementService: PaiementService,
        private route: ActivatedRoute,
        private location: Location,
        protected router: Router,
        private documentParametersService: DocumentParameterService
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Facture);
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
                const mode = parseInt(queryParams.mode, 10) as ModeEnum | FactureRouteActions;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        if ((!this.isDuplicate || this.facture == null) && !this.isAddMode()) {
                            this.addEvent();
                        }
                        break;

                    case ModeEnum.Edit:
                        this.dossier = navigationData?.dossier;
                        this.editEvent(queryParams.id);
                        break;

                    case ModeEnum.Show:
                        this.dossier = navigationData?.dossier;
                        this.showEvent(queryParams.id);
                        break;

                    case FactureRouteActions.TransferDevisToFacture:
                        if (navigationData != null && queryParams?.isMainRoute) {
                            this.data = { ...navigationData as IFactureDevisData }
                            this.transferDevisToFacture([this.data?.factureDevis?.devis]);
                        }
                        break;
                }
            }
        });
    }

    //#endregion

    //#region form

    /**
     * initialize form
     */
    initializeForm() {
        this.form = this.fb.group({
            reference: [{ value: null, disabled: true }, [Validators.required]],
            clientId: [null, [Validators.required]],
            dateCreation: [new Date(), [Validators.required]],
            dateEcheance: [null, [Validators.required]],
            objet: [null],
            reglementCondition: [null],
            note: [null],
            numeroAH: [null]
        });
    }

    /**
     * set facture in form
     */
    setFactureInForm(facture: IFacture) {
        this.form.setValue({
            reference: facture.reference,
            clientId: facture.clientId,
            dateCreation: facture.dateCreation,
            dateEcheance: facture.dateEcheance,
            objet: facture.objet,
            reglementCondition: facture.reglementCondition,
            note: facture.note,
            numeroAH: facture.numeroAH,
        });
    }

    /**
     * set devis in form
     */
    setDevisInForm(devis: IDevis) {
        this.form.patchValue({
            clientId: devis.clientId,
            note: devis.note,
        });
    }

    /**
     * generate new reference ( call only in add )
     */
    generateNewReference() {
        this.generateReference(new Date(), (val) => {
            this.currentReference = val;
            this.form.get('reference').setValue(this.currentReference.reference);
        });
    }

    //#endregion

    //#region events

    /**
     * add event
     */
    addEvent(mode: ModeEnum | FactureRouteActions = ModeEnum.Add) {
        this.facture = null;
        this.initializeForm();
        this.subscribeChangeOfCreationDate();
        this.setDefaultValues();
        this.form.enable();
        if (mode === FactureRouteActions.TransferDevisToFacture) {
            this.setDevisInForm(this.devis[0]);
        } else {
            this.devis = [];
        }
        this.modeAdd(mode);
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getFactureById(id, (facture) => {
            this.facture = facture;
            this.initializeForm();
            this.form.enable();
            this.setFactureInForm(this.facture);
            this.modeEdit(id);
        });
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getFactureById(id, (facture) => {
            this.facture = facture;
            this.initializeForm();
            this.setFactureInForm(this.facture);
            this.form.disable();
            this.modeShow(id);
        });
    }

    /**
     *  dupliquer event
     */
    dupliquer(facture: IFacture) {
        this.facture = facture;
        this.facture.type = FactureType.Classic;
        this.isDuplicate = true;
        this.initializeForm();
        this.form.enable();
        this.setFactureInForm(facture);
        this.generateNewReference();
        this.modeAdd(ModeEnum.Add);
    }

    /**
     * add facture group event
     */
    addFactureGroupEvent() {
        DialogHelper.openDialog(this.dialog, FactureGroupComponent, DialogHelper.SIZE_MEDIUM, {}).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.transferDevisToFacture(result as IDevis[]);
            }
        });
    }

    /** export releve facture  */
    exportReleveFactureEvent() {
        DialogHelper.openDialog(this.dialog, ExportReleveFactureComponent, DialogHelper.SIZE_MEDIUM, {}).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.exportReleveFacturesPDF(result);
            }
        });
    }
    // #endregion

    //#region services

    /**
     * get factures as paged
     */
    getFactures(filterOption: IFactureFilterOption) {
        this.subs.sink = this.factureService.GetAsPagedResult(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.filterOption = filterOption;
                this.factures = result;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /** getFacture by id */
    getFactureById(id: string, callback: (client: IFacture) => void) {
        this.subs.sink = this.factureService.Get(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    callback(result.value);
                } else {
                    this.toastErrorServer();
                }

            });
    }

    /** cancel facture to avoir */
    cancelFacture(facture: IFacture) {
        if (facture?.facturePaiements?.length === 0) {
            this.subs.sink = this.factureService.CancelFacture(facture.id)
                .subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastService.success(this.translate.instant('SUCCESS.CANCEL'));
                        this.showEvent(facture.id);
                    } else {
                        this.toastErrorServer();
                    }
                });
        } else {
            this.toastService.error(this.translate.instant('ERRORS.REMOVE_PAIEMENT'));
        }
    }

    /**
     * add new facture
     */
    addFacture(factureModel: IFactureModel) {
        factureModel.counter = this.currentReference.counter;
        this.subs.sink = this.factureService.Add(factureModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.setModeList();
            } else {
                if (result.message === MsgCode.ReferenceNotUnique) {
                    this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                    this.changeReferenceConfirmation(() => {
                        factureModel.reference = this.currentReference.reference;
                        this.addFacture(factureModel);
                    });
                } else {
                    this.toastErrorServer();
                }
            }
        });
    }

    /**
     * edit facture
     */
    editFacture(factureModel: IFactureModel) {
        factureModel.counter = this.currentReference.counter;
        this.subs.sink = this.factureService.Update(this.facture.id, factureModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.setModeList();
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
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
                this.getFactures(this.filterOption);
                this.modeList();
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * generate reference facture
     * @param dateCreation the date of creation of facture
     * @param callback the callback
     */
    generateReference(dateCreation: Date, callback: (result: ReferenceResultModel) => void) {
        const body = { dateCreation, type: NumerationType.FACTURE };
        this.subs.sink = this.numerationService.GenerateNumerotationDocumentComptable(body).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                callback(res.value);
            } else {
                this.currentReference = null;
                this.manageErrorReference(res.value.status);
            }
        }, err => {
            this.manageErrorReference(err.error?.value?.status);
        });
    }

    /**
     * subscribe change of creation date
     */
    subscribeChangeOfCreationDate() {
        this.subs.sink = this.form.get('dateCreation').valueChanges
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(res => {
                console.log('ge');
                this.generateReference(DateHelper.formatDate(res) as any, (val) => {
                    this.currentReference = val;
                    this.form.get('reference').setValue(this.currentReference.reference);
                })
            });
    }

    /** export releve facture by filter */
    exportReleveFacturesPDF(filterOption: IReleveFacturesFilterOption) {
        this.subs.sink = this.factureService.ExportReleveFacturesPDF(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.DownloadPDF(result.value.releveFacture, 'Releve Facture');
                result.value.factures.forEach(element => {
                    FileHelper.DownloadPDF(element, 'Facture');
                });
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * visualize pdf facture example
     */
    visualizationPDFFacture(id: string) {
        this.factureService.GeneratePDF(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                const displayData = FileHelper.viewPdfExample(result.value, 'Facture');
                DialogHelper.openDialog(this.dialog, DisplayFileComponent, DialogHelper.SIZE_LARGE, {
                    displayData,
                });
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * download PDF
     */
    downloadFacture() {
        this.subs.sink = this.factureService.GeneratePDF(this.facture.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.DownloadPDF(result.value, 'Facture');
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * print Facture
     */
    printFacture() {
        this.subs.sink = this.factureService.GeneratePDF(this.facture.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.printPDF(result.value, 'Facture');
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
        this.subs.sink = this.factureService.SendEmail(this.facture.id, mailModel)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.facture.emails = result.value;
                } else {
                    this.toastErrorServer();
                }
            }, err => {
                this.toastErrorServer();
            });
    }

    /**
     * add new paiement
     */
    addPaiement(paiementModel: IPaiementModel) {
        this.subs.sink = this.paiementService.Add(paiementModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.showEvent(paiementModel.facturePaiements[0].factureId);
            } else {
                this.toastErrorServer();
            }

        });
    }

    /**
     * edit paiement
     */
    editPaiement(paiementModel: IPaiementModel, idFacturePaiement: string) {
        this.subs.sink = this.paiementService.Update(idFacturePaiement, paiementModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.showEvent(paiementModel.facturePaiements[0].factureId);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete paiement
     */
    deletePaiement(data: { paiementModelId: string, factureId: string }) {
        this.subs.sink = this.paiementService.Delete(data.paiementModelId).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.showEvent(data.factureId);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * set default values of facture in form
     */
    setDefaultValues() {
        this.subs.sink = this.documentParametersService.Get().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                const factureDocumentParameter = result.value.facture as IFactureDocumentParameters;
                this.form.get('reglementCondition').setValue(factureDocumentParameter.regulationCondition);
                this.form.get('note').setValue(factureDocumentParameter.note);
                if (factureDocumentParameter.validateDelay != null) {
                    const dateToday = new Date();
                    dateToday.setDate(dateToday.getDate() + parseInt(factureDocumentParameter.validateDelay.toString(), 10));
                    this.form.get('dateEcheance').setValue(dateToday);
                }
            }
        });
    }

    //#endregion

    //#region memos

    /**
     * add memo to Facture object
     */
    addMemoToFacture(memos: Memo[]) {
        this.subs.sink = this.factureService.SaveMemos(this.facture.id, memos).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.facture.memos = memos;
            }
        });
    }

    //#endregion

    //#region helpers

    /**
     * manage error reference
     * @param status the status of error reference
     */
    manageErrorReference(status: DocumentComptableReferenceStatus) {
        switch (status) {
            case DocumentComptableReferenceStatus.CONFIGURE_ACCOUNTING_PERIOD:
                this.toastService.error(this.translate.instant('ERRORS.CONFIG_ACCOUNTING_PERIOD'));
                break;
            case DocumentComptableReferenceStatus.PERIOD_NOT_EXIST_OR_CLOSURE:
                this.toastService.error(this.translate.instant['ERRORS.NO_ACCOUNTING_PERIOD']);
                break;
        }
    }

    /**
     * change reference confirmation
     * @param callback the callback
     */
    changeReferenceConfirmation(callback: () => void) {
        this.generateReference(DateHelper.formatDate(this.form.value.dateCreation) as any, (val: ReferenceResultModel) => {
            DialogHelper.openConfirmDialog(this.dialog, {
                header: this.translate.instant('CONFIRMATION.REFERENCE_DOCUMENT_COMPTABLE.TITLE'),
                message: `${this.translate.instant('CONFIRMATION.REFERENCE_DOCUMENT_COMPTABLE.QUESTION')} ${val.reference}`,
                cancel: this.translate.instant('LABELS.CANCEL'),
                confirm: this.translate.instant('LABELS.OUI')
            }, () => {
                this.currentReference = val;
                callback();
            });
        });
    }
    //#endregion

    //#region transfers

    /**
     * transfer devis to facture
     * @param devis the list of devis
     */
    transferDevisToFacture(devis: IDevis[]) {
        if (devis != null) {
            this.devis = devis;
            this.addEvent(FactureRouteActions.TransferDevisToFacture);
        }
    }

    /**
     * change mode to list
     */
    setModeList() {
        this.data = null;
        if (this.dossier == null) {
            this.modeList();
        } else {
            this.location.back();
        }
    }

    modeChangeEvent(mode) {
        this.dossier = null;
        this.data = null;
        this.modeList();
    }

    //#endregion
}
