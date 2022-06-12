import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Address } from 'app/core/models/general/address.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'kt-add-address-dropdown',
    templateUrl: './add-address-dropdown.component.html'
})
export class AddAddressDropdownComponent implements OnInit {

    adresses: Address[] = [];
    adresse: Address;
    formAddress: FormGroup;

    constructor(
        private dialogRef: MatDialogRef<AddAddressDropdownComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {
            adresse: Address[],
        }) { }

    ngOnInit(): void {
        this.adresses = this.data.adresse;
        this.formAddress = this.fb.group({
            adresse: [null],
        });
    }
    setAddress(adresse: Address) {
        if (adresse != null)
            this.adresse = adresse;
    }
    save() {
        this.dialogRef.close(this.adresse);
    }
}
