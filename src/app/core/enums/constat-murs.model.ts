import { FicheControleStatusItem } from './fiche-controle-status-item.enum';

export interface IConstatMurs {
    surfaceIsolantPrevue: number;
    surfaceIsolantPose: number;
    isPoseCorrecteIsolant: boolean;
    ecartAutourPointsEclairage: FicheControleStatusItem;
    ecartAutourBoitiersElectrique: FicheControleStatusItem;
    ecartAuFeuAutourFumees: FicheControleStatusItem;
    presenceFilsNonGainesNoyesDansIsolant: FicheControleStatusItem;
    conclusionIsolationMurs: boolean;
}
