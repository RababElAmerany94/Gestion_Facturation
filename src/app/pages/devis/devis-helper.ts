import { DevisStatus } from 'app/core/enums/devis-status.enum';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { FactureType } from 'app/core/enums/facture-type.enum';
import { ICalculation } from 'app/core/helpers/calculation/icalculation';
import { IDevis } from './devis.model';

export class DevisHelper {

    static canEdit(status: DevisStatus) {
        return ![DevisStatus.Signe, DevisStatus.Facture].includes(status);
    }

    /**
     * can transfer devis to facture
     * @param status the status of devis
     */
    static canTransferToFacture(status: DevisStatus): boolean {
        return [DevisStatus.Signe, DevisStatus.Valider].includes(status);
    }

    /**
     * can marked devis perdu with the given status
     * @param status the status of devis
     */
    static canMarkedPerdu(status: DevisStatus) {
        return [DevisStatus.Encours, DevisStatus.Enretard].includes(status);
    }

    /**
     * can sign devis with the given status
     * @param status the status of devis
     */
    static canSigne(status: DevisStatus) {
        return [DevisStatus.Encours, DevisStatus.Enretard].includes(status);
    }

    /**
     * can add facture acompte with the given status
     * @param status the status of devis
     */
    static canAddFactureAcompte(devis: IDevis, percenteAvancement: number) {
        return [DevisStatus.Valider, DevisStatus.Signe, DevisStatus.Facture].includes(devis.status) &&
            (percenteAvancement != null && percenteAvancement < 100) &&
            [DevisType.Normal].includes(devis.type);
    }

    /**
     * can add facture cloture
     * @param devis the devis to check
     */
    static canAddFactureCloture(devis: IDevis) {
        return devis?.status === DevisStatus.Facture &&
            devis?.factures?.length > 0 &&
            devis?.factures?.every(e => e.facture.type === FactureType.Acompte);
    }

    /**
     * percent of facturation devis
     * @param calculation the class of calculation
     * @param devis the devis to calculate percent
     */
    static percentFacturationDevis(calculation: ICalculation, devis: IDevis): number {
        if (devis?.factures?.every(e => e?.facture?.type === FactureType.Acompte))
            return calculation.percentAvancementDevis(devis?.factures, devis.totalTTC);
        else
            return null;
    }
}
