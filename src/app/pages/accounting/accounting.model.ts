/** interface describre account jouirnal model */
export interface IAccountJournalModel {
    /** the code journal */
    codeJournal: string;

    /** the date of payment */
    datePaiment: string;

    /** the account number */
    numeroCompte: string;

    /** the piece number */
    numeroPiece: string;

    /** the tiers */
    tiers: string;

    /** the client name */
    clientName: string;

    /** the debit */
    debit: number;

    /** the credit */
    credit: number;

    /** the name of payment method */
    paimentMethod: string;
}

/** interface describe sales journal model */
export interface ISalesJournalModel {
    // the code journal
    codeJournal: string;

    // the date of creation
    dateCreation: string;

    // the account number
    numeroCompte: string;

    // the piece number
    numeroPiece: string;

    // client name
    clientName: string;

    // debit
    debit: number;

    // the credit
    credit: number;
}
