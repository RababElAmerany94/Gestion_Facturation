import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IPrixParQuantite } from 'app/core/models/general/prix-par-quantite.model';

@Component({
  selector: 'kt-add-prix-par-quantite',
  templateUrl: './add-prix-par-quantite.component.html'
})
export class AddPrixParQuantiteComponent {

  /**
   * list prix par quantite
   */
  prices: IPrixParQuantite[] = [];

  /**
   * the index of edit prix par quantite
   */
  indexEditElement: number;

  /**
   * the form group
   */
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { list: IPrixParQuantite[], indexEditElement?: number },
    private dialogRef: MatDialogRef<AddPrixParQuantiteComponent>
  ) {
    this.initializationForm();
    this.initializationComponent();
  }

  /**
   * initialization of form
   */
  initializationForm() {
    this.form = this.fb.group({
      prix: [null, [Validators.required]],
      quantiteMinimal: [null, [Validators.required]],
      quantiteMaximal: [null, [Validators.required]],
    });
  }

  /**
   * initialization component
   */
  initializationComponent() {
    this.prices = this.data.list;
    if (this.data.indexEditElement != null) {
      this.indexEditElement = this.data.indexEditElement;
      this.setDataInForm(this.indexEditElement);
    }
  }

  setDataInForm(indexEditElement: number) {
    const prixParQuantite = this.prices[indexEditElement];
    this.form.setValue(prixParQuantite);
  }

  /**
   * save form
   */
  save() {
    if (this.form.valid) {

      const prixParQuantite: IPrixParQuantite = {
        prix: parseFloat(this.form.value.prix),
        quantiteMaximal: parseFloat(this.form.value.quantiteMaximal),
        quantiteMinimal: parseFloat(this.form.value.quantiteMinimal)
      };

      if (!this.checkQuantityValid(prixParQuantite)) {
        this.toastService.error(this.translate.instant('ERRORS.QUANTITY_MINIMAL_SUPERIOR'));
        return;
      }

      if (this.checkInvalidInterval(prixParQuantite)) {
        this.toastService.error(this.translate.instant('ERRORS.INTERVAL_QUANTITY_INCORRECT'));
        return;
      }

      this.dialogRef.close(prixParQuantite);

    } else {
      this.form.markAllAsTouched();
      this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
    }
  }

  /**
   * check is quantity minimal inferior then quantity maximal
   */
  checkQuantityValid(prixParQuantite: IPrixParQuantite) {
    return prixParQuantite.quantiteMaximal > prixParQuantite.quantiteMinimal;
  }

  /**
   * check current prix par quantite doesn't to another interval
   */
  checkInvalidInterval(prixParQuantite: IPrixParQuantite) {
    const prixParQuantites = this.prices;

    // remove edit element
    if (this.indexEditElement != null) { prixParQuantites.splice(this.indexEditElement, 1); }

    return prixParQuantites.filter(e =>
      (e.quantiteMinimal < prixParQuantite.quantiteMinimal && prixParQuantite.quantiteMinimal < e.quantiteMaximal) ||
      (e.quantiteMinimal < prixParQuantite.quantiteMaximal && prixParQuantite.quantiteMaximal < e.quantiteMaximal)
    ).length > 0;
  }

  /**
   * get title translate
   */
  getTitle() {
    if (this.indexEditElement != null) {
      return 'PRIX_PAR_QUANTITE.EDIT_TITLE';
    } else {
      return 'PRIX_PAR_QUANTITE.ADD_TITLE';
    }
  }

}
