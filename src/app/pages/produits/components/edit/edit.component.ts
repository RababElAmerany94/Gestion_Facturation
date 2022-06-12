import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IPrixParQuantite } from 'app/core/models/general/prix-par-quantite.model';
import { SubSink } from 'subsink';
import { IProduit, IProduitModel } from '../../produits.model';
import { BaseEditComponent } from '../base-edit/base-edit.component';

@Component({
    selector: 'kt-produits-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent {

    subs = new SubSink();

    /**
     * set produit
     */
    @Input() set Produit(val: IProduit) {
        this.form.reset();
        if (val != null) {
            this.setProduitsInForm(val);
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    /**
     * add event
     */
    @Output() addEvent = new EventEmitter<IProduitModel>();

    /**
     * edit event
     */
    @Output() editEvent = new EventEmitter<IProduitModel>();

    /**
     * the prix par tranches
     */
    prixParTranches: IPrixParQuantite[] = [];

    /**
     * the labels
     */
    labels: string[] = [];

    constructor(
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(CalculationToken) protected calculation: ICalculation
    ) {
        super(calculation);
    }

    /**
     * save agence
     */
    save() {
        if (this.form.valid) {
            if (this.isEditMode()) {
                this.editEvent.emit(this.buildProduitsObject());
            } else {
                this.addEvent.emit(this.buildProduitsObject());
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * build agence object
     */
    buildProduitsObject(): IProduitModel {
        const produit: IProduitModel = { ...this.form.getRawValue() };
        produit.labels = this.labels;
        produit.prixParTranche = this.prixParTranches;
        if (produit.isPublic == null) {
            produit.isPublic = false;
        }
        return produit;
    }

    /**
     * set produit in form
     */
    setProduitsInForm(produit: IProduit) {
        this.form.setValue({
            reference: produit.reference,
            prixAchat: produit.prixAchat,
            prixHT: produit.prixHT,
            tva: produit.tva,
            designation: produit.designation,
            description: produit.description,
            unite: produit.unite,
            isPublic: produit.isPublic,
            fournisseurId: produit.fournisseurId,
            prixTTC: this.calculation.priceTTC(produit.prixHT, produit.tva),
            categoryId: produit.categoryId,
            labels: '',
        });

        this.labels = produit.labels;
        this.prixParTranches = produit.prixParTranche;

    }

    /**
     * set tags
     */
    setTags(tags: string[]) {
        this.labels = tags;
    }

    /**
     * set prix par tranches
     */
    setPrixParTranches(prixParQuantite: IPrixParQuantite[]) {
        this.prixParTranches = prixParQuantite;
    }

}
