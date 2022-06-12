import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { IPaiement, IPaiementModel } from '../../paiement.model';

@Component({
    selector: 'kt-paiement-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditTemplateComponent<IPaiementModel> {

    @Input()
    set Paiement(value: IPaiement) {
        if (value != null) {
            this.paiement = value;
            this.relatedDocs = value.documentAssociates;
            this.setData(this.paiement);
        }
    }

    /** paiement */
    paiement: IPaiement;

    constructor(
        private translate: TranslateService) {
        super();
    }

    /** set data to paiement */
    setData(paiement: IPaiement) {
        this.form.patchValue({
            montant: paiement.montant,
            bankAccountId: paiement.bankAccount != null ? paiement.bankAccount.name : '',
            datePaiement: paiement.datePaiement,
            regulationModeId: paiement.regulationMode != null ? paiement.regulationMode.name : '',
            description: paiement.description,
            type: this.translate.instant(`PAIEMENT_TYPE.${paiement.type}`)
        });
    }
}
