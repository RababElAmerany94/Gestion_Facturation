import { IAgence } from '../../agences/agence.model';
import { BankAccountType } from 'app/core/enums/bank-account.enum';
export interface IBankAccount {

    id: string;

    /**
     * name compte
     */
    name: string;

    /**
     * code comptable
     */

    codeComptable: string;

    /**
     * type compte bancaire
     */

    type: BankAccountType;

    /**
     *  is this account modify
     */

    isModify: boolean;

    /**
     *  the id of agence involved with this account
     */

    agenceId?: string;

    /**
     * the agence involved with this account
     */
    agence: IAgence;
}

export interface IBankAccountModel {

    /**
     * name compte
     */
    name: string;

    /**
     * code comptable
     */

    codeComptable: string;

    /**
     * type compte bancaire
     */

    type: BankAccountType;

    /**
     *  is this account modify
     */

    isModify: boolean;

    /**
     * the agence id
     */
    agenceId?: string;
}

/**
 * interface describe bank account table
 */
export interface IBankAccountDataTables {
    /**
     * id banq account
     */
    id: string;
    /**
     * name compte
     */
    name: string;

    /**
     * code comptable
     */

    codeComptable: string;

    /**
     * type compte bancaire
     */
    type: string;

    /**
     *  is this account modify
     */
    isModify: boolean;
}
