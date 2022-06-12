import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IPrixProduitParAgence, IPrixProduitParAgenceModel } from '../../produits.model';
import { BaseEditComponent } from '../base-edit/base-edit.component';

@Component({
  selector: 'kt-edit-produits-agence',
  templateUrl: './edit-agence.component.html'
})
export class EditAgenceComponent extends BaseEditComponent {

  @Input() set PrixProduitParAgence(value: IPrixProduitParAgence) {
    if (value != null) {
      this.setDataInForm(value);
      this.isEdit = true;
    } else {
      this.form.reset();
      this.isEdit = false;
    }
    if (this.isShowMode()) { this.form.disable(); } else { this.form.enable(); }
  }

  /**
   * edit event
   */
  @Output() editEvent = new EventEmitter<IPrixProduitParAgenceModel>();

  /**
   * add event
   */
  @Output() addEvent = new EventEmitter<IPrixProduitParAgenceModel>();

  /**
   * is edit mode
   */
  isEdit = false;

  constructor(
    private toastService: ToastService,
    private translate: TranslateService,
    @Inject(CalculationToken) protected calculation: ICalculation
  ) {
    super(calculation);
  }

  /**
   * save changes
   */
  save() {
    if (this.form.valid) {
      const prixProduitAgence = { ...this.form.value };
      if (this.isEdit) {
        this.editEvent.emit(prixProduitAgence);
      } else {
        this.addEvent.emit(prixProduitAgence);
      }
    } else {
      this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
      this.form.markAllAsTouched();
    }
  }

  /**
   * set data in form
   */
  setDataInForm(prixProduitParAgence: IPrixProduitParAgence) {
    this.form.setValue({
      prixHT: prixProduitParAgence.prixHT,
      tva: prixProduitParAgence.tva,
      prixTTC: this.calculation.priceTTC(prixProduitParAgence.prixHT, prixProduitParAgence.tva),
    });
  }

}
