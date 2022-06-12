import { JsonHelper } from './json';
import { StringHelper } from './string';
import { Contact } from '../models/contacts/contact';
import { Address } from '../models/general/address.model';

export class AddressAndContactHelper {

    static getAddress(addresses: string) {
        const address = (JsonHelper.IsJsonString(addresses)
            && !StringHelper.isEmptyOrNull(addresses)) ? JSON.parse(addresses) as Address : null;
        return address;
    }

    static getContact(contact: string) {
        const contacts = (JsonHelper.IsJsonString(contact)
            && !StringHelper.isEmptyOrNull(contact)) ? JSON.parse(contact) as Contact : null;
        return contacts;
    }

    /**
     * build phrase base to contact object
     */
    static buildPhraseContact(contact: Contact) {
        if (contact == null) { return ''; }
        return `${contact.civilite} ${contact.nom} ${contact.prenom}`;
    }
}
