import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Contact, IContactModel } from 'app/core/models/contacts/contact';
import { JsonHelper } from 'app/core/helpers/json';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from 'app/shared/contacts/add-contact/add-contact.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { AddressAndContactHelper } from 'app/core/helpers/addressAndContact';
import { ArrayHelper } from 'app/core/helpers/array';

@Component({
    selector: 'kt-contact-dropdown',
    template: `
        <mat-form-field appearance="fill"class="example-full-width" >
            <mat-label>{{label}}</mat-label>
            <mat-select [id]="'select-contact'"
                        ngDefaultControl
                        name="index"
                        [disabled]="readOnly"
                        [(ngModel)]="index"
                        [ngModelOptions]="{standalone: true}"
                        (selectionChange)="changeSelect($event.value)" >
                <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
                <mat-option *ngFor="let item of contacts;let i=index" [value]="i">
                    {{ buildPhraseContact(item)}}
                </mat-option>
            </mat-select>
            <button mat-icon-button
                    ktDebounceClick
                    matSuffix
                    *ngIf="!readOnly"
                    (debounceClick)="addContactDialog($event)"
                    [matTooltip]="'LABELS.ADD' | translate" >
                <mat-icon>add</mat-icon>
            </button>
        </mat-form-field>
    `
})
export class ContactDropdownComponent {

    /** emit change selection */
    @Output()
    changeEvent = new EventEmitter<Contact>();

    /** the label of form */
    @Input()
    label: string;

    /** set contact format JSON */
    @Input()
    set Contact(contact: Contact[]) {
        if (!ArrayHelper.isEmptyOrNull(contact)) {
            this.contacts = contact;
        }
    }

    @Input()
    set SelectContact(value: Contact) {
        if (value != null) {
            this.selectContact(value);
        }
    }

    /** is the mode readOnly */
    @Input()
    readOnly = false;

    /** the list of contact */
    contacts: Contact[] = [];

    /** index of contact */
    index: number;

    constructor(
        private dialog: MatDialog
    ) {
    }

    /**
     * build phrase base to contact object
     */
    buildPhraseContact(contact: Contact) {
        return AddressAndContactHelper.buildPhraseContact(contact);
    }

    /**
     * change selection
     */
    changeSelect(index: number) {
        this.changeEvent.emit(this.contacts[index]);
    }

    /**
     * open add contact dialog
     */
    addContactDialog(event): void {
        event.stopPropagation();
        const data = { title: 'CONTACTS.TITLE', showIsDefault: false, showNew: true };
        DialogHelper.openDialog(this.dialog, AddContactComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    const contactModel: IContactModel = result as IContactModel;
                    contactModel.isNew = true;
                    this.contacts.push(contactModel);
                    this.index = this.contacts.length - 1;
                    this.changeSelect(this.index);
                }
            });
    }

    /**
     * select contact
     * @param contact the contact to select
     */
    selectContact(contact: Contact) {
        const contactIndex = this.contacts.findIndex(e =>
            e.nom === contact.nom &&
            e.email === contact.email &&
            e.prenom === contact.prenom &&
            e.civilite === contact.civilite);

        if (contactIndex > 0) {
            this.index = contactIndex;

        } else if (contactIndex === -1) {
            if (contact.civilite != null) {
                this.contacts.push(contact);
                this.index = this.contacts.length - 1;
            }
        } else {
            this.index = this.contacts.length - 1;
        }
    }
}
