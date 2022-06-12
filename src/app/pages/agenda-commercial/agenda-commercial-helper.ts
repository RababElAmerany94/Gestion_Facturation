import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';

export class AgendaCommercialHelper {

    /**
     * can cancel a facture
     */
    static isStatusAnnulee(status: EchangeCommercialStatus) {
        return [EchangeCommercialStatus.annulee].includes(status);
    }

    /**
     * can cancel a facture
     */
    static isStatusCloture(status: EchangeCommercialStatus) {
        return [EchangeCommercialStatus.cloturee].includes(status);
    }
}
