import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Address } from 'app/core/models/general/address.model';

@Component({
    selector: 'kt-add-address',
    templateUrl: './add-address.component.html'
})
export class AddAddressComponent implements OnInit {

    /** form group of address attributes */
    form: FormGroup;

    /** the title of modal */
    title: string;

    /** show checkbox is default address */
    showIsDefault = true;

    constructor(
        public dialogRef: MatDialogRef<AddAddressComponent>,
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string,
            showIsDefault: boolean,
            address?: Address
        }
    ) {
        this.form = this.fb.group({
            adresse: [null, [Validators.required]],
            complementAdresse: [null],
            departement: [null],
            ville: [null, Validators.required],
            codePostal: [null],
            pays: [null],
            isDefault: [null],
        });
    }

    ngOnInit(): void {
        this.initialization();
    }

    initialization() {
        this.title = this.data.title;
        this.showIsDefault = this.data.showIsDefault;
        if (this.data.address != null) {
            this.setDataInForm(this.data.address);
        }
    }

    setDataInForm(address: Address) {
        this.form.setValue({
            adresse: address.adresse,
            complementAdresse: address.complementAdresse,
            departement: address.departement,
            ville: address.ville,
            codePostal: address.codePostal,
            pays: address.pays,
            isDefault: address.isDefault
        });
    }

    /** save Address */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

}
