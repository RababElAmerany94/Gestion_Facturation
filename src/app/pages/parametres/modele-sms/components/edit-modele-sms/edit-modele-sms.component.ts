import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from './../../../../../core/layout/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IModeleSMS } from './../../modele-sms.model';
import { ModeEnum } from './../../../../../core/enums/mode.enum';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'kt-edit-modele-sms',
    templateUrl: './edit-modele-sms.component.html'
})
export class EditModeleSmsComponent implements OnInit {

    /**
     * the form group
     */
    form: FormGroup;

    /**
     * mode of dialog
     */
    mode = ModeEnum.Add;

    /**
     * mode show of dialog
     */
    modeShow: boolean;

    /**
     * title of dialog
     */
    title: string;

    constructor(
        public dialogRef: MatDialogRef<EditModeleSmsComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            modeleSMS?: IModeleSMS
        }
    ) {
    }

    ngOnInit(): void {
        this.initComponent();
    }

    /**
     * initialize component
     */
    initComponent() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        this.title = this.getTitle();
        this.initForm();
    }

    /**
     * init form
     */
    initForm() {
        if (this.data.modeleSMS != null) {
            this.setDataInForm(this.data.modeleSMS);
        }
        if (this.data.mode === ModeEnum.Show) {
            this.modeShow = true;
            this.form.disable();
        } else {
            this.modeShow = false;
            this.form.enable();
        }
    }

    /**
     * set data in form
     */
    setDataInForm(modeleSMS: IModeleSMS) {
        this.form.setValue({
            name: modeleSMS.name,
            text: modeleSMS.text,
        });
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
     * get titles translated
     */
    getTitle() {
        switch (this.mode) {
            case ModeEnum.Add:
                return 'MODELE_SMS.ADD_TITLE';

            case ModeEnum.Edit:
                return 'MODELE_SMS.EDIT_TITLE';

            case ModeEnum.Show:
                return 'MODELE_SMS.SHOW_TITLE';
        }
    }

}
