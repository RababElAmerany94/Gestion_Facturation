import { BonCommandeStatus } from 'app/core/enums/bon-commande-status.enum';

export class BonCommandeHelper {

    static canEditOrDelete(status: BonCommandeStatus) {
        return ![BonCommandeStatus.Commande, BonCommandeStatus.Signe].includes(status);
    }

    /**
     * can sign devis with the given status
     * @param status the status of devis
     */
    static canSigne(status: BonCommandeStatus) {
        return [BonCommandeStatus.EnCours].includes(status);
    }

    /**
     * can dossier be cancel
     */
    static canAnnuler(status: BonCommandeStatus) {
        return [BonCommandeStatus.Annule, BonCommandeStatus.Commande].includes(status);
    }

    /**
     * can be transfere to a devis
     */
    static canTransferToDevis(status: BonCommandeStatus) {
        return ![BonCommandeStatus.Annule, BonCommandeStatus.Commande].includes(status);
    }
}
