/**
 * a class describe reference result model
 */
export interface ReferenceResultModel {
    reference: string;
    counter?: number;
    status: DocumentComptableReferenceStatus;
    isOld: boolean;
}

export enum DocumentComptableReferenceStatus {
    OK = 1,
    CONFIGURE_ACCOUNTING_PERIOD = 2,
    PERIOD_NOT_EXIST_OR_CLOSURE = 3
}
