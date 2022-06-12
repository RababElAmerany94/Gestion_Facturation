import { IDossier } from '../../dossier.model';
import { IUser } from 'app/pages/users/user.model';
import { DossierInstallationStatus } from 'app/core/enums/dossier-installation-status';

/**
 * an interface describe Date Installation dossier
 */
export interface IDossierInstallation {

    /** the id of  Date Installation dossier */
    id: string;

    /** the date Installation of dossier in logiciel */
    dateDebutTravaux: string;

    /** the status of dossier in logiciel */
    status: DossierInstallationStatus;

    /** the technicien of dossier */
    technicien: IUser;

    /** the techniciens id associatewith this dossier */
    technicienId: number;

    /** the dossier of Date Installation dossier */
    dossier: IDossier;

    /** the id of Date Installation dossier */
    dossierId: number;
}

/**
 * an interface describe date Installation associate withDossier
 */
export interface IDossierInstallationModel {

    /** the date Installation of dossier in logiciel */
    dateDebutTravaux: string;

    /** the status of dossier in logiciel */
    status: DossierInstallationStatus;

    /** the techniciens id associatewith this dossier */
    technicienId: number;

    /** the dossier of Date Installation dossier */
    dossier: IDossier;

    /** the id of dossier */
    dossierId: number;
}

/**
 * an interface describe IDossierInstallationModelDataTable datatables
 */

export interface IDossierInstallationModelDataTable {

    /** the date Installation of dossier in logiciel */
    dateDebutTravaux: string;

    /** the status of dossier in logiciel */
    status: DossierInstallationStatus;

    /** the techniciens id associatewith this dossier */
    technicienId: number;
}
