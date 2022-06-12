import { DossierStatus } from 'app/core/enums/dossier-status.enums';

export class DossierShared {

    /**
     * can dossier be assigne
     */
    static canAssigne(status: DossierStatus) {
        return [DossierStatus.Assigne, DossierStatus.EnAttente, DossierStatus.EnRetard].includes(status);
    }

    static canEditOrDelete(status: DossierStatus) {
        return [DossierStatus.Assigne, DossierStatus.EnRetard, DossierStatus.EnAttente].includes(status);
    }

    /**
     * can add visite technique to dossier
     */
    static canAddVisiteTechnique(status: DossierStatus) {
        return [DossierStatus.EnAttente, DossierStatus.EnRetard, DossierStatus.Perdu].includes(status);
    }

}
