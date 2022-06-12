import { IAgence } from '../../agences/agence.model';
import { IUser } from '../../users/user.model';

/** an interface describe an accounting period */
export interface IPeriodeComptable {
    // the id of accounting period
    id: string;

    // start date of accounting period
    dateDebut: Date;

    // period of accounting period (12,16 months)
    period: number;

    // closing date of accounting period
    dateCloture?: Date;

    // is the accounting period closed
    isClose: boolean;

    // the id of the agence of this accounting period
    agenceId?: string;

    // the agence of this accounting period
    agence: IAgence;

    // the id of the user of this accounting period
    userId?: string;

    // the user associate of this accounting period
    user: IUser;
}


/** an interface describe accounting period model */
export interface IPeriodeComptableModel {
    // start date of accounting period
    dateDebut: Date;

    // period of accounting period (12,16 months)
    period: number;

    // the id of the agence of this accounting period
    agenceId?: string;
}
