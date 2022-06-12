import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { ITypeLogement } from '../../type-logement.model';

@Component({
    selector: 'kt-edit-type-logement',
    templateUrl: './edit-type-logement.component.html',
})
export class EditTypeLogementComponent implements OnInit {

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
        public dialogRef: MatDialogRef<EditTypeLogementComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            typeLogement?: ITypeLogement
        }
    ) { }

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
        if (this.data.typeLogement != null) {
            this.setDataInForm(this.data.typeLogement);
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
    setDataInForm(typeLogement: ITypeLogement) {
        this.form.setValue({
            name: typeLogement.name,
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
                return 'TYPE_LOGEMENT.ADD_TITLE';

            case ModeEnum.Edit:
                return 'TYPE_LOGEMENT.EDIT_TITLE';

            case ModeEnum.Show:
                return 'TYPE_LOGEMENT.SHOW_TITLE';
        }
    }

}
