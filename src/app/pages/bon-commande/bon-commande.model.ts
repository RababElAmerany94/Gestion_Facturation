import { BonCommandeStatus } from 'app/core/enums/bon-commande-status.enum';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { Address } from 'app/core/models/general/address.model';
import { IArticle } from 'app/core/models/general/article.model';
import { IDocumentAssociate } from 'app/core/models/general/documentAssociate.model';
import { IHistorique } from 'app/core/models/general/historique';
import { IMailHistoryModel } from 'app/core/models/general/mail.model';
import { IAgence } from '../agences/agence.model';
import { IClient, IClientListModel } from '../clients/client.model';
import { IDevis } from '../devis/devis.model';
import { IDossier } from '../dossier/dossier.model';
import { IUser } from '../users/user.model';

/**
 * a class describe bon commande
 */
export interface IBonCommande {

    /** the id of bon commande */
    id: string;

    /** the reference of bon commande */
    reference: string;

    /** the site intervention of bon commande */
    siteIntervention: Address;

    /** the visit date of bon commande */
    dateVisit: string;

    /** the articles of bon commande */
    articles: IArticle[];

    /** the status of bon commande */
    status: BonCommandeStatus;

    /** the type of bon commande */
    type: DevisType;

    /** the total without tax of bon commande */
    totalHT: number;

    /** the total TTC of bon commande */
    totalTTC: number;

    /** the total without tax of bon commande */
    totalReduction: number;

    /** the total paid of bon commande */
    totalPaid: number;

    /** the remise of bon de commande */
    remise: number;

    /** the remise type of bon de commande */
    remiseType: RemiseType;

    /** the raison annulation of bon commande */
    raisonAnnulation: string;

    /** date of signature of bon commande */
    dateSignature: string | null;

    /** the signature image base64 of bon commande */
    signe: string;

    /** the name of who sign bon commande */
    nameClientSignature: string;

    /** the note of bon commande */
    note: string;

    /** the historique of bon commande */
    historique: IHistorique[];

    /** the list of emails sent of this bon commande */
    emails: IMailHistoryModel[];

    /** the user id of bon commande */
    userId: string;

    /** the client id of bon commande */
    user: IUser;

    /** the client id of bon commande */
    clientId: string;

    /** the client of bon commande */
    client: IClient;

    /** the dossier id of bon commande */
    dossierId: string;

    /** the dossier of bon commande */
    dossier: IDossier;

    /** the devis id of bon commande */
    devisId: string;

    /** the dossier of devis */
    devis: IDevis;

    /** the agence who own this bon commande */
    agenceId: string;

    /** the id of agence */
    agence: IAgence;

    /** the list of documents associates */
    documentAssociates: IDocumentAssociate[];

    /* prime cee of client */
    primeCEE: IClientListModel;
}

export interface IBonCommandeModel {

    /** the reference of bon commande */
    reference: string;

    /** the site intervention of bon commande */
    siteIntervention: Address;

    /** the visit date of bon commande */
    dateVisit: string;

    /** the articles of bon commande */
    articles: IArticle[];

    /** the status of bon commande */
    status: BonCommandeStatus;

    /** the type of bon commande */
    type: DevisType;

    /** the total without tax of bon commande */
    totalHT: number;

    /** the total TTC of bon commande */
    totalTTC: number;

    /** the total without tax of bon commande */
    totalReduction: number;

    /** the total paid of bon commande */
    totalPaid: number;

    /** the remise of bon de commande */
    remise: number;

    /** the remise type of bon de commande */
    remiseType: RemiseType;

    /** the raison annulation of bon commande */
    raisonAnnulation: string;

    /** date of signature of bon commande */
    dateSignature: string | null;

    /** the signature image base64 of bon commande */
    signe: string;

    /** the name of who sign bon commande */
    nameClientSignature: string;

    /** the note of bon commande */
    note: string;

    /** the user id of bon commande */
    userId: string;

    /** the client id of bon commande */
    clientId: string;

    /** the dossier id of bon commande */
    dossierId: string;

    /** the devis id of bon commande */
    devisId: string;

    /** the agence who own this bon commande */
    agenceId: string;

}

/**
 * an interface describe bon Commande dataTable
 */
export interface IBonCommandeDataTables {

    /** the id of bonCommande */
    id: string;

    /** the reference of bonCommande */
    reference: string;

    /** date visit of bonCommande */
    dateVisit: string;

    /** the status of bonCommande */
    status: BonCommandeStatus;

    /** the client id associate with bonCommande */
    clientId: string;

    /** the type of bonCommande */
    type: string;

    /** can modify bonCommande */
    canModify: boolean;

}
