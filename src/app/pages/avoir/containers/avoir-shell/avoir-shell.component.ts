import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MsgCode } from 'app/core/constants/msg-code';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DateHelper } from 'app/core/helpers/date';
import { DialogHelper } from 'app/core/helpers/dialog';
import { FileHelper } from 'app/core/helpers/file';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IAvoirFilterOption, IFilterOption } from 'app/core/models/general/filter-option.model';
import { IMailModel } from 'app/core/models/general/mail.model';
import { DocumentComptableReferenceStatus, ReferenceResultModel } from 'app/core/models/general/reference-result-model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IAvoirDocumentParameters } from 'app/pages/parametres/document-parameters/document-parameter.model';
import { DocumentParameterService } from 'app/pages/parametres/document-parameters/document-parameter.service';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IAvoir, IAvoirModel } from '../../avoir.model';
import { AvoirService } from '../../avoir.service';
import { Memo } from 'app/core/models/general/memo.model';
import { DisplayFileComponent } from 'app/shared/display-file/display-file.component';

@Component({
    selector: 'kt-avoir-shell',
    templateUrl: './avoir-shell.component.html'
})
export class AvoirShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the form group */
    form: FormGroup;

    /** the current avoir */
    avoir: IAvoir;

    /** list of avoirs */
    avoirs: IPagedResult<IAvoir>;

    /** filter option */
    filterOption: IFilterOption;

    /** the current reference */
    currentReference: ReferenceResultModel;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private fb: FormBuilder,
        private avoirService: AvoirService,
        protected toastService: ToastService,
        private numerationService: NumerationService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        protected router: Router,
        private documentParamaeterService: DocumentParameterService
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Avoir);
        this.subscribeRouteChanges();
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    //#region route

    /**
     * subscribe route changes
     */
    subscribeRouteChanges() {
        const navigationData = this.router.getCurrentNavigation()?.extras?.state;
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams?.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        if (!this.isAddMode())
                            this.addEvent();
                        break;

                    case ModeEnum.Edit:
                        this.editEvent(queryParams.id);
                        break;

                    case ModeEnum.Show:
                        this.showEvent(queryParams.id);
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
            note: [null]
        });
    }

    /**
     * set avoir in form
     */
    setAvoirInForm(avoir: IAvoir) {
        this.form.setValue({
            reference: avoir.reference,
            clientId: avoir.clientId,
            dateCreation: avoir.dateCreation,
            dateEcheance: avoir.dateEcheance,
            objet: avoir.objet,
            reglementCondition: avoir.reglementCondition,
            note: avoir.note,
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
    addEvent() {
        this.avoir = null;
        this.initializeForm();
        this.subscribeChangeOfCreationDate();
        this.setDefaultValues();
        this.form.enable();
        this.modeAdd();
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getAvoirById(id, (result: IAvoir) => {
            this.avoir = result;
            this.initializeForm();
            this.form.enable();
            this.setAvoirInForm(this.avoir);
            this.modeEdit(id);
        });
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getAvoirById(id, (result: IAvoir) => {
            this.avoir = result;
            this.initializeForm();
            this.setAvoirInForm(this.avoir);
            this.form.disable();
            this.modeShow(id);
        });
    }

    /**
     * print pdf avoir
     */
    printAvoirEvent() {
        this.generatePdfAvoir((result: string) => {
            FileHelper.printPDF(result, 'Avoir');
        });
    }

    /**
     * download pdf avoir
     */
    downloadAvoirEvent() {
        this.generatePdfAvoir((result: string) => {
            FileHelper.DownloadPDF(result, 'Avoir');
        });
    }

    /**
     * dupliquer event
     */
    dupliquer(avoir: IAvoir) {
        this.initializeForm();
        this.form.enable();
        this.subscribeChangeOfCreationDate();
        this.setDefaultValues();
        this.setAvoirInForm(avoir);
        this.generateNewReference();
        this.modeAdd();
    }

    // #endregion

    //#region services

    /**
     * get avoirs as paged
     */
    getAvoirs(filterOption: IAvoirFilterOption) {
        this.subs.sink = this.avoirService.GetAsPagedResult(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.filterOption = filterOption;
                this.avoirs = result;
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /** getAvoir by id */
    getAvoirById(id: string, callback): void {
        this.avoirService.Get(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    callback(result.value);
                } else {
                    this.toastErrorServer();
                }

            });
    }

    /**
     * add new avoir
     */
    addAvoir(avoirModel: IAvoirModel) {
        avoirModel.counter = this.currentReference.counter;
        this.subs.sink = this.avoirService.Add(avoirModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastService.success(this.translate.instant('SUCCESS.ADD'));
                this.modeList();
            } else {
                if (result.message === MsgCode.ReferenceNotUnique) {
                    this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                    this.changeReferenceConfirmation(() => {
                        avoirModel.reference = this.currentReference.reference;
                        this.addAvoir(avoirModel);
                    });
                } else {
                    this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                }
            }
        });
    }

    /**
     * edit avoir
     */
    editAvoir(avoirModel: IAvoirModel) {
        avoirModel.counter = this.currentReference.counter;
        this.subs.sink = this.avoirService.Update(this.avoir.id, avoirModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastService.success(this.translate.instant('SUCCESS.EDIT'));
                this.modeList();
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * delete avoir
     */
    deleteAvoir(id: string) {
        this.subs.sink = this.avoirService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastService.success(this.translate.instant('SUCCESS.DELETE'));
                this.getAvoirs(this.filterOption);
                this.modeList();
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * generate reference avoir
     * @param dateCreation the date of creation of avoir
     * @param callback the callback
     */
    generateReference(dateCreation: Date, callback: (result: ReferenceResultModel) => void) {
        const body = { dateCreation, type: NumerationType.AVOIR };
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
            .subscribe(res =>
                this.generateReference(DateHelper.formatDate(res) as any, (val) => {
                    this.currentReference = val;
                    this.form.get('reference').setValue(this.currentReference.reference);
                })
            );
    }

    /**
     * generate pdf
     */
    generatePdfAvoir(callback) {
        this.subs.sink = this.avoirService.GeneratePDF(this.avoir.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * send email
     * @param mailModel the mail model
     */
    sendEmail(mailModel: IMailModel) {
        this.subs.sink = this.avoirService.SendEmail(this.avoir.id, mailModel)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.avoir.emails = result.value;
                } else {
                    this.toastErrorServer();
                }
            }, err => {
                this.toastErrorServer();
            });
    }


    /**
     * visualize pdf avoir example
     */
    visualizationPDFAvoir() {
        this.generatePdfAvoir((result: string) => {
            const displayData = FileHelper.viewPdfExample(result, 'Avoir');
            DialogHelper.openDialog(this.dialog, DisplayFileComponent, DialogHelper.SIZE_LARGE, {
                displayData,
            });
        });
    }

    //#endregion

    //#region memos

    /**
     * add memo to Avoir object
     */
    addMemoToAvoir(memos: Memo[]) {
        this.subs.sink = this.avoirService.SaveMemos(this.avoir.id, memos).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.avoir.memos = memos;
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
    changeReferenceConfirmation(callback) {
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

    /**
     * set default values of facture in form
     */
    setDefaultValues() {
        this.documentParamaeterService.Get().subscribe(res => {
            const avoirDocumentParameter = res.value.avoir as IAvoirDocumentParameters;
            this.form.get('reglementCondition').setValue(avoirDocumentParameter.regulationCondition);
            this.form.get('note').setValue(avoirDocumentParameter.note);
            if (avoirDocumentParameter.validateDelay != null) {
                const dateToday = new Date();
                dateToday.setDate(dateToday.getDate() + parseInt(avoirDocumentParameter.validateDelay.toString(), 10));
                this.form.get('dateEcheance').setValue(dateToday);
            }
        });
    }
    //#endregion

}
