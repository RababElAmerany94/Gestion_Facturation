import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { IRegulationModeModel } from 'app/core/models/regulation-mode/regulation-mode.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'app/core/layout/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'kt-edit-regulation',
    templateUrl: './edit-regulation.component.html'
})
export class EditRegulationComponent implements OnInit {
    form: FormGroup;
    mode: ModeEnum;
    title: string;
    modeReglementModel: IRegulationModeModel;
    constructor(
        public dialogRef: MatDialogRef<EditRegulationComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            form: FormGroup,
            mode: ModeEnum,
            modeReglement: IRegulationModeModel
        }
    ) {
    }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        if (this.data.modeReglement != null) {
            this.modeReglementModel = this.data.modeReglement;
            this.setDataInForm(this.data.modeReglement);
        }
        this.title = this.getTitle();
    }

    /**
     * title
     */
    getTitle() {
        switch (this.mode) {
            case ModeEnum.Add:
                return 'MODE_REGLEMENT.ADD_TITLE';

            case ModeEnum.Edit:
                return 'MODE_REGLEMENT.EDIT_TITLE';
        }
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.getRawValue());
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * setData form
     */
    setDataInForm(modeReglement) {
        this.form.setValue({
            name: modeReglement.name,
            isModify: modeReglement.isModify
        });
    }
}
