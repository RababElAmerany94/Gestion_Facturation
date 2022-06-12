import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Contact } from './../../../core/models/contacts/contact';

@Component({
    selector: 'kt-add-contact-dropdown',
    templateUrl: './add-contact-dropdown.component.html'
})
export class AddContactDropdownComponent implements OnInit {

    /** the contact */
    contacts: Contact[] = [];

    /** the contact */
    contact: Contact;

    constructor(
        private dialogRef: MatDialogRef<AddContactDropdownComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            contacts: Contact[],
        }) { }

    ngOnInit(): void {
        this.contacts = this.data.contacts;
    }

    /**
     * set contact
     */
    setContact(contact: Contact) {
        if (contact != null)
            this.contact = contact;
    }

    /**
     * save contact
     */
    save() {
        this.dialogRef.close(this.contact);
    }

}
