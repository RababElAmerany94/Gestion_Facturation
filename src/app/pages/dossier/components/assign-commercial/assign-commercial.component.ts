import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DateHelper } from 'app/core/helpers/date';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { ICommercialPlanning } from 'app/pages/users/user.model';
import { CommercialsPlanningComponent } from 'app/shared/commercials-planning/commercials-planning.component';
import { CheckUserAssignedSameDateAndHourFilterOption } from '../../../../core/models/general/filter-option.model';
import { DossierService } from '../../dossier.service';
import { ToastService } from 'app/core/layout/services/toast.service';

@Component({
    selector: 'kt-assign-commercial',
    templateUrl: './assign-commercial.component.html'
})
export class AssignCommercialComponent {

    /** the form group */
    form: FormGroup;

    /** the date of rdv */
    dateRDV: Date = new Date();

    /** the select commercial planning */
    selectedCommercialPlanning: ICommercialPlanning;

    constructor(
        private fb: FormBuilder,
        private dossierService: DossierService,
        private matDialog: MatDialog,
        private dialogRef: MatDialogRef<AssignCommercialComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { dateRDV: Date, commercialId: string, dossierId: string },
        private translate: TranslateService,
        private toastService: ToastService,
    ) {
        this.initializeForm();
        this.initComponent();
        this.subscribeChangesDateRDV();
    }

    //#region init component

    /**
     * initialize component
     */
    initComponent() {
        if (this.data != null && (this.data.dateRDV != null || this.data.commercialId != null)) {
            this.form.setValue({
                dateRDV: this.data.dateRDV,
                commercialId: this.data.commercialId,
            });
            this.dateRDV = this.data.dateRDV;
        } else {
            this.form.get('dateRDV').setValue(new Date());
        }
    }

    //#endregion

    //#region forms

    initializeForm() {
        this.form = this.fb.group({
            dateRDV: [this.dateRDV, [Validators.required]],
            commercialId: [null, [Validators.required]]
        });
    }

    //#endregion

    //#region view setter and getter

    /**
     * set commercial planning
     */
    setCommercialPlanning(commercialPlanning: ICommercialPlanning) {
        this.selectedCommercialPlanning = commercialPlanning;
    }

    /**
     * subscribe changes of control date RDV
     */
    subscribeChangesDateRDV() {
        this.form.get('dateRDV').valueChanges.pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(result => {
                this.dateRDV = result;
                this.selectedCommercialPlanning = null;
                this.form.get('commercialId').setValue(null);
            });
    }

    //#endregion

    //#region save changes

    /**
     * save choices
     */
    async save() {
        if (this.form.valid) {
            const filterOption: CheckUserAssignedSameDateAndHourFilterOption = {
                dateRdv: DateHelper.formatDateTime(this.form.get('dateRDV').value),
                userId: this.form.get('commercialId').value,
                excludeDossierId: this.data.dossierId
            }
            this.checkUserAssignedSameDateAndHour(filterOption, () => {
                const data = {
                    commercialId: filterOption.userId,
                    dateRDV: filterOption.dateRdv
                };
                this.dialogRef.close(data);
            });
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    //#endregion

    //#region dialogs

    /**
     * open commercial planning details
     */
    openCommercialPlanningDetails() {
        if (this.dateRDV == null) { return; }
        const data = { dateRDV: this.dateRDV };
        DialogHelper.openDialog(this.matDialog, CommercialsPlanningComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.selectedCommercialPlanning = result as ICommercialPlanning;
                    this.form.get('commercialId').setValue(this.selectedCommercialPlanning.id);
                }
            });
    }

    /**
     * check user already assigned to another dossier in the same date and hour
     */
    checkUserAssignedSameDateAndHour(filterOption: CheckUserAssignedSameDateAndHourFilterOption, success: () => void): void {
        this.dossierService.CheckUserAssignedSameDateAndHour(filterOption).subscribe(result => {
            if (result.value) {
                DialogHelper.openConfirmDialog(this.matDialog, {
                    header: this.translate.instant('LABELS.CONFIRMATION'),
                    message: this.translate.instant('CHECK_USER_ASSIGNED_SAME_DATE_AND_HOUR.QUESTION'),
                    cancel: this.translate.instant('LABELS.CANCEL'),
                    confirm: this.translate.instant('LABELS.CONFIRM')
                }, () => {
                    success();
                });
            } else {
                success();
            }
        });
    }

    //#endregion

}
