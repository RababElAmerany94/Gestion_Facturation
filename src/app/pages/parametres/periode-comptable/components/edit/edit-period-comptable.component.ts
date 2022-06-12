import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'app/core/layout/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IPeriodeComptable } from '../../period-comptable.model';
import { DateHelper } from 'app/core/helpers/date';

@Component({
    selector: 'kt-edit',
    templateUrl: './edit-period-comptable.component.html'
})
export class EditPeriodComptableComponent implements OnInit {

    periodComtable: any;
    /**
     * form group
     */
    form: FormGroup;

    /**
     * mode of dialog
     */
    mode = ModeEnum.Add;

    /**
     * title of dialog
     */
    title: string;

    constructor(
        public dialogRef: MatDialogRef<EditPeriodComptableComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            periodComptable?: IPeriodeComptable
        }
    ) { }

    ngOnInit(): void {
        this.setPeriodComptable();
        this.form = this.data.form;
        this.mode = this.data.mode;

        if (this.data.periodComptable != null) {
            this.setDataInForm(this.data.periodComptable);
        }

        if (this.data.mode === ModeEnum.Show) {
            this.form.disable();
        } else {
            this.form.enable();
        }

        this.title = this.getTitle();
    }

    /**
     * set data in form
     */
    setDataInForm(periodComptable: IPeriodeComptable) {
        this.form.get('dateDebut').setValue(periodComptable.dateDebut);
        this.form.get('period').setValue(periodComptable.period);
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            values.dateDebut = DateHelper.formatDate(values.dateDebut.toString()) as any;
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * get titles translated
     */
    getTitle() {
        switch (this.mode) {
            case ModeEnum.Add:
                return 'PERIOD_COMPTABLE.ADD_TITLE';

            case ModeEnum.Edit:
                return 'PERIOD_COMPTABLE.EDIT_TITLE';
        }
    }

    setPeriodComptable() {
        this.periodComtable = [
            {
                value: 12,
                text: '12'
            },
            {
                value: 16,
                text: '16'
            }
        ];
    }
}
