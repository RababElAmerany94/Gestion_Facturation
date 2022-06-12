import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITvaModel } from '../../../document-parameter.model';
import { ToastService } from 'app/core/layout/services/toast.service';

@Component({
    selector: 'kt-edit-tva',
    templateUrl: './edit-tva.component.html'
})
export class EditTvaComponent implements OnInit {

    /** form group */
    form: FormGroup;

    /** the title of modal */
    title: string;

    constructor(
        public dialogRef: MatDialogRef<EditTvaComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            list: ITvaModel
        }
    ) {
        this.form = this.fb.group({
            value: [null, [Validators.required]],
            accountingCode: [null, [Validators.required]]
        });
    }

    ngOnInit() {
        if (this.data.list != null) {
            this.setDataInForm(this.data.list);
        }
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * close modal
     */
    close() {
        this.dialogRef.close(true);
    }

    /**
     * setData form
     */
    setDataInForm(list: ITvaModel) {
        this.form.setValue({
            value: list.value,
            accountingCode: list.accountingCode
        });
    }

}
