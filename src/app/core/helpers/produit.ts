import { ArrayHelper } from './array';
import { IProduit } from 'app/pages/produits/produits.model';
import { ArticleType } from '../enums/article-type.enum';
import { IArticle } from '../models/general/article.model';
import { RemiseType } from '../enums/remise-type.enum';
import { ISpecialArticle } from 'app/pages/parametres/special-article/special-artical.model';

export class ProduitHelper {

    /**
     * get prix par agence of produit
     */
    static getPrixParAgenceOfProduit(produit: IProduit): number {
        if (ArrayHelper.isEmptyOrNull(produit.prixProduitParAgences)) {
            return produit.prixHT;
        } else {
            return produit.prixProduitParAgences[0].prixHT;
        }
    }

    /**
     * get tva par agence of produit
     */
    static getTvaParAgenceOfProduit(produit: IProduit): number {
        if (ArrayHelper.isEmptyOrNull(produit.prixProduitParAgences)) {
            return produit.tva;
        } else {
            return produit.prixProduitParAgences[0].tva;
        }
    }

    /**
     * map produit to article
     */
    static mapProduitToArticle(produit: IProduit): IArticle {
        return {
            id: produit.id,
            description: produit.description,
            designation: produit.designation,
            fournisseurId: produit.fournisseurId,
            prixAchat: produit.prixAchat,
            prixHT: ProduitHelper.getPrixParAgenceOfProduit(produit),
            tva: ProduitHelper.getTvaParAgenceOfProduit(produit),
            prixOriginal: produit.prixAchat,
            qte: 0,
            reference: produit.reference,
            remise: 0,
            remiseType: RemiseType.Percent,
            prixParTranche: produit.prixParTranche ? produit.prixParTranche : [],
            totalHT: 0,
            totalTTC: 0,
            unite: produit.unite,
            percentTotalHtRateTVA: 0,
            category: produit.category,
            type: ArticleType.Produit
        };
    }

    /**
     * map produit to article
     */
    static mapSpecialArticleToArticle(article: ISpecialArticle): IArticle {
        return {
            id: article.id,
            description: article.description,
            designation: article.designation,
            fournisseurId: null,
            prixAchat: 0,
            prixHT: 0,
            prixOriginal: 0,
            qte: 0,
            reference: '',
            remise: 0,
            remiseType: RemiseType.Percent,
            prixParTranche: [],
            totalHT: 0,
            totalTTC: 0,
            tva: 0,
            unite: '',
            percentTotalHtRateTVA: 0,
            category: null,
            type: ArticleType.SpecialArticle
        };
    }

}
