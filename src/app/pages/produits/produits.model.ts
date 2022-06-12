import { IFournisseur } from '../suppliers/suppliers';
import { ICategoryProduct } from '../parametres/product-category/category-product.model';
import { IHistorique } from 'app/core/models/general/historique';
import { Memo } from 'app/core/models/general/memo.model';
import { IPrixParQuantite } from 'app/core/models/general/prix-par-quantite.model';

export interface IProduit {
    id: string;
    reference: string;
    name: string;
    prixAchat?: number;
    prixHT: number;
    tva: number;
    description: string;
    designation: string;
    prixParTranche: IPrixParQuantite[];
    unite: string;
    isPublic: boolean;
    labels: string[];
    memos: Memo[];
    historique: IHistorique[];
    agenceId: string;
    fournisseurId: string;
    fournisseur: IFournisseur;
    categoryId: number;
    category: ICategoryProduct;
    prixProduitParAgences: IPrixProduitParAgence[];
}

/**
 * an interface describe Produit model
 */
export interface IProduitModel {

    /**
     * the reference produits
     */
    reference: string;

    /**
     * the prix d'achat of produits
     */
    prixAchat?: number;

    /**
     * the prix ht of produit
     */
    prixHT: number;

    /**
     * the tva of produit
     */
    tva: number;

    /**
     * the description of produit
     */
    description: string;

    /**
     * the designation of produit
     */
    designation: string;

    /**
     * the prix par tranche of produit
     */
    prixParTranche: IPrixParQuantite[];

    /**
     * the unit of produit
     */
    unite: string;

    /**
     * apparaitre dans les autres agence
     */
    isPublic: boolean;

    /**
     * the labels of agence
     */
    labels: string[];

    /**
     * the agence id
     */
    agenceId: string;

    /**
     * the fournisseur id
     */
    fournisseurId?: string;

    /**
     * the id of category associate with this produit
     */
    categoryId: string;
}

/**
 * an interface describe produit dataTables
 */
export interface IProduitDataTables {

    /**
     * the id of produit
     */
    id: string;

    /**
     * designation of produit
     */
    designation: string;

    /**
     * the reference produits
     */
    reference: string;

    /**
     * the description of produit
     */
    description: string;

    /**
     * the prix ht of produit
     */
    prixHT: number;

    /**
     * the tva of produit
     */
    tva: number;

    /**
     * the unit of produit
     */
    unite: string;

    /**
     * is public of produit
     */
    isPublic: boolean;

    /**
     * the agence id
     */
    agenceId?: string;

    /**
     * check is current has actions
     */
    hasActions: boolean;
}

/**
 * an interface describe change visibility produit model
 */
export interface IChangeVisibilityProduitModel {

    /**
     * the id of produit
     */
    id: string;

    /**
     * is the produit visible to other agence
     */
    isPublic: boolean;
}

/**
 * an interface describe prix produit par agence
 */
export interface IPrixProduitParAgence {

    /**
     * the id of prix produit par agence
     */
    id: string;

    /**
     * the prix HT
     */
    prixHT: number;

    /**
     * TVA
     */
    tva: number;

    /**
     * the produit Id
     */
    produitId: string;
}

/**
 * an interface describe prix produit par agence
 */
export interface IPrixProduitParAgenceModel {

    /**
     * the prix HT
     */
    prixHT: number;

    /**
     * TVA
     */
    tva: number;

    /**
     * the produit Id
     */
    produitId: string;
}
