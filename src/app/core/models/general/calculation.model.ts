import { IArticle } from './article.model';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { TableArticleMode } from 'app/shared/table-article/table-article-shell.component';

/**
 * a interface describe calculation of tva
 */
export interface ICalculationTva {
    tva: number;
    totalHT: number;
    totalTTC: number;
    totalTVA: number;
    percentTvaBaseTotalTTC: number;
}

/**
 * a interface describe general result calculation
 */
export interface IResultCalculationModel {
    articles: IArticle[];
    totalHT: number;
    calculationTva: ICalculationTva[];
    totalHTRemise: number;
    totalTTC: number;
    remise: number;
    totalReduction: number;
    totalPaid: number;
    remiseType: RemiseType;
}

/**
 * an interface describe reserve calculation result model
 */
export interface IReverseCalculationResultModel {
    articles: IArticle[];
    totalTTC: number;
    totalHT: number;
}

/**
 * an interface describe input table article component
 */
export interface IInputTableArticleComponent {
    articles: IArticle[];
    totalReduction: number;
    mode: TableArticleMode;
}
