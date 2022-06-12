/**
 * a class that defines the list of history
 * MsgCode less than 100 : common
 * MsgCode >= 100  : produit
 * MsgCode >= 200  : payement
 * MsgCode >= 300  : facture
 * MsgCode >= 400  : Mail
 */
export class MsgCode {
    //#region common

    /** reference not unique */
    static ReferenceNotUnique = '1';

    //#endregion

    //#region produit

    /** the prix produit par agence already exists */
    static PrixProduitParAgenceExist = '100';

    //#endregion

    //#region Payment

    /** the amount of payment invalid */
    static AmountPaymentInvalid = '200';

    //#endregion

    //#region Facture

    /** remove facture payments   */
    static RemovePayment = '300';

    //#endregion

    //#region Mail service

    /** the configuration of messagerie doesn't exists */
    static NoConfigMessagerie = '400';

    //#endregion
}

export class Constants {
    /**
     * regulation mode with avoir
     */
    static RegulationModeAvoirId = 'RegulationMode::7';
}
