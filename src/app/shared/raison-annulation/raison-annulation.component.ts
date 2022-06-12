import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'kt-raison-annulation',
    templateUrl: './raison-annulation.component.html'
})
export class RaisonAnnulationComponent {

    /** the form group */
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<RaisonAnnulationComponent>,
    ) {
        this.initializeForm();
    }

    //#region forms

    initializeForm() {
        this.form = this.fb.group({
            raisonAnnulation: [null, [Validators.required]],
        });
    }

    //#endregion

    //#region save changes

    /**
     * save choices
     */
    async save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
        }
    }

    //#endregion
}
