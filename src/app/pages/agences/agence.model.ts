import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';
import { IHistorique } from 'app/core/models/general/historique';
import { Memo } from 'app/core/models/general/memo.model';
import { IUser } from '../users/user.model';

/**
 * an interface describe agence
 */
export interface IAgence {

    /**
     * the id of agence
     */
    id: string;

    /**
     * reference agence
     */
    reference: string;

    /**
     * raison sociale of agence
     */
    raisonSociale: string;

    /**
     * format juridique of agence
     */
    formeJuridique: string;

    /**
     * the capital of agence
     */
    capital: string;

    /**
     * the numero TVA intra
     */
    numeroTvaINTRA: string;

    /**
     * siret of agence
     */
    siret: string;

    /**
     * email of agence
     */
    email: string;

    /**
     * phone number of agence
     */
    phoneNumber: string;

    /**
     * code comptable of agence
     */
    codeComptable: string;

    /**
     * date start activity
     */
    dateDebutActivite: Date;

    /**
     * date end activity
     */
    dateFinActivite: Date;

    /**
     * the isActive of agence
     */
    isActive: boolean;

    /**
     * the address of facturation
     */
    adressesFacturation: Address[];

    /**
     * the address of livraison
     */
    adressesLivraison: Address[];

    /**
     * the contacts of agence
     */
    contacts: Contact[];

    /**
     * history of agence
     */
    historique: IHistorique[];

    /**
     * the regulation mode of agence
     */
    regulationModeId: number;

    /**
     * the memos of agence
     */
    memos: Memo[];

    /**
     * the user information of agence
     */
    agenceLogin: IUser;
}

/**
 * an interface describe agence model
 */
export interface IAgenceModel {

    /**
     * reference agence
     */
    reference: string;

    /**
     * raison sociale of agence
     */
    raisonSociale: string;

    /**
     * format juridique of agence
     */
    formeJuridique: string;

    /**
     * the capital of agence
     */
    capital: string;

    /**
     * the numero TVA intra
     */
    numeroTvaINTRA: string;

    /**
     * siret of agence
     */
    siret: string;

    /**
     * email of agence
     */
    email: string;

    /**
     * phone number of agence
     */
    phoneNumber: string;

    /**
     * accounting code of agence
     */
    codeComptable: string;

    /**
     * date start acivity of agence
     */
    dateDebutActivite: Date;

    /**
     * date end acivity of agence
     */
    dateFinActivite: Date;

    /**
     * the isActive of agence
     */
    isActive: boolean;

    /**
     * the address of facturation
     */
    adressesFacturation: Address[];

    /**
     * the address of livraison
     */
    adressesLivraison: Address[];

    /**
     * the contacts of agence
     */
    contacts: Contact[];

    /**
     * the regulation mode of agence
     */
    regulationModeId?: number;

}

/**
 * an interface describe agence dataTables
 */
export interface IAgenceDataTables {

    /**
     * the id of agence
     */
    id: string;

    /**
     * reference agence
     */
    reference: string;

    /**
     * raison sociale of agence
     */
    raisonSociale: string;

    /**
     * email of agence
     */
    email: string;

    /**
     * phone number of agence
     */
    phoneNumber: string;

    /**
     * date start acivity of agence
     */
    dateDebutActivite: Date;

    /**
     * the name of city facturation
     */
    city: string;

    /**
     * the name of departement facturation
     */
    departement: string;

    /**
     * the isActive of agence
     */
    isActive: boolean;
}

/**
 * an interface describe change activate agence model
 */
export interface IChangeActivateAgenceModel {

    /**
     * the id of agence
     */
    id: string;

    /**
     * is the agence active
     */
    isActive: boolean;
}
