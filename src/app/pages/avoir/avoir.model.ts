import { AvoirCreateType } from 'app/core/enums/avoir-create-type.enum';
import { AvoirStatus } from 'app/core/enums/avoir-status.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { IClient } from '../clients/client.model';
import { IFacture } from '../facture/facture.model';
import { IDocumentAssociate } from 'app/core/models/general/documentAssociate.model';
import { IAgence } from '../agences/agence.model';
import { IArticle } from 'app/core/models/general/article.model';
import { IMailHistoryModel } from 'app/core/models/general/mail.model';
import { Memo } from 'app/core/models/general/memo.model';
import { IHistorique } from 'app/core/models/general/historique';

/** an interface describe avoir */
export interface IAvoir {

    /** the id of avoir */
    id: string;

    /** the status of avoir */
    status: AvoirStatus;

    /** the reference of avoir */
    reference: string;

    /** the date of creation of avoir */
    dateCreation: Date;

    /** the deadline date of avoir */
    dateEcheance: Date;

    /** the article of avoir in format JSON */
    articles: IArticle[];

    /** the object of avoir */
    objet: string;

    /** is this avoir accounting */
    comptabilise: boolean;

    /** the condition regelement of avoir */
    reglementCondition: string;

    /** the note of avoir */
    note: string;

    /** the current counter of avoir */
    counter: number;

    /** the total HT of avoir */
    totalHT: number;

    /** the total TTC of avoir */
    totalTTC: number;

    /** the remise of avoir */
    remise: number;

    /** the remise type of avoir */
    remiseType: RemiseType;

    /** the history of avoir in format JSON */
    historique: IHistorique[];

    /** the list of memos in format JSON */
    memos: Memo[];

    /** the list of email in format JSON */
    emails: IMailHistoryModel[];

    /** the client id associate with this avoir */
    clientId?: string;

    /** the client associate with this avoir */
    client: IClient;

    /** the type creation of avoir (independent or payment) */
    type: AvoirCreateType;

    /** the id of facture associate with this avoir */
    factureId?: string;

    /** the facture associate with this avoir */
    facture: IFacture;

    /** the id of agence */
    agenceId: string;

    /** the agence of this avoirs */
    agence: IAgence;

    /** the list of document associate with this avoir */
    documentAssociates: IDocumentAssociate[];
}

export interface IAvoirModel {

    /** the status of avoir */
    status: AvoirStatus;

    /** the type creation of avoir (independent or payment) */
    type: AvoirCreateType;

    /** the reference of avoir */
    reference: string;

    /** the date of creation of avoir */
    dateCreation: Date;

    /** the deadline date of avoir */
    dateEcheance: Date;

    /** the article of avoir in format JSON */
    articles: IArticle[];

    /** the object of avoir */
    objet: string;

    /** the condition regelement of avoir */
    reglementCondition: string;

    /** the note of avoir */
    note: string;

    /** the current counter of avoir */
    counter: number;

    /** the total HT of avoir */
    totalHT: number;

    /** the total TTC of avoir */
    totalTTC: number;

    /** the remise of avoir */
    remise: number;

    /** the remise type of avoir */
    remiseType: RemiseType;

    /** the client id associate with this avoir */
    clientId?: string;

    /** the id of agence */
    agenceId: string;

    /** the list of document associate with this avoir */
    documentAssociates: IDocumentAssociate[];
}

/** an interface describe avoir dataTables */
export interface IAvoirDataTables {

    /** the id of avoir */
    id: string;

    /** the status of avoir */
    status: number;

    /** the reference of avoir */
    reference: string;

    /** the client name */
    clientId: string;

    /** the date of creation of avoir */
    dateCreation: Date;

    /** the deadline date of avoir */
    dateEcheance: Date;

    /** the total TTC of avoir */
    totalTTC: number;

    /** is this avoir has possibility to modify */
    isModify: boolean;
}
