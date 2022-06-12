import { IBankAccount } from '../parametres/bank-account/bank-account.model';
import { PaimentType } from 'app/core/enums/paiment-type.enum';
import { IRegulationMode } from 'app/core/models/regulation-mode/regulation-mode.model';
import { IFacture } from '../facture/facture.model';
import { IAvoir } from '../avoir/avoir.model';
import { IAgence } from '../agences/agence.model';
import { IDocumentAssociate } from 'app/core/models/general/documentAssociate.model';
import { IHistorique } from 'app/core/models/general/historique';

/** an interface describe payment */
export interface IPaiement {

    /** the id of paiement */
    id: string;

    /** the type of paiement */
    type: PaimentType;

    /** the amount of  */
    montant: number;

    /** the date of paiement */
    datePaiement: Date;

    /** the description paiement */
    description: string;

    /** the history of paiement */
    historique: IHistorique[];

    /** is this facture comptabilise */
    comptabilise: true;

    /** the id of bank associate with this paiement */
    bankAccountId: string;

    /** the bank associate with this paiement */
    bankAccount: IBankAccount;

    /** the id of regulation mode associate with this payment  */
    regulationModeId?: string;

    /** the regulation mode associate with this payment  */
    regulationMode: IRegulationMode;

    /** the id of avoir associate with this payment  */
    avoirId?: string;

    /** the id of avoir associate with this payment  */
    avoir: IAvoir;

    /** the id of agence associate with this payment */
    agenceId: string;

    /** the agence associate this payment */
    agence: IAgence;

    /** list of facture paiements */
    facturePaiements: IFacturePaiment[];

    /** the list of document associate with this avoir */
    documentAssociates: IDocumentAssociate[];
}
export interface IPaiementModel {

    /** the type of paiement */
    type: PaimentType;

    /** the amount of  */
    montant: number;

    /** the date of paiement */
    datePaiement: Date;

    /** the description paiement */
    description: string;

    /** the id of bank associate with this paiement */
    bankAccountId?: string;

    /** the id of regulation mode associate with this payment  */
    regulationModeId: string;

    /** the id of avoir associate with this payment  */
    avoirId?: string;

    /** possiblity of create avoir with payment */
    createAvoir: boolean;

    /** the id of agence associate with this payment */
    agenceId: string;

    /** list of facture paiements */
    facturePaiements: IFacturePaiment[];
}

/** a class describe facture payment */
export interface IFacturePaiment {

    /**
     * the id of facture payment
     */
    id?: string;

    /** the amount of facture payment */
    montant: number;

    /** the id of payment of facture payment */
    paiementId?: string;

    /** the payment of facture payment */
    paiement?: IPaiement;

    /** the id of facture of facture payment */
    factureId: string;

    /** the facture of facture payment */

    facture?: IFacture;
}

export interface IPaiementDataTables {

    /** id of payement */
    id: string;

    /** description */
    description: string;

    /** the id of bank associate with this paiement */
    bankAccountId: string;

    /** the regulation mode associate with this payment  */
    regulationModeId?: string;

    /** type of paiement */
    type: string;

    /** the amount of  */
    montant: number;

    /** the date of paiement */
    datePaiement: Date;

    /** has delete action */
    hasDeleteAction: boolean;
}
export interface IPaiementGroupeObligeModel {

    /** the date Paiement with this payment  */
    datePaiement: string;

    /** the description with this payment  */
    description: string;

    /** the bank Account Id with this payment  */
    bankAccountId?: string;

    /** the regulation Mode Id with this payment  */
    regulationModeId: string;

    /** the fiche Paiement with this payment  */
    fichePaiement: string;

    /** the prime Cee Id with this payment  */
    primeCeeId: string;
}
