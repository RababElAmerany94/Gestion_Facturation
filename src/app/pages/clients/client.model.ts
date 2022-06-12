import { IUser, IUserLiteModel } from '../users/user.model';
import { IAgence } from '../agences/agence.model';
import { TypeTravaux } from 'app/core/enums/type-travaux.enum';
import { PrecariteType } from 'app/core/enums/precarite.enums';
import { ClientType } from 'app/core/enums/client-type.enum';
import { IRegulationMode } from 'app/core/models/regulation-mode/regulation-mode.model';
import { IDossier } from '../dossier/dossier.model';
import { GenreClient } from 'app/core/enums/genre-client.enum';
import { ITypeLogement } from '../parametres/type-logement/type-logement.model';
import { ITypeChauffage } from '../parametres/type-chauffage/type-chauffage.model';
import { ISms } from 'app/shared/sms/sms.model';
import { IClientRelation, IClientRelationModel } from 'app/core/models/general/client-relation.model';
import { Memo } from 'app/core/models/general/memo.model';
import { IHistorique } from 'app/core/models/general/historique';
import { Address } from 'app/core/models/general/address.model';
import { Contact } from 'app/core/models/contacts/contact';
import { ISourceDuLead } from '../parametres/source-du-lead/source-du-lead';

/**
 * an interface describe IClient
 */
export interface IClient {

    /** the id of client */
    id: string;

    /** the origine of client */
    origin: string;

    /** the reference of client */
    reference: string;

    /** the firstName of client */
    firstName: string;

    /** the lastName of client */
    lastName: string;

    /** the fullName of client */
    fullName: string;

    /** the type of client */
    type: ClientType;

    /** the genre of client */
    genre: GenreClient;

    /** the id of modeRegelement of client */
    regulationModeId: string;

    /** the modeRegelement of client */
    regulationMode: IRegulationMode;

    /** the phoneNumber of client */
    phoneNumber: string;

    /** the email of client */
    email: string;

    /** the webSite of client */
    webSite: string;

    /** the Siret of client */
    siret: string;

    /** the codeComptable of client */
    codeComptable: string;

    /** the address of client */
    addresses: Address[];

    /** the contacts of client */
    contacts: Contact[];

    /** the dateReceptionLead of client */
    dateReceptionLead: Date;

    /** the id of source Lead of dossier */
    sourceLeadId: string;

    /** the source Lead of dossier */
    sourceLead: ISourceDuLead;

    /** the typeLogement of client */
    logementTypeId: string;

    /** the type logement of client */
    logementType: ITypeLogement;

    /** the parcelleCadastrale of client */
    parcelleCadastrale: string;

    /** the surfaceTraiter of client */
    surfaceTraiter?: number;

    /** the nombre Personne of client */
    nombrePersonne: number;

    /** the Is Maison De Plus De Deux Ans of client */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of client */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of client */
    revenueFiscaleReference: string;

    /** the numeroAH of client */
    numeroAH: number;

    /** the typeTravaux of client */
    typeTravaux: TypeTravaux;

    /** the historique of client */
    historique: IHistorique[];

    /** the memo of client */
    memos: Memo[];

    /** the agenceId of client */
    agenceId: string;

    /** the agenceId of client */
    agence: IAgence;

    /** the primeCEE of client */
    primeCEE: IClient;

    /** the id primeCEE of client */
    primeCEEId: string;

    /** the type Chauffage of client */
    typeChauffage: ITypeChauffage;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the client is sous traitant */
    isSousTraitant: boolean;

    /** the note of devis of client */
    noteDevis: string;

    /** the labelPrimeCEE of client */
    labelPrimeCEE: string;

    /** the relationship of client */
    relations: IClientRelation[];

    /** the sms of client */
    sms: ISms[];

    /** the list of client */
    clients: IClient[];

    /** the dossier of client */
    Dossiers: IDossier[];

    /** the commercials of client */
    commercials: IClientCommercials[];
}

/**
 * an interface describe user associate with fiche client
 */
export interface IClientCommercials {

    /** the id of association */
    id?: string;

    /** the id of user */
    commercialId: string;

    /** the user */
    commercial: IUserLiteModel;

    /** the client associate with this entity */
    clientId?: string;

    /** the client associate with this entity */
    client?: IClient;

}

/**
 * an interface describe IClientModel
 */
export interface IClientModel {

    /** the reference of client */
    reference: string;

    /** the origine of client */
    origin: string;

    /** the firstName of client */
    firstName: string;

    /** the lastName of client */
    lastName: string;

    /** the fullName of client */
    fullName: string;

    /** the Siret of client */
    siret: string;

    /** the type of client */
    type: ClientType;

    /** the genre of client */
    genre: GenreClient;

    /** the id of modeRegelement of client */
    regulationModeId: string;

    /** the phoneNumber of client */
    phoneNumber: string;

    /** the email of client */
    email: string;

    /** the webSite of client */
    webSite: string;

    /** the codeComptable of client */
    codeComptable: string;

    /** the address of client */
    addresses: Address[];

    /** the contacts of client */
    contacts: Contact[];

    /** the dateReceptionLead of client */
    dateReceptionLead: Date;

    /** the sourceLead of client */
    sourceLead: string;

    /** the typeLogement of client */
    logementTypeId: string;

    /** the type logement of client */
    logementType: ITypeLogement;

    /** the parcelleCadastrale of client */
    parcelleCadastrale: string;

    /** the surfaceTraiter of client */
    surfaceTraiter?: number;

    /** the nbPersonne of client */
    nombrePersonne: number;

    /** the isMaisonDePlusDe2Ans of client */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of client */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of client */
    revenueFiscaleReference: string;

    /** the numeroAH of client */
    numeroAH: number;

    /** the typeTravaux of client */
    typeTravaux: TypeTravaux;

    /** the id primeCEE of client */
    primeCEEId: string;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the client is sous traitant */
    isSousTraitant: boolean;

    /** the labelPrimeCEE of client */
    labelPrimeCEE: string;

    /** the relationship of client */
    relations: IClientRelationModel[];

    /** the note of devis of client */
    noteDevis: string;

    /** the agenceId of client */
    agenceId: string;

    /** the sms of client */
    sms: ISms[];

    /** the commercials of client */
    commercials: IClientCommercials[];
}

/**
 * list of client model
 */
export interface IClientListModel {

    /** the reference of client */
    reference: string;

    /** the first name of client */
    firstName: string;

    /** the last name of client */
    lastName: string;

    /** the full name of client */
    fullName: string;

    /** the type of client */
    type: ClientType;

    /** the id of agence associate with client */
    agenceId: string;

    /** the agence associate with client */
    agence: string;

    /** the label of prime CEE associate with client */
    labelPrimeCEE: string;
}

/**
 * an interface describe IClientDataTables
 */
export interface IClientDataTables {

    /** the id of client */
    id: string;

    /** the reference of client */
    reference: string;

    /** the firstName of client */
    firstName: string;

    /** the lastName of client */
    lastName: string;

    /** the agence of client */
    agenceId: string;
}
