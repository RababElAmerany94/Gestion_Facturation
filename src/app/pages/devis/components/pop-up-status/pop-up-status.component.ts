import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'kt-pop-up-status',
    templateUrl: './pop-up-status.component.html',
})
export class PopUpStatusComponent {

    /** form group */
    form: FormGroup;

    /** status of devis */
    isSigne: boolean;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<PopUpStatusComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            isSigne: boolean
        }
    ) {
        this.isSigne = this.data.isSigne;
        this.initializeForm();
    }
    /**
     * init form
     */
    initializeForm() {
        if (this.isSigne) {
            this.form = this.fb.group({
                dateSignature: [null, [Validators.required]],
            });
        } else {
            this.form = this.fb.group({
                raisonPerdue: [null, [Validators.required]],
            });
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
        }
    }
}
