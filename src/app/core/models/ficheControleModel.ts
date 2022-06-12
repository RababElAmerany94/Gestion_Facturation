import { IDossierPV } from './dossierPVModel';
import { IUser } from 'app/pages/users/user.model';
import { PrestationType } from '../enums/prestation-type.enum';
import { IConstatCombles } from '../enums/constat-combles.model';
import { IConstatPlanchers } from '../enums/constat-planchers.model';
import { IConstatMurs } from '../enums/constat-murs.model';
import { IPhotoDocument } from './dossierPVModel';

/**
 * an interface describe Fiche Controle
 */
export interface IFicheControle {

    /** the id of fiche controle. */
    id: string;

    /** the number of operation */
    numberOperation: string;

    /** the date of controle */
    dateControle: string;

    /** the type of prestation */
    prestationType: PrestationType;

    /** list of photo format JSON */
    photos: IPhotoDocument[];

    /** the constat combles */
    constatCombles: IConstatCombles;

    /** the constat planchers */
    constatPlanchers: IConstatPlanchers;

    /** the constat murs */
    constatMurs: IConstatMurs;

    /** the remarques of fiche controle */
    remarques: string;

    /** the evaluation of accomagnement by 10 */
    evaluationAccompagnement: number;

    /** les travaux réalisés by 10 */
    evaluationTravauxRealises: number;

    /** La propreté du chantier by 10 */
    evaluationPropreteChantier: number;

    /** A quel niveau évalueriez-vous le contact avec nos techniciens applicateurs ? by 10 */
    evaluationContactAvecTechniciensApplicateurs: number;

    /**  the signature of controller */
    signatureController: string;

    /** the signature of client */
    signatureClient: string;

    /** the name of client signer */
    nameClientSignature: string;

    /** the controller id associate with fiche controle */
    controllerId: number;

    /** the controller associate with fiche controle */
    controller: IUser;

    /** the dossier PV with thid fiche controle */
    dossierPV: IDossierPV;
}

export interface IFicheControleModel {

    /** the number of operation */
    numberOperation: string;

    /** the date of controle */
    dateControle: string;

    /** the type of prestation */
    prestationType: PrestationType;

    /** list of photo format JSON */
    photos: IPhotoDocument[];

    /** the constat combles */
    constatCombles: IConstatCombles;

    /** the constat planchers */
    constatPlanchers: IConstatPlanchers;

    /** the constat murs */
    constatMurs: IConstatMurs;

    /** the remarques of fiche controle */
    remarques: string;

    /** the evaluation of accomagnement by 10 */
    evaluationAccompagnement: number;

    /** les travaux réalisés by 10 */
    evaluationTravauxRealises: number;

    /** La propreté du chantier by 10 */
    evaluationPropreteChantier: number;

    /** A quel niveau évalueriez-vous le contact avec nos techniciens applicateurs ? by 10 */
    evaluationContactAvecTechniciensApplicateurs: number;

    /**  the signature of controller */
    signatureController: string;

    /** the signature of client */
    signatureClient: string;

    /** the name of client signer */
    nameClientSignature: string;

    /** the controller id associate with fiche controle */
    controllerId: number;

    /** the controller associate with fiche controle */
    controller: IUser;

    /** the dossier PV with thid fiche controle */
    dossierPVId: number;
}
