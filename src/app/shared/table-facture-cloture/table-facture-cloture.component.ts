import { Component, Input, Inject, EventEmitter, Output } from '@angular/core';
import { IFactureDevis } from 'app/pages/facture/facture.model';
import { MontantType } from 'app/core/enums/montant-type.enum';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { IFactureClotureComponentOutput } from 'app/core/models/general/facture-cloture-component-output.model';
import { FactureHelper } from 'app/pages/facture/facture-helper';

@Component({
    selector: 'kt-table-facture-cloture',
    templateUrl: './table-facture-cloture.component.html',
    styles: []
})
export class TableFactureClotureComponent {

    @Output()
    resultEvent = new EventEmitter<IFactureClotureComponentOutput>();

    @Input()
    set factureDevis(value: IFactureDevis[]) {
        if (value != null) {
            this._factureDevis = value
                .sort((a, b) => a.createdOn > b.createdOn ? 1 : -1);
            this._result = FactureHelper
                .calculateFactureCloture(this.calculation, value);
            this.resultEvent.emit(this._result);
        }
    }

    _factureDevis: IFactureDevis[] = [];
    _result: IFactureClotureComponentOutput;

    constructor(
        @Inject(CalculationToken)
        private calculation: ICalculation
    ) { }

    getPercentDevisFacture(factureDevis: IFactureDevis) {
        if (factureDevis == null) return 0;
        if (factureDevis.montantType === MontantType.Currency)
            return this.calculation.calculatePercent(factureDevis.montant, factureDevis.devis.totalTTC);
        return factureDevis.montant;
    }

}
