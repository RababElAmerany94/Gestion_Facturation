import { SmsType } from 'app/core/enums/sms-type.enum';
import { IClient } from 'app/pages/clients/client.model';
import { IDossier } from 'app/pages/dossier/dossier.model';

export interface ISms {
    numeroTelephone: string;
    message: string;
    isBloquer: boolean;
    date: string;
    type: SmsType;
    externalId: string;
    smsEnvoyeId: string;
    smsEnvoye: ISms;
    clientId: string;
    client: IClient;
    dossierId: string;
    dossier: IDossier;
    reponses: ISms[];
}

export interface ISmsModel {
    id: string;
    numeroTelephone: string;
    message: string;
    isBloquer: boolean;
    date: string;
    type: SmsType;
    externalId: string;
    smsEnvoyeId: string;
    smsEnvoye: ISmsModel;
    clientId: string;
    client: IClient;
    dossierId: string;
    dossier: IDossier;
    reponses: ISmsModel[];
}

export interface IEnvoyerSmsModel {
    clientId: string;
    dossierId: string;
    numeroTelephone: string;
    message: string;
}

export interface ISmsDataTables {
    id: string;
    numeroTelephone: string;
    message: string;
    isBloquer: string;
    date: string;
    reponses: number;
}
