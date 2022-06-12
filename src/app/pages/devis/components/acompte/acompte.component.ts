import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { FactureType } from 'app/core/enums/facture-type.enum';
import { MontantType } from 'app/core/enums/montant-type.enum';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { NumberHelper } from 'app/core/helpers/number';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IFactureDevis } from 'app/pages/facture/facture.model';
import { IDevis } from '../../devis.model';

@Component({
    selector: 'kt-acompte',
    templateUrl: './acompte.component.html'
})
export class AcompteComponent implements OnInit {

    form: FormGroup;

    devis: IDevis;
    montantTypes: IDropDownItem<number, string>[] = [];

    color: ThemePalette = 'primary';
    mode: ProgressBarMode = 'determinate';

    ancienAvancement = 0.0;
    nouveauAvancement = 0.0;

    ancienAvancementPercent = 0.0;
    nouveauAvancementPercent = 0.0;

    factureType = FactureType.Acompte;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService,
        private dialogRef: MatDialogRef<AcompteComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            devis: IDevis
        },
        @Inject(CalculationToken) private calculation: ICalculation
    ) {
        this.devis = this.data.devis;
        this.ancienAvancement = this.calculation.sumFactureDevis(this.devis.factures, this.devis.totalTTC);
        this.ancienAvancementPercent = this.calculation.calculatePercent(this.ancienAvancement, this.devis.totalTTC);
        this.initializeForm();
    }

    ngOnInit(): void {
        this.getMontantType();
    }

    /**
     * init form
     */
    initializeForm() {
        this.form = this.fb.group({
            montant: [null, [Validators.required]],
            montantType: [MontantType.Currency, [Validators.required]],
        }, {
            validator: this.checkValidMontant('montant', 'montantType')
        });
    }

    checkValidMontant(montant: string, montantType: string) {
        return (formGroup: FormGroup) => {
            const montantControl = formGroup.controls[montant];
            const montantTypeControl = formGroup.controls[montantType];

            if (montantControl.errors && !montantControl.errors.checkValidAmount) {
                return;
            }

            const newFactureDevis: IFactureDevis = {
                montant: parseFloat(montantControl.value),
                montantType: montantTypeControl.value,
                devisId: this.devis.id,
                factureId: null,
                devis: null,
                facture: null,
                createdOn: new Date()
            };
            this.nouveauAvancement = this.calculation.sumFactureDevis([...this.devis.factures, newFactureDevis], this.devis.totalTTC);
            this.nouveauAvancementPercent = this.calculation.calculatePercent(this.nouveauAvancement, this.devis.totalTTC)

            if (NumberHelper.roundingNumber(this.devis.totalTTC) < NumberHelper.roundingNumber(this.nouveauAvancement)) {
                montantControl.setErrors({ checkValidAmount: true });
            } else {
                montantControl.setErrors(null);
            }
        }
    }

    /**
     * get remise as IDropDown
     */
    getMontantType() {
        this.montantTypes = [
            { value: MontantType.Currency, text: AppSettings.CURRENCY },
            { value: MontantType.Percent, text: '%' }
        ];
    }

    /** transfer devis to facture */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.dialogRef.close({ ...values, type: this.factureType });
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

}
