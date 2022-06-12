import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';
import { IHistorique } from 'app/core/models/general/historique';
import { IAgence } from '../agences/agence.model';

export interface IFournisseur {
    id: string;
    reference: string;
    raisonSociale: string;
    historique: IHistorique[];
    webSite: string;
    codeComptable: string;
    siret: string;
    phoneNumber: string;
    email: string;
    addresses: Address[];
    contacts: Contact[];

    /** the agence associate with devis */
    agence: IAgence;

    /** the agence id associate with devis */
    agenceId: string;
}

export interface IFournisseurModel {
    reference: string;
    raisonSociale: string;
    webSite: string;
    codeComptable: string;
    siret: string;
    phoneNumber: string;
    email: string;
    addresses: Address[];
    contacts: Contact[];

    /** the agence id associate with devis */
    agenceId: string;
}

export interface IFournisseurDataTables {
    id: string;
    reference: string;
    raisonSociale: string;
}
