import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { SimplePaiementComponent } from './simple-paiement/simple-paiement.component';
import { RouteName } from 'app/core/enums/route-name.enum';
import { IFacturePaiment, IPaiementModel } from 'app/pages/paiement/paiement.model';
import { NumberHelper } from 'app/core/helpers/number';
import { PaiementByAvoirComponent } from './paiement-by-avoir/paiement-by-avoir.component';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { IFacture } from '../../facture.model';
import { PaimentType } from 'app/core/enums/paiment-type.enum';
import { FactureStatus } from 'app/core/enums/facture-status.enum';
import { CalculationToken } from 'app/core/helpers/calculation/icalculation';
import { Calculation } from 'app/core/helpers/calculation/calculation';

@Component({
    selector: 'kt-paiement-add',
    templateUrl: './paiement.component.html'
})
export class PaiementComponent {

    @Output()
    addPaiementOperation = new EventEmitter<IPaiementModel>();

    @Output()
    deletePaiementOperation = new EventEmitter<{ paiementModelId: number, factureId: string }>();

    @Output()
    editPaiementOperation = new EventEmitter<{ paiementModel: IPaiementModel, facturePaiementId: number }>();

    @Input()
    set Facture(value: IFacture) {
        if (value != null) {
            this.facture = value;
            this.setData(this.facture);
        }
    }

    /**
     * the current facture
     */
    facture: IFacture;

    /**
     * enum define type of paiement
     */
    paimentType: typeof PaimentType = PaimentType;

    /** form */
    form: FormGroup;

    /**
     * enum define facture status
     */
    factureStatus: typeof FactureStatus = FactureStatus;

    constructor(
        @Inject(CalculationToken) private calculation: Calculation,
        private fb: FormBuilder,
        private matDialog: MatDialog,
        private router: Router,
        private translate: TranslateService,
        private dialogMat: MatDialog) {
        this.initializeForm();
        this.form.disable();
    }

    /**
     * initialize form
     */
    initializeForm() {
        this.form = this.fb.group({
            reference: [null],
            montant: [null],
            dateEcheance: [null],
            restToPaye: [null],
        });
    }

    //#region event

    /**
     * add paiement
     */
    addPaiementEvent() {
        const data = {
            title: 'ADD.AJOUTER_PAIEMENT',
            facture: this.facture,
            indexModified: null
        };
        DialogHelper.openDialog(this.dialogMat, SimplePaiementComponent, DialogHelper.SIZE_SMALL, data).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addPaiementOperation.emit(result);
            }
        });
    }

    /**
     * edit paiement
     */
    editPaiementEvent(index: number) {
        const indexModified = index;
        const data = {
            indexModified,
            title: 'EDIT.EDIT_PAIEMENT',
            facture: this.facture,
        };
        DialogHelper.openDialog(this.dialogMat, SimplePaiementComponent, DialogHelper.SIZE_SMALL, data).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editPaiementOperation.emit({ paiementModel: result.paiementModel, facturePaiementId: result.idFacturePaiement });
            }
        });
    }

    /**
     * add paiement by avoir
     */
    addPaiemetByAvoirEvent() {
        const restToPaye = this.calculation.restPayerFacture(this.facture);
        const data = {
            restToPaye,
            facture: this.facture,
            title: 'ADD.PAIEMENT_BY_AVOIR',
        };
        DialogHelper.openDialog(this.dialogMat, PaiementByAvoirComponent, DialogHelper.SIZE_MEDIUM, data).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addPaiementOperation.emit(result);
            }
        });
    }

    /**
     * delete paiement event
     */
    deletePaiementEvent(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('PAYMENT.DELETE.HEADER'),
            message: this.translate.instant('PAYMENT.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            const paiement = this.facture.facturePaiements[id].paiement;
            this.deletePaiementOperation.emit({ paiementModelId: paiement.id, factureId: this.facture.id });
        });
    }

    /** set data in form */
    setData(facture: IFacture) {
        const restToPaye = NumberHelper.roundingNumber(this.calculation.restPayerFacture(this.facture));
        this.form.setValue({
            reference: facture.reference,
            montant: NumberHelper.formatNumberPrice(facture.totalTTC),
            dateEcheance: facture.dateEcheance,
            restToPaye: NumberHelper.formatNumberPrice(restToPaye)
        });
    }

    //#endregion

    //#region helpers

    canAddPaiement() {
        if (this.facture == null) { return false; }
        return (this.facture?.status === FactureStatus.ENCOURS || this.facture?.status === FactureStatus.ENRETARD);
    }

    canEditPaiement = (item: IFacturePaiment) => item.paiement?.type === PaimentType.PAYER && item.paiement.avoirId == null;

    goToPaiement(id: string) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                mode: ModeEnum.Show,
                id
            }
        };
        this.router.navigate([`/${RouteName.Paiement}`], navigationExtras);
    }
    //#endregion

}
