import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { AppSettings } from '../../../app-settings/app-settings';
import { Contact } from '../../../core/models/contacts/contact';
import { ToastService } from './../../../core/layout/services/toast.service';
import { IClient } from 'app/pages/clients/client.model';

@Component({
    selector: 'kt-add-contact',
    templateUrl: './add-contact.component.html'
})
export class AddContactComponent implements OnInit {

    /** the form group */
    form: FormGroup;

    /** list civilities */
    civilites: IDropDownItem<string, string>[] = [];

    /** the current contact */
    contact: Contact;

    /** the title of popup */
    title: string;

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string,
            contact?: Contact,
            formClient?: IClient,
        },
        private dialogRef: MatDialogRef<AddContactComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
    ) {
        this.initializeForm();
        this.initializationData();
    }

    ngOnInit() {
        this.chargeDropDownCivilite();
        this.chargeContact();
    }

    /**
     * forme initialization
     */
    initializeForm() {
        this.form = this.fb.group({
            civilite: [null, [Validators.required]],
            nom: [null, [Validators.required]],
            prenom: [null, [Validators.required]],
            fonction: [null],
            email: [null, [Validators.pattern(AppSettings.regexEmail)]],
            mobile: [null, [Validators.pattern(AppSettings.regexPhone)]],
            commentaire: [null],
            isDefault: [false],
        });
    }

    /**
     * initialization data
     */
    initializationData() {
        this.title = this.title;
        this.contact = this.data.contact;
        if(this.data?.formClient?.firstName != null){
            this.form.get('nom').setValue(this.data.formClient.firstName );
        }
        if(this.data?.formClient?.lastName != null){
            this.form.get('prenom').setValue(this.data.formClient.lastName );
        }
        if(this.data?.formClient?.phoneNumber != null){
            this.form.get('mobile').setValue(this.data.formClient.phoneNumber );
        }
        if(this.data?.formClient?.email != null){
            this.form.get('email').setValue(this.data.formClient.email );
        }
    }

    /**
     * save contact
     */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * charge contact
     */
    chargeContact() {
        if (this.contact) {
            this.form.get('civilite').setValue(this.contact.civilite);
            this.form.get('nom').setValue(this.contact.nom);
            this.form.get('prenom').setValue(this.contact.prenom);
            this.form.get('fonction').setValue(this.contact.fonction);
            this.form.get('email').setValue(this.contact.email);
            this.form.get('mobile').setValue(this.contact.mobile);
            this.form.get('commentaire').setValue(this.contact.commentaire);

            setTimeout(() => {
                this.form.get('isDefault').setValue(this.contact.isDefault);
                this.contact.isDefault ? this.form.get('isDefault').disable() : this.form.get('isDefault').enable();
                this.form.get('isDefault').updateValueAndValidity();
            }, 500);
        }
    }

    /**
     * charge dropdown civilite
     */
    chargeDropDownCivilite() {
        this.civilites = [
            {
                value: '',
                text: 'CONTACTS.SELECTIONNER'
            },
            {
                value: 'M.',
                text: 'CONTACTS.MONSIEUR'
            },
            {
                value: 'Mme.',
                text: 'CONTACTS.MADAME'
            },
            {
                value: 'Mlle',
                text: 'CONTACTS.MADEMOISELLE'
            }
        ];
    }

    setPhone(item: string) {
        this.form.get('mobile').setValue(item.replace(/[^\w\s]/gi, '').replace(/\s/g, ''));
    }
}
