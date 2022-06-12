import { IClient } from '../clients/client.model';
import { DossierStatus } from 'app/core/enums/dossier-status.enums';
import { IDossierInstallation, IDossierInstallationModel } from './components/dossier-installation/dossier-installation.model';
import { PrecariteType } from 'app/core/enums/precarite.enums';
import { TypeTravaux } from 'app/core/enums/type-travaux.enum';
import { DocType } from 'app/core/enums/doctype.enums';
import { IDevis } from '../devis/devis.model';
import { IUserLiteModel } from '../users/user.model';
import { IDossierPV } from 'app/core/models/dossierPVModel';
import { ITypeLogement } from '../parametres/type-logement/type-logement.model';
import { IEchangeCommercial } from '../agenda-commercial/agenda-commercial.model';
import { ITypeChauffage } from '../parametres/type-chauffage/type-chauffage.model';
import { ISms } from 'app/shared/sms/sms.model';
import { IAgence } from '../agences/agence.model';
import { VisteTechniqueType } from 'app/core/enums/viste-technique-type.enum';
import { ClassementTechnique } from 'app/core/enums/classement-technique.enum';
import { VisteTechniqueToit } from 'app/core/enums/viste-technique-toit.enum';
import { VisteTechniqueTypeAccess } from 'app/core/enums/viste-technique-type-access.enum';
import { Address } from 'app/core/models/general/address.model';
import { Contact } from 'app/core/models/contacts/contact';
import { Memo } from 'app/core/models/general/memo.model';
import { IHistorique } from 'app/core/models/general/historique';
import { ISourceDuLead } from '../parametres/source-du-lead/source-du-lead';

/**
 * a interface describe IDossier
 */
export interface IDossier {

    /** the id of dossier */
    id: string;

    /**  the reference of dossier */
    reference: string;

    /**  the date of created of dossier */
    createdOn: Date;

    /** the commercial associate with dossier */
    commercialId?: string;

    /**  the commercial of dossier */
    commercial: IUserLiteModel;

    /** the date Pose of dossier */
    datePose: string;

    /** the date RDV of dossier */
    dateRDV?: Date;

    /** the contacts of dossier */
    contact: Contact;

    /** the siteIntervention of dossier */
    siteIntervention: Address;

    /** the first phoneNumber of dossier */
    firstPhoneNumber: string;

    /** the second phoneNumber of dossier */
    secondPhoneNumber: string;

    /** the history of dossier */
    historique: IHistorique[];

    /** the memo of dossier */
    memos: Memo[];

    /** the sms of this dossier */
    sms: ISms[];

    /** the note of dossier */
    note: string;

    /** the sourceLead of dossier */
    sourceLeadId: string;

    /** the type logement of dossier */
    sourceLead: ISourceDuLead;

    /** the sourceLead of dossier */
    dateReceptionLead: string;

    /** the date creation of dossier */
    dateCreation: Date;

    /** the date expiration of dossier */
    dateExpiration: Date;

    /** the typeLogement of dossier */
    logementTypeId: string;

    /** the type logement of dossier */
    logementType: ITypeLogement;

    /** the parcelleCadastrale of dossier */
    parcelleCadastrale: string;

    /** the surfaceTraiter of dossier */
    surfaceTraiter?: number;

    /** the nombrePersonne of dossier */
    nombrePersonne: string;

    /** the isMaisonDePlusDeDeuxAns of dossier */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of dossier */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of dossier */
    revenueFiscaleReference: string;

    /** the numeroAH of dossier */
    numeroAH: string;

    /** the typeTravaux of dossier */
    typeTravaux: TypeTravaux;

    /** the of Status dossier */
    status: DossierStatus;

    /** the primeCEE of dossier */
    primeCEE: IClient;

    /** the id of primeCEE of dossier */
    primeCEEId: string;

    /** the type Chauffage of dossier */
    typeChauffage: ITypeChauffage;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the agence associate with dossier */
    agence: IAgence;

    /** the id of agence */
    agenceId?: string;

    /** the visite technique of diossier */
    visteTechnique: IVisteTechnique;

    /** the list of echangeCommercials in dossier */
    echangeCommercials: IEchangeCommercial[];

    /** the client of dossier */
    client: IClient;

    /** the cliennt id associate with this dossier */
    clientId: string;

    /** the raison of annulation with this dossier */
    raisonAnnulation: string;

    /** the list of dossierInstallations in dossier */
    dossierInstallations: IDossierInstallation[];

    /** the devis associate with dossier */
    devis: IDevis;

    /** the documentAssociate of the dossier */
    documentAssociates: IDocumentAssociateModel;

    /** the pv of dossier */
    pVs: IDossierPV[];

    /** the additional information of site installation */
    siteInstallationInformationsSupplementaire: { [key: string]: string; };
}

/**
 * an interface describe DossierModel model
 */
export interface IDossierModel {

    /**  the reference of dossier */
    reference: string;

    /** the date Pose of dossier */
    datePose: string;

    /** the contacts of dossier */
    contact: Contact;

