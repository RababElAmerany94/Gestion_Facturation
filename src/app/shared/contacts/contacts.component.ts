import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ObjectHelper } from 'app/core/helpers/object';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { AddContactComponent } from 'app/shared';
import { Contact } from './../../core/models/contacts/contact';
import { IContactModel } from '../../core/models/contacts/contact';
import { AddContactDropdownComponent } from './add-contact-dropdown/add-contact-dropdown.component';
import { IClient } from './../../pages/clients/client.model';

@Component({
    selector: 'kt-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: []
})
export class ContactsComponent implements OnInit {

    // output list contacts
    @Output()
    changeContact = new EventEmitter();

    // List des contacts
    @Input()
    contacts: IContactModel[] = [];

    // the mode of component
    @Input()
    mode: ModeEnum;

    // the agenda component
    @Input()
    isForAgenda: false;

    // the client component
    @Input()
    isForClient: false;

    // the agenda component
    @Input()
    client: IClient;

    // the enumeration of modes
    modes: typeof ModeEnum = ModeEnum;

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private translationService: TranslationService) {
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    /**
     * add contact dialog contact
     */
    addContactDialog(): void {
        const dialogRef = this.dialog.open(AddContactComponent, {
            width: DialogHelper.SIZE_MEDIUM,
            data: {
                title: 'CONTACTS.ADDCONTACT',
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                if (result.isDefault) {
                    this.updateIsDefaultContact();
                }
                if (ObjectHelper.isNullOrUndefined(this.contacts) || this.contacts.length === 0) {
                    result.isDefault = true;
                }
                this.contacts.push(result);
                this.emitChange();
            }
        });
    }

    /**
     * add contact dialog contact + dropdown
     */
    addContactDialogDropdown(): void {
        const dialogRef = this.dialog.open(AddContactDropdownComponent, {
            width: DialogHelper.SIZE_MEDIUM,
            data: {
                contacts: this.client.contacts,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                if (result.isDefault) {
                    this.updateIsDefaultContact();
                }
                if (ObjectHelper.isNullOrUndefined(this.contacts) || this.contacts.length === 0) {
                    result.isDefault = true;
                }
                this.contacts.push(result);
                this.emitChange();
            }
        });
    }

    addContactClient() {
        const dialogRef = this.dialog.open(AddContactComponent, {
            width: DialogHelper.SIZE_MEDIUM,
            data: {
                title: 'CONTACTS.ADDCONTACT',
                formClient: this.client
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                if (result.isDefault) {
                    this.updateIsDefaultContact();
                }
                if (ObjectHelper.isNullOrUndefined(this.contacts) || this.contacts.length === 0) {
                    result.isDefault = true;
                }
                this.contacts.push(result);
                this.emitChange();
            }
        });
    }

    /**
     * open edit address dialog
     * @param index the index of edit contact
     */
    editContactDialog(index: number) {
        const contact: Contact = this.contacts[index];
        const dialogRef = this.dialog.open(AddContactComponent, {
            width: DialogHelper.SIZE_MEDIUM,
            data: {
                contact,
                title: 'CONTACTS.EDIT_CONTACT',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.isDefault) { this.updateIsDefaultContact(); }
                this.contacts[index] = result;
                this.emitChange();
            }
        });
    }

    /**
     * delete contact
     * @param contactIndex the index of contact we want to delete
     */
    deleteContacts(contactIndex: number) {
        DialogHelper.openConfirmDialog(this.dialog, {
            header: this.translate.instant('CONTACTS.DELETE.HEADER_TEXT'),
            message: this.translate.instant('CONTACTS.DELETE.QUESTION'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.contacts.splice(contactIndex, 1);
            this.emitChange();
        });
    }

    /**
     * emit changes
     */
    emitChange() {
        this.changeContact.emit(this.contacts);
    }

    updateIsDefaultContact() {
        if (!ObjectHelper.isNullOrUndefined(this.contacts)) {
            this.contacts.map(e => e.isDefault = false);
        }
    }

}
