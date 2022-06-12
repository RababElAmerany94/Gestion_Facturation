import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { ISourceDuLead } from '../../source-du-lead';

@Component({
    selector: 'kt-edit-source-du-lead',
    templateUrl: './edit-source-du-lead.component.html'
})
export class EditSourceDuLeadComponent implements OnInit {

    form: FormGroup;
    mode = ModeEnum.Add;
    modeShow: boolean;
    title: string;

    constructor(
        public dialogRef: MatDialogRef<EditSourceDuLeadComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            sourceDuLead?: ISourceDuLead
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
        if (this.data.sourceDuLead != null) {
            this.setDataInForm(this.data.sourceDuLead);
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
    setDataInForm(sourceDuLead: ISourceDuLead) {
        this.form.setValue({
            name: sourceDuLead.name,
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
                return 'SOURCE_DU_LEAD.ADD_TITLE';

            case ModeEnum.Edit:
                return 'SOURCE_DU_LEAD.EDIT_TITLE';

            case ModeEnum.Show:
                return 'SOURCE_DU_LEAD.SHOW_TITLE';
        }
    }
}
