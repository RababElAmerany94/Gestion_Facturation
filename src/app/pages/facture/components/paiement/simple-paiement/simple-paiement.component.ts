import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Calculation } from 'app/core/helpers/calculation/calculation';
import { CalculationToken } from 'app/core/helpers/calculation/icalculation';
import { IFacture } from 'app/pages/facture/facture.model';
import { StringHelper } from 'app/core/helpers/string';
import { Constants } from 'app/core/constants/msg-code';
import { NumberHelper } from 'app/core/helpers/number';
import { IPaiementModel } from 'app/pages/paiement/paiement.model';
import { UserHelper } from 'app/core/helpers/user';
import { DateHelper } from 'app/core/helpers/date';
import { FormHelper } from 'app/core/helpers/form';
import { PaimentType } from 'app/core/enums/paiment-type.enum';

@Component({
    selector: 'kt-simple-paiement',
    templateUrl: './simple-paiement.component.html'
})
export class SimplePaiementComponent implements OnInit {

    /** form group */
    form: FormGroup;

    /** show bank account */
    showBankAccount = true;

    /** facture */
    facture: IFacture;
    /**
     * the index of modified paiement
     */
    indexModified: number;
    /** title */
    title: string;

    constructor(
        public dialogRef: MatDialogRef<SimplePaiementComponent>,
        private toastService: ToastService,
        private fb: FormBuilder,
        private translate: TranslateService,
        @Inject(CalculationToken) private calculation: Calculation,
        @Inject(MAT_DIALOG_DATA) public data: {
            facture: IFacture,
            indexModified: number,
            title: string
        }) {
        this.initializeForm();
        this.initializeData();
    }

    ngOnInit() {
        this.subscribeFormRegulation();
    }
    /** initialize data */
    initializeData() {
        if (this.data) {
            this.facture = this.data.facture;
            this.title = this.data.title;
            this.indexModified = this.data.indexModified;
            if (this.indexModified != null) {
                this.setDataForm();
            } else {
                this.initializeMontantDesc();
            }
        }
    }

    /** regultaion change */
    subscribeFormRegulation() {
        this.form.controls.regulationModeId.valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(value => {
            if (!StringHelper.isEmptyOrNull(value) && value === Constants.RegulationModeAvoirId) {
                this.showBankAccount = false;
                FormHelper.updateFormControlValidation(this.form, [], 'bankAccountId');
            } else {
                this.showBankAccount = true;
                FormHelper.updateFormControlValidation(this.form, [Validators.required], 'bankAccountId');
            }
        });
    }

    //#region form

    initializeForm() {
        this.form = this.fb.group({
            montant: [null, [Validators.required], this.checkValidAmount.bind(this)],
            bankAccountId: [null, [Validators.required]],
            datePaiement: [null, [Validators.required]],
            regulationModeId: [null, [Validators.required]],
            description: [null],
            createAvoir: [false]
        });
    }

    /** check valid amount */
    checkValidAmount(control: FormControl) {
        const montant = parseFloat(control.value);
        if (montant > 0) {
            const promise = new Promise((resolve, reject) => {
                const restPayer = this.getRestToPay();
                if (NumberHelper.roundingNumber(montant) <= NumberHelper.roundingNumber(restPayer)) {
                    resolve(null);
                } else {
                    resolve({ checkValidAmount: true });
                }
            });
            return promise;
        } else {
            return new Promise((resolve, reject) => { resolve({ checkValidAmount: true }); });
        }
    }

    /**
     * get rest to pay
     */
    getRestToPay() {
        if (this.facture != null) {
            const montantPaimentModified = this.indexModified != null ? this.facture.facturePaiements[this.indexModified].montant : 0;
            const restToPay = montantPaimentModified + this.calculation.restPayerFacture(this.facture);
            const roundingAmount = NumberHelper.roundingNumber(restToPay);
            return roundingAmount;
        }
    }

    /**
     * set initial montant  data in the form control
     */
    initializeMontantDesc() {
        this.form.get('montant').setValue(this.getRestToPay());
        this.form.get('description').setValue('Paiement facture N° ' + this.facture.reference);
        this.form.get('datePaiement').setValue(new Date());
    }
    //#endregion

    //#region  add /edit/ setData paiement

    /** add paiement */
    addPaiement() {
        if (this.form.valid) {
            const paiementModel: IPaiementModel = {
                ...this.form.value,
                agenceId: UserHelper.getAgenceId(),
                type: this.showBankAccount ? PaimentType.PAYER : PaimentType.BY_AVOIR,
                createAvoir: !this.showBankAccount,
                bankAccountId: !this.showBankAccount ? null : this.form.controls.bankAccountId.value,
                datePaiement: DateHelper.formatDate(this.form.controls.datePaiement.value),
                facturePaiements: [
                    {
                        factureId: this.facture.id,
                        montant: this.form.controls.montant.value
                    }
                ]
            };
            this.dialogRef.close(paiementModel);
        } else {
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /** edit paiement */
    editPaiement() {
        if (this.form.valid) {

            const facturePaiment = this.facture.facturePaiements[this.indexModified];
            const paiementModel: IPaiementModel = {
                ...this.form.value,
                ...facturePaiment.paiement,
                montant: this.form.controls.montant.value,
                createAvoir: !this.showBankAccount,
                bankAccountId: !this.showBankAccount ? null : this.form.controls.bankAccountId.value,
                type: this.showBankAccount ? PaimentType.PAYER : PaimentType.BY_AVOIR,
                datePaiement: DateHelper.formatDate(this.form.controls.datePaiement.value),
                facturePaiements: [
                    {
                        id: facturePaiment.id,
                        factureId: this.facture.id,
                        montant: this.form.controls.montant.value
                    }
                ]
            }
            this.dialogRef.close({ paiementModel, idFacturePaiement: facturePaiment.paiement.id });

        } else {
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * set data edit form
     */
    setDataForm() {
        const facturePaiment = this.facture.facturePaiements[this.indexModified];
        this.form.setValue({
            montant: facturePaiment.montant,
            bankAccountId: facturePaiment.paiement.bankAccountId == null ? null : facturePaiment.paiement.bankAccountId,
            datePaiement: facturePaiment.paiement.datePaiement,
            regulationModeId: facturePaiment.paiement.regulationModeId,
            description: facturePaiment.paiement.description,
            createAvoir: false,
        });
    }

    //#endregion
}
