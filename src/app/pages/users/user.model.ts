import { IHistorique } from 'app/core/models/general/historique';
import { Memo } from 'app/core/models/general/memo.model';
import { IAgence } from '../agences/agence.model';

/**
 * a interface describe IUser
 */
export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    userName: string;
    isActive: boolean;
    lastConnection?: Date;
    registrationNumber: string;
    historique: IHistorique[];
    agenceId?: string;
    roleId: number;
    agenceLogin?: IAgence;
    agence?: IAgence;
    createdOn: Date;
    memos: Memo[];
}

export interface IUserModel {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userName: string;
    password: string;
    isActive: boolean;
    registrationNumber: string;
    agenceId?: string;
    roleId: number;
}

export interface IUserDataTables {
    id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    roleId: string;
    lastConnection: Date;
    email: string;
    phoneNumber: string;
    userName: string;
    createdOn: Date;
}

export interface ILoginCreateModel {
    id: string;
    userName: string;
    password: string;
    isActive: boolean;
}

export interface IUserLogin {
    id: string;
    userName: string;
    isActive: boolean;
}

/**
 * a model that describe the Updating password Requirements
 */
export interface UserUpdatePasswordModel {

    /** the id of the user we want to update the id for it */
    userId: string;

    /** the new password */
    newPassword: string;
}

/**
 * a model that describe the updating userName
 */
export interface UserUpdateUsernameModel {

    /** the id of the user we want to update the id for it */
    userId: string;

    /** the userName of user */
    userName: string;

}

/**
 * user lite information
 */
export interface IUserLiteModel {

    /** the id of user */
    id: string;

    /** the first name of user */
    firstName: string;

    /** the last name of user */
    lastName: string;

    /** the userName of user  */
    userName: string;

    /** the full name of user */
    fullName: string;
}

/**
 * an interface describe commercial planning model
 */
export interface ICommercialPlanning {

    /** the id of commercial */
    id: string;

    /** the first name of commercial */
    firstName: string;

    /** the last name of commercial */
    lastName: string;

    /** the full name of commercial */
    fullName: string;

    /** the list of dossier */
    dossiers: IDossierCommercialPlanning[];
}

/**
 * an interface describe dossier associate with commercial
 */
export interface IDossierCommercialPlanning {

    /** the id of dossier */
    id: string;

    /** the date of rdv */
    dateRDV: string;

    /** the client id */
    clientId: string;

    /** the client addresses */
    siteIntervention: string;

    /** the client contact */
    contact: string;

    /** the client first name */
    clientFirstName: string;

    /** the client last name */
    clientLastName: string;

    /** the isActive of agence */
    isActive: boolean;
}

/**
 * an interface describe change activate user model
 */
export interface IChangeActivateUserModel {

    /**
     * the id of user
     */
    id: string;

    /**
     * is the user active
     */
    isActive: boolean;
}
