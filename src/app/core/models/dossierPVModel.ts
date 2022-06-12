import { IFicheControle } from './ficheControleModel';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { PieceJoin } from './general/memo.model';
import { IArticle } from './general/article.model';

/**
 * an interface describe dossier pv
 */
export interface IDossierPV {

    /** the id of dossier PV. */
    id: string;

    /** the photos of dossier PV. */
    photos: IPhotoDocument[];

    /** the article of dossier PV. */
    articles: IArticle[];

    /** is the client satisfied of service offered */
    isSatisfied: boolean;

    /** the reason of no satisfaction of client */
    reasonNoSatisfaction: string;

    /** the name of client who sign PV */
    nameClientSignature: string;

    /** the signature of client */
    signatureClient: string;

    /** the photos of techncien */
    signatureTechnicien: string;

    /** the fiche controle id associate with this entity */
    ficheControleId: string;

    /** the fiche controle associate with this entity */
    ficheControle: IFicheControle;

    /** the dossier id of dossier PV */
    dossierId: string;

    /** the dossier of dossier PV */
    dossier: IDossier;
}

export interface IDossierPVModel {

    /** the photos of dossier PV. */
    photos: string;

    /** the article of dossier PV. */
    articles: IArticle[];

    /** is the client satisfied of service offered */
    isSatisfied: boolean;

    /** the reason of no satisfaction of client */
    reasonNoSatisfaction: string;

    /** the name of client who sign PV */
    nameClientSignature: string;

    /** the signature of client */
    signatureClient: string;

    /** the photos of techncien */
    signatureTechnicien: string;

    /** the fiche controle id associate with this entity */
    ficheControleId: string;

    /** the fiche controle associate with this entity */
    ficheControle: IFicheControle;

    /** the dossier id of dossier PV */
    dossierId: string;

    /** the dossier of dossier PV */
    dossier: IDossier;
}
/** anomalie image */
export interface ImageAnomalie {
    name: string;
    pieceJoin: PieceJoin;
}

export interface IPhotoDocument {
    image: PieceJoin;
    commentaire: string;
}