    /** the siteIntervention of dossier */
    siteIntervention: Address;

    /** the first phoneNumber of dossier */
    firstPhoneNumber: string;

    /** the second phoneNumber of dossier */
    secondPhoneNumber: string;

    /** the note of dossier */
    note: string;

    /** the source Lead of dossier */
    sourceLeadId: string;

    /** the source Lead of dossier */
    sourceLead: ISourceDuLead;

    /** the dateReceptionLead of dossier */
    dateReceptionLead: string;

    /** the date creation of dossier */
    dateCreation: Date;

    /** the date expiration of dossier */
    dateExpiration: Date;

    /** the typeLogement of dossier */
    logementTypeId: string;

    /** the type logement of dossier */
    logementType: ITypeLogement;

    /** the id type Chauffage of client */
    typeChauffageId: string;

    /** the parcelleCadastrale of dossier */
    parcelleCadastrale: string;

    /** the surfaceTraiter of dossier */
    surfaceTraiter?: number;

    /** the nombrePersonne of dossier */
    nombrePersonne: string;

    /** the isMaisonDePlusDeDeuxAns of dossier */
    isMaisonDePlusDeDeuxAns: boolean;

    /** the precarite of dossier */
    precarite: PrecariteType;

    /** the revenueFiscaleReference of dossier */
    revenueFiscaleReference: string;

    /** the numeroAH of dossier */
    numeroAH: string;

    /** the typeTravaux of dossier */
    typeTravaux: TypeTravaux;

    /** the primeCEE of dossier */
    primeCEE: IClient;

    /** the id of primeCEE of dossier */
    primeCEEId: string;

    /** the list of echangeCommercials in dossier */
    echangeCommercials: IEchangeCommercial[];

    /** the cliennt id associate with this dossier */
    clientId: string;

    /** the list of dossier Installation in dossier */
    dossierInstallations: IDossierInstallationModel[];

    /** the devis associate with dossier  */
    devis: IDevis;

    /** the of Status dossier */
    status: DossierStatus;

    /** the commercial associate with dossier */
    commercialId?: string;

    /** the id of agence */
    agenceId?: string;

    /** the raison of annulation with this dossier */
    raisonAnnulation: string;

    /** the date of rdv of dossier */
    dateRDV?: Date;

    /** the sms of this dossier */
    sms: ISms[];

    /** the pv of dossier */
    pVs: IDossierPV[];

    /** the additional information of site installation */
    siteInstallationInformationsSupplementaire: { [key: string]: string; };
}

/**
 * an interface describe dossier dataTables
 */
export interface IDossierDataTable {

    /** the id of dossier */
    id: string;

    /** the client associate with this dossier */
    client: string;

    /** the client id associate with this dossier */
    clientId: string;

    /**  the reference of dossier */
    reference: string;

    /** the date Pose of dossier */
    datePose: string;

    /** the phoneNumber of dossier */
    phoneNumber: string;

    /** the of Status dossier */
    status: DossierStatus;

    /** the commercial associate with dossier */
    commercialId?: string;

    /**  the commercial of dossier */
    commercial: string;

    /** the date of rdv of dossier */
    dateRDV: Date;

    /** techncien id of dossier */
    technicienId: string;

    /** date installation of dossier */
    dateDebutTravaux: string;

    /** the id of primeCEE of dossier */
    primeCEEId: string;

    /** the siteIntervention of dossier */
    siteIntervention: Address;

    /** is this facture has possibility to modify */
    isModify: boolean;

}

export interface IDocumentAssociateModel {

    /** the id dossier */
    id: string;

    /** the type dossier */
    type: DocType;

    /** the createOn dossier */
    createOn: string;

    /** the of reference dossier */
    reference: string;

    /** the TotalTTC of dossier */
    totalTTC: string;

    /** the of reference dossier */
    status: number;

}
export interface DossierAssignationModel {
    dossierId: string;
    commercialId: string;
    dateRDV: Date;
    status: DossierStatus;
}

export interface IVisteTechnique {
    type: VisteTechniqueType;
    nombrePiece: number;
    surfaceTotaleAIsoler: number;
    classementTechnique: ClassementTechnique;
    formulaires: IVisteTechniqueFormulaire[];
}

export interface IVisteTechniqueFormulaire {
    typeAccess: VisteTechniqueTypeAccess | null;
    dimensions: string;
    toit: VisteTechniqueToit | null;
    detailTypeAccess: string;
    surfaceComble: number | null;
    surfacePiece: number | null;
    typePlancher: string;
    hauteurSousFaitage: number | null;
    hauteurSousPlafond: number | null;
    nombreConduitCheminee: number | null;
    nombreSpotsAProteger: number | null;
    nombreLuminaire: number | null;
    nombreVMC: number | null;
    presenceTuyauterie: string;
    typeSupport: string;
    presencePorteGarge: number | null;
    isDegagementAPrevoir: boolean;
    isACoffrer: boolean;
    isARehausser: boolean;
    isPresenceNuisibles: boolean;
    typeNuisible: string;
    isPresenceBoitesDerivation: boolean;
}
