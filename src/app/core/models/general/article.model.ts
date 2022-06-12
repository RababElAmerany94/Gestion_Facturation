import { IPrixParQuantite } from './prix-par-quantite.model';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { ArticleType } from 'app/core/enums/article-type.enum';
import { ICategoryProduct } from './../../../pages/parametres/product-category/category-product.model';

/**
 * a class describe article
 */
export interface IArticle {

    /** the id of article */
    id: string;

    /** the reference of produit */
    reference: string;

    /** the price Achat of produit */
    prixAchat: number | null;

    /** the price HT of produit */
    prixHT: number;

    /** the TVA of produit */
    tva: number;

    /** the description of produit */
    description: string;

    /** the designation of produit */
    designation: string;

    /** prix par tranche.  */
    prixParTranche: IPrixParQuantite[];

    /** the unit of product */
    unite: string;

    /** the id of fournisseur associate with this produit */
    fournisseurId: string;

    /** the quantity of articles */
    qte: number;

    /** the original price */
    prixOriginal: number;

    /** the total HT */
    totalHT: number;

    /** the total TTC */
    totalTTC: number;

    /** the discount */
    remise: number;

    /** the type discount */
    remiseType: RemiseType;

    /** the percent of total HT base rate TVA total HT */
    percentTotalHtRateTVA: number;

    /** the type of article */
    type: ArticleType;

    /** the Category Product */
    category: ICategoryProduct;

    /** the id of Product */
    categorieId?: string;
}
