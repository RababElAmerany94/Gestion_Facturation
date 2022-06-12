import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { NumberHelper } from 'app/core/helpers/number';
import { ModeEnum } from 'app/core/enums/mode.enum';

@Component({
    selector: 'kt-base-edit-produits',
    template: ''
})
export class BaseEditComponent {

    /**
     * mode of component
     */
    @Input() mode: ModeEnum;


    /**
     * cancel event
     */
    @Output() cancelEvent = new EventEmitter();

    constructor(
        @Inject(CalculationToken) protected calculation: ICalculation
    ) { }

    /**
     * the form group
     */
    @Input() form: FormGroup;

    /**
     * subscribe change prix HT
     */
    subscribePrixHt() {
        const prix = this.calculation.priceTTC(this.getPrixHT(), this.getTva());
        this.form.get('prixTTC').setValue(NumberHelper.roundingNumber(prix));
    }

    /**
     * subscribe change prix TTC
     */
    subscribePrixTTC() {
        const prix = this.calculation.priceHT(this.getPrixTTC(), this.getTva());
        this.form.get('prixHT').setValue(NumberHelper.roundingNumber(prix));
    }

    /**
     * subscribe change prix TVA
     */
    subscribePrixTVA() {
        const prixTTC = this.calculation.priceTTC(this.getPrixHT(), this.getTva());
        this.form.get('prixTTC').setValue(prixTTC);
    }

    /**
     * get TVA from FORM
     */
    getTva() {
        const tva = this.form.get('tva').value;
        return NumberHelper.stringToFloat(tva);
    }


    /**
     * get prix TTC from FORM
     */
    getPrixTTC() {
        const prixTTC = this.form.get('prixTTC').value;
        return NumberHelper.stringToFloat(prixTTC);
    }

    /**
     * get prix HT from FORM
     */
    getPrixHT() {
        const prixHT = this.form.get('prixHT').value;
        return NumberHelper.stringToFloat(prixHT);
    }

    /**
     * cancel action
     */
    cancel() {
        this.cancelEvent.emit();
    }


    // #region view helpers
    isShowMode = () => this.mode === ModeEnum.Show;
    isEditMode = () => this.mode === ModeEnum.Edit;
    isAddMode = () => this.mode === ModeEnum.Add;
    // #endregion
}
