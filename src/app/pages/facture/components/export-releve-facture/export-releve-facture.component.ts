import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IReleveFacturesFilterOption } from 'app/core/models/general/filter-option.model';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { ReleveFactureFiltreEnum } from 'app/core/enums/Releve-Facture-filtre-type.enum';
import { ToastService } from 'app/core/layout/services/toast.service';

@Component({
    selector: 'kt-export-releve-facture',
    templateUrl: './export-releve-facture.component.html'
})
export class ExportReleveFactureComponent implements OnInit {

    /** form group */
    form: FormGroup;

    /** releve facture by filter */
    filterOption: IReleveFacturesFilterOption = {
        /** the facture unpaid */
        isUnpaid: false,

        /** include facture */
        includeFactures: false,

        /** date from */
        dateFrom: new Date(),

        /** date To */
        dateTo: new Date()
    };

    /** userRoles */
    userRole: typeof UserProfile = UserProfile;

    /** export for client  */
    forClient = true;

    /** periods */
    ReleveFactureType: IDropDownItem<number, string>[] = [];

    /** step one */
    stepOne = true;

    /**
     * step two
     */
    stepTwo: boolean;

    /**
     * step three
     */
    stepThree: boolean;

    constructor(
        public dialogRef: MatDialogRef<ExportReleveFactureComponent>,
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.InitializeForm();
        this.chargeReleveFacture();
    }

    //#region form filter

    InitializeForm() {
        this.form = this.fb.group({
            dateFrom: [null, [Validators.required]],
            dateTo: [null, [Validators.required]],
            clientId: [null],
            includeFactures: [false],
            isUnpaid: [false]
        });
    }

    //#endregion

    //#region event

    exportClick() {
        if (this.stepThree) {

            if (this.form.valid) {
                const formValue = this.form.value;
                this.filterOption.isUnpaid = formValue.isUnpaid === 0 ? true : false;
                this.filterOption.includeFactures = formValue.includeFactures;
                this.dialogRef.close(this.filterOption);

            } else {
                this.form.markAllAsTouched();
            }
        }
    }
    //#endregion

    //#region steps

    next() {
        if (this.stepOne) {
            if (this.form.valid)
                this.nextToStepTwo();
            else {
                this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
                this.form.markAllAsTouched();
            }
        } else if (this.stepTwo) {
            this.nextToStepThree();
        }

    }

    /*
     * next to step two
     */
    nextToStepTwo() {
        const formValue = this.form.value;
        if (new Date(formValue.dateFrom) > new Date(formValue.dateTo)) {
            this.toastService.warning(this.translate.instant('ERRORS.DATES_INTERVAL_INVALID'));
            return;
        }
        this.filterOption.dateFrom = this.form.controls.dateFrom.value;
        this.filterOption.dateTo = this.form.controls.dateTo.value;
        this.changeStepValue({ stepOne: false, stepTwo: true, stepThree: false });
    }

    /*
     * next to step three
     */
    nextToStepThree() {
        const formValue = this.form.value;
        this.filterOption.clientId = formValue.clientId;
        this.changeStepValue({ stepOne: false, stepTwo: false, stepThree: true });
    }

    /** change step value */
    changeStepValue(value: { stepOne: boolean, stepTwo: boolean, stepThree: boolean }) {
        this.stepOne = value.stepOne;
        this.stepTwo = value.stepTwo;
        this.stepThree = value.stepThree;
    }

    //#endregion

    //#region helper

    /** filtre facture enum  */
    chargeReleveFacture() {
        this.ReleveFactureType = ConversionHelper.convertEnumToListKeysValues(ReleveFactureFiltreEnum, 'number');
        this.ReleveFactureType.forEach(e => e.text = `RELEVE_FACTURE_TYPE.${e.value}`);
    }
    //#endregion
}
