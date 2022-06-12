import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AppSettings } from 'app/app-settings/app-settings';
import { Constants } from 'app/core/constants/msg-code';
import { ClientType } from 'app/core/enums/client-type.enum';
import { FactureStatus } from 'app/core/enums/facture-status.enum';
import { PaimentType } from 'app/core/enums/paiment-type.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { Calculation } from 'app/core/helpers/calculation/calculation';
import { CalculationToken } from 'app/core/helpers/calculation/icalculation';
import { DateHelper } from 'app/core/helpers/date';
import { FormHelper } from 'app/core/helpers/form';
import { NumberHelper } from 'app/core/helpers/number';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFactureFilterOption } from 'app/core/models/general/filter-option.model';
import { IFacture } from 'app/pages/facture/facture.model';
import { FactureService } from 'app/pages/facture/facture.service';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { IFacturePaiment, IPaiementGroupeObligeModel, IPaiementModel } from '../../paiement.model';

@Component({
    selector: 'kt-paiement-group',
    templateUrl: './paiement-group.component.html'
})
export class PaiementGroupComponent extends BaseEditTemplateComponent<IPaiementModel> implements OnInit {

    subs = new SubSink();

    /** payment group for client */
    forClient = true;

    /** payment group for client */
    isPeriode = true;

    /** form group */
    form: FormGroup;

    /** form clients */
    formClient: FormGroup;

    /** search form control */
    searchControl = new FormControl();

    /** the array of exclude regulation modes */
    excludeRegulationMode = [Constants.RegulationModeAvoirId];

    /** step one */
    stepOne = true;

    /** step two */
    stepTwo: boolean;

    /** step three */
    stepThreeClient: boolean;

    /** step three */
    stepThreeObligesOption: boolean;

    /** step three */
    stepFourObliges: boolean;

    /** page count */
    pageCount = 1;

    /** page current */
    page = 1;

    /** amount of paiement */
    montant: number;

    /** the filter option */
    filterOption: IFactureFilterOption = {
        OrderBy: 'createdOn',
        SortDirection: SortDirection.Asc,
        Page: this.page,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    /** list factures */
    factures: IFacture[] = [];

    /** the enumeration of client types */
    clientType = ClientType;

    maxFileSize = AppSettings.MAX_SIZE_FILE;
    accept = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    files: File;

    constructor(
        public dialogRef: MatDialogRef<PaiementGroupComponent>,
        private toastService: ToastService,
        private fb: FormBuilder,
        private factureService: FactureService,
        private translate: TranslateService,
        @Inject(CalculationToken) private calculation: Calculation,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            form: FormGroup
        }
    ) {
        super();
        this.initializeFormClient();
    }

    /** initialize form client */
    initializeFormClient() {
        this.formClient = this.fb.group({
            clientId: [null, [Validators.required]],
            primeCeeId: [null, [Validators.required]],
        });
    }

    ngOnInit() {
        this.form = this.data.form;
        this.subscribeSearchControl();
    }

    /**
     * subscribe changes of search control
     */
    subscribeSearchControl() {
        this.subs.sink = this.searchControl.valueChanges
            .pipe(debounceTime(700),
                distinctUntilChanged())
            .subscribe(result => {
                this.initializeComponent(result);
            });
    }

    /** total amount */
    totalMontant() {
        return this.factures
        .filter(e => e['checked'] === true)
        .reduce((x, y) => x + (y['montant'] == null ? 0 : y['montant']), 0);
    }

    /**
     * initialize parameters of component
     * @param searchQuery the search query
     */
    initializeComponent(searchQuery: string) {
        this.filterOption.Page = 1;
        this.filterOption.SearchQuery = searchQuery;
        this.filterOption.status = [FactureStatus.ENCOURS, FactureStatus.ENRETARD];
        this.factures = this.factures.filter(x => x['checked'.toString()] === true);
        this.getListFacture(this.filterOption);
    }

