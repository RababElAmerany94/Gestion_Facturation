import { EchangeCommercialPriority } from './../../core/enums/echange-commercial-priority.enum';
import { EchangeCommercialType } from './../../core/enums/echange-commercial-type.enum';
import { IAgence } from './../agences/agence.model';
import { IAgendaConfig } from 'app/pages/parametres/agenda-config/agenda-config.model';
import { IUser } from 'app/pages/users/user.model';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { IClient } from 'app/pages/clients/client.model';
import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';
import { IHistorique } from 'app/core/models/general/historique';
import { Memo } from 'app/core/models/general/memo.model';
import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';

/**
 * a interface describe IEchangeCommercial
 */
export interface IEchangeCommercial {

    /** the id of echange commercial */
    id: string;

    /** titre of echange commercial */
    titre: string;

    /** description of echange commercial */
    description: string;

    /** the date of echange commercial */
    dateEvent: Date;

    /** the duree of echange commercial */
    duree: string;

    /** the hour of echange commercial */
    time: string;

    /** the type of echange commercial */
    type: EchangeCommercialType;

    /** the status of echange commercial */
    status: EchangeCommercialStatus;

    /** the priority of echange commercial */
    priorite: EchangeCommercialPriority;

    /** phone number of agence */
    phoneNumber: string;

    /** the contacts of echange commercial */
    contacts: Contact[];

    /** the contacts of echange commercial */
    addresses: Address[];

    /** the memos of echange commercial */
    memos: Memo[];

    /** the historique of echange commercial */
    historique: IHistorique[];

    /** the id of tache of echange commercial */
    tacheTypeId: string;

    /** the id of tache of echange commercial */
    tacheType: IAgendaConfig;

    /** the id of rdv of echange commercial */
    rdvTypeId: string;

    /** the rdv of echange commercial */
    rdvType: IAgendaConfig;

    /** the categorie of echange commercial */
    categorieId: string;

    /** the categorie of echange commercial */
    categorie: IAgendaConfig;

    /** the id of appel of echange commercial */
    typeAppelId: string;

    /** the id of appel of echange commercial */
    typeAppel: IAgendaConfig;

    /** the id of source RDV of echange commercial */
    sourceRDVId: string;

    /** the id of source RDV of echange commercial */
    sourceRDV: IAgendaConfig;

    /** the client of this echange commercial */
    client: IClient;

    /** the id of the client of this echange commercial */
    clientId: string;

    /** the dossier of this echange commercial */
    dossier: IDossier;

    /** the id of dossier */
    dossierId: string;

    /** the id of agence */
    agenceId: string;

    /** the agence of this echange commercial */
    agence: IAgence;

    /** the id of User */
    responsable: IUser;

    /** the id of responsable */
    responsableId: string;
}

/**
 * a interface describe IEchangeCommercial model
 */
export interface IEchangeCommercialModel {

    /** titre of echange commercial */
    titre: string;

    /** description of echange commercial */
    description: string;

    /** the date of echange commercial */
    dateEvent: Date;

    /** the duree of echange commercial */
    duree: string;

    /** the hour of echange commercial */
    time: string;

    /** the type of echange commercial */
    type: EchangeCommercialType;

    /** the status of echange commercial */
    status: EchangeCommercialStatus;

    /** the priority of echange commercial */
    priorite: EchangeCommercialPriority;

    /** phone number of echange commercial */
    phoneNumber: string;

    /** the contacts of echange commercial */
    contacts: Contact[];

    /** the contacts of echange commercial */
    addresses: Address[];

    /** the memos of echange commercial */
    memos: Memo[];

    /** the historique of echange commercial */
    historique: IHistorique[];

    /** the id of tache of echange commercial */
    tacheTypeId: string;

    /** the id of rdv of echange commercial */
    rdvTypeId: string;

    /** the id of appel of echange commercial */
    typeAppelId: string;

    /** the categorie of echange commercial */
    categorieId: string;

    /** the id of source RDV of echange commercial */
    sourceRDVId: string;

    /** the id of the client of this echange commercial */
    clientId: string;

    /** the id of dossier */
    dossierId: string;

    /** the id of agence */
    agenceId: string;

    /** the id of responsable */
    responsableId: string;
}

/**
 * a interface describe IEchangeCommercial data table
 */
export interface IEchangeCommercialDataTables {

    /** the id of dossier */
    id: string;

    /** the id of the client of this echange commercial */
    clientId: string;

    /** the type of echange commercial */
    type: string;

    /** the type of echange commercial */
    status: EchangeCommercialStatus;

    /** the id of responsable/user */
    responsableId: string;

    /** titre of echange commercial */
    titre: string;

    /** description of echange commercial */
    description: string;

    /** the date of echange commercial */
    dateEvent: Date;

    /** the adresse of echange commercial */
    adresse: string;

    /** the contact of echange commercial */
    contact: string;

    /** phone number of echange commercial */
    phoneNumber: string;
}

/** an interface describe IChange Date Event Model */
export interface IChangeDateEventModel {
    id: string | number;
    dateEvent: string;
    time?: string;
    duree?: string;
}

/** an interface describe Type and date in agenda to add it */
export interface IAgendaModel {

    /** the Type of echange commercial */
    type?: EchangeCommercialType;

    /** date of agenda model */
    dateEvent?: string;

    /** the id of echange commercial */
    id?: string | number;

    /** is add it from agenda */
    isFromAgenda?: boolean;

}

/** an interface describe RDV if that exist */
export interface ICheckRdvIsExistModel {
    dateEvent: string;
    time: string | null;
    responsableId: string;
    clientId: string;
}
