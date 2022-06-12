import { IUser } from './../users/user.model';
import { DocType } from './../../core/enums/doctype.enums';
import { TypeTravaux } from 'app/core/enums/type-travaux.enum';
/**
 * interface describe dashboard model
 */
export interface IDashboardModel {

    /** the labels of dashboard */
    labels: string[];

    /**  the list of value */
    serie: number[];
}

/**
 * interface describe dashboard model
 */
export interface IDocumentStatisticByStatus {

    /** the status of dashboard */
    status: number;

    /**  the numbers of value */
    count: number;

    /**  the total of value */
    total: number;

}

export interface IGetFacturesArticlesQuantities {
    name: string;
    quantity: string;
}

export interface IGetFacturesArticlesTotals {
    name: string;
    total: number;
}

export interface IGetFacturesArticlesByCategory {
    name: string;
    total: number;
}

export interface IClassementClient {
    clientId: number;
    client: string;
    totalHT: number;
}

export interface IChartData {
    labels: string[];
    serie: number[];
}

export interface INotification {
    id: string;
    title: string;
    docType: DocType;
    identityDocument: number;
    isSeen: boolean;
    userId: number;
    user: IUser;
}

export interface InputClassementDashboard {
    classementClient: IClassementClient[];
    facturesArticlesByCategory: IGetFacturesArticlesByCategory[];
    facturesArticlesQuantities: IGetFacturesArticlesQuantities[];
    facturesArticlesTotals: IGetFacturesArticlesTotals[];
}

export interface IVentilationChiffreAffairesCommercial {
    commercial: string;
    commercialId: string;
    totalHT: number;
    dataParMois: IChiffreAffaireParMois[];
}

export interface IChiffreAffaireParMois {
    month: number;
    totalHT: number;
}

export interface IRepartitionTypesTravauxParTechnicien {
    technicienId: string;
    technicien: string;
    surfaceTraiter: number;
    surfaceParTypeTravaux: ISurfaceParTypeTravaux[];
}

export interface ISurfaceParTypeTravaux {
    typeTravaux: TypeTravaux | null;
    surfaceTraiter: number;
}

export interface IRepartitionDossiersTechnicien {
    technicien: string;
    technicienId: string;
    nombreDossiers: number;
}