    /*
     * parcourir steps
     */
    next() {
        if (this.stepOne) {
            this.nextToStepTwo();
        } else if (this.stepTwo) {
            this.nextToStepThree();
        } else if (this.stepThreeClient) {
            this.save();
        } else if (this.stepThreeObligesOption) {
            this.nextToStepFour();
        } else if (this.stepFourObliges) {
            if (this.isPeriode) {
                this.nextToStepFive();
            } else {
                this.saveObligesExcel();
            }
        }
    }

    /**
     * payment group
     */
    save() {
        const selectedFactures = this.factures.filter(x => x['checked'.toString()]);
        const totalAmountRounded = NumberHelper.roundingNumber(this.totalMontant());
        const amountRounded = NumberHelper.roundingNumber(this.montant);
        const isInValidField = selectedFactures.filter(x => x['invalid'.toString()]).length > 0;

        if (isInValidField) {
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        } else if (totalAmountRounded > amountRounded) {
            this.toastService.error(this.translate.instant('ERRORS.AMOUNT_SUP'));
        } else if (totalAmountRounded < amountRounded) {
            this.toastService.error(this.translate.instant('ERRORS.AMOUNT_INF'));
        } else if (totalAmountRounded === amountRounded) {

            // create payment
            const payment: IPaiementModel = {
                montant: this.montant,
                agenceId: UserHelper.getAgenceId(),
                bankAccountId: this.form.get('bankAccountId').value,
                regulationModeId: this.form.get('regulationModeId').value,
                datePaiement: DateHelper.formatDate(this.form.get('datePaiement').value) as any,
                description: this.form.get('description').value,
                type: PaimentType.PAYER_GROUP,
                createAvoir: false,
                facturePaiements: []
            };

            // fill facture paiement
            selectedFactures.forEach(item => {
                const facturePayment: IFacturePaiment = {
                    factureId: item.id,
                    montant: item['montant'.toString()],
                };
                payment.facturePaiements.push(facturePayment);
            });
            this.dialogRef.close(payment);
        }
    }

    /*
     * save oblige
     *
     * */
    saveObligesExcel() {
        if (this.files != null) {

            const payment: IPaiementGroupeObligeModel = {
                bankAccountId: this.form.get('bankAccountId').value,
                primeCeeId: this.formClient.get('primeCeeId').value,
                regulationModeId: this.form.get('regulationModeId').value,
                datePaiement: DateHelper.formatDate(this.form.get('datePaiement').value) as any,
                description: this.form.get('description').value,
                fichePaiement: '',
            };

            const reader = new FileReader();
            reader.readAsDataURL(this.files[0]);
            reader.onload = () => {
                payment.fichePaiement = reader.result.toString()
            }

            this.dialogRef.close(payment);
        } else {
            this.toastService.error(this.translate.instant('ERRORS.ADD_LEAST_FILE'));
        }
    }

