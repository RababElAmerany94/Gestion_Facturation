import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'app/core/layout/services/toast.service';

@Component({
    selector: 'kt-mouvement-compte-acompte',
    templateUrl: './mouvement-compte-acompte.component.html'
})
export class MouvementCompteACompteComponent implements OnInit {

    form: FormGroup;
    title: string;
    constructor(
        public dialogRef: MatDialogRef<MouvementCompteACompteComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        public data: {
        }
    ) {

    }
    ngOnInit() {
        this.InitialiseForm();
    }
    InitialiseForm() {
        this.form = this.fb.group({
            compteDebitId: [null, [Validators.required]],
            creditCompteId: [null, [Validators.required]],
            montant: [null, [Validators.required]],
            description: [null]
        });
    }
    /**
     * save form
     */
    save() {
        if (this.form.valid) {
            const formValues = this.form.value;
            // if the debit and credit account are the same
            if (formValues.creditCompteId === formValues.compteDebitId) {
                this.toastService.error(this.translate.instant('ERRORS.CHOOSE_DIFFERENT_ACCOUNT'));
                return;
            }
            this.dialogRef.close(formValues);

        } else {
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }
}