    /*
     * next to step two
     *
     * */
    nextToStepTwo() {
        /** check form */
        if (this.form.valid) {
            this.montant = parseFloat(this.form.get('montant').value);
            if (this.forClient) {
                FormHelper.updateFormControlValidation(this.formClient, [Validators.required], 'clientId');
                FormHelper.updateFormControlValidation(this.formClient, [], 'primeCeeId');
                this.changeStepValue({
                    stepOne: false, stepTwo: true, stepThreeClient: false,
                    stepThreeObligesOption: false, stepFourObliges: false
                });
            } else {
                FormHelper.updateFormControlValidation(this.formClient, [], 'clientId');
                FormHelper.updateFormControlValidation(this.formClient, [Validators.required], 'primeCeeId');
                this.changeStepValue({
                    stepOne: false, stepTwo: true, stepThreeClient: false,
                    stepThreeObligesOption: false, stepFourObliges: false
                });
            }
        } else {
            this.form.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /** next to step three */
    nextToStepThree() {
        if (this.formClient.valid) {
            if (this.forClient) {
                this.filterOption.clientId = this.formClient.controls.clientId.value;
                this.changeStepValue({
                    stepOne: false, stepTwo: false, stepThreeClient: true,
                    stepThreeObligesOption: false, stepFourObliges: false
                });
                this.initializeComponent('');
            } else {
                this.filterOption.primeCeeId = this.formClient.controls.primeCeeId.value;
                this.filterOption.dateFrom = this.form.controls.dateFrom.value;
                this.filterOption.dateTo = this.form.controls.dateTo.value;
                this.changeStepValue({
                    stepOne: false, stepTwo: false, stepThreeClient: false,
                    stepThreeObligesOption: true, stepFourObliges: false
                });
                FormHelper.updateFormControlValidation(this.form, [Validators.required], 'dateFrom');
                FormHelper.updateFormControlValidation(this.form, [Validators.required], 'dateTo');
            }
        } else {
            this.formClient.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /*
     * next to step two
     *
     * */
    nextToStepFour() {
        if (this.formClient.valid) {
            this.changeStepValue({
                stepOne: false, stepTwo: false, stepThreeClient: false,
                stepThreeObligesOption: false, stepFourObliges: true
            });
        } else {
            this.formClient.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /*
     * next to step five
     *
     * */
    nextToStepFive() {
        if (this.form.valid) {
            this.changeStepValue({
                stepOne: false, stepTwo: false, stepThreeClient: true,
                stepThreeObligesOption: false, stepFourObliges: false
            });
            this.initializeComponent('');
        } else {
            this.form.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));

        }
    };

    /** change step value */
    changeStepValue(value: {
        stepOne: boolean, stepTwo: boolean, stepThreeClient: boolean,
        stepThreeObligesOption: boolean, stepFourObliges: boolean
    }) {
        this.stepOne = value.stepOne;
        this.stepTwo = value.stepTwo;
        this.stepThreeClient = value.stepThreeClient;
        this.stepThreeObligesOption = value.stepThreeObligesOption;
        this.stepFourObliges = value.stepFourObliges;
    }

    /**
     * load more data
     */
    loadMore() {
        if (this.pageCount <= this.page) { return; }
        this.page++;
        this.getListFacture(this.filterOption);
    }

    /**
     * reset forms
     */
    reset() {
        this.changeStepValue({
            stepOne: true, stepTwo: false, stepThreeClient: false,
            stepThreeObligesOption: false, stepFourObliges: false
        });

        /** if we reset date not required */
        FormHelper.updateFormControlValidation(this.form, [], 'dateFrom');
        FormHelper.updateFormControlValidation(this.form, [], 'dateTo');
        this.formClient.reset();
        this.form.reset();
    }

    /**
     * get list of factures
     */
    getListFacture(filterOption: IFactureFilterOption) {
        this.subs.sink = this.factureService.GetAsPagedResult(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                const newFactures = result.value.filter(value => this.factures.filter(x => x.id === value.id).length === 0);
                this.pageCount = result.pageCount;
                newFactures.forEach(
                    item => {
                        const restPayer = this.calculation.restPayerFacture(item);
                        const totalFacture = this.totalMontant();
                        const restMontant = NumberHelper.roundingNumber(this.montant) - NumberHelper.roundingNumber(totalFacture);
                        if (restMontant > 0) {
                            item['montant'.toString()] =
                                (NumberHelper.roundingNumber(restMontant) - NumberHelper.roundingNumber(restPayer) < 0
                                    ? restMontant
                                    : restPayer
                                );
                            item['checked'.toString()] = true;
                        }
                        this.factures.push(item);
                    }
                );
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    //#region events

    onSelect(event) {
        if (event.rejectedFiles.length > 0 && event.rejectedFiles.filter(e => e.reason = 'type').length > 0) {
            this.toastService.warning(this.translate.instant('ERRORS.FORMAT_INVALID_DOCUMENT'));
        }
        if (event.rejectedFiles.length > 0 && event.rejectedFiles.filter(e => e.reason = 'size').length > 0) {
            this.toastService.warning(this.translate.instant('ERRORS.SIZE'));
        }
        this.files = event.addedFiles;
    }

    onRemove(event) {
        this.files = null;
    }

    //#endregion
}
