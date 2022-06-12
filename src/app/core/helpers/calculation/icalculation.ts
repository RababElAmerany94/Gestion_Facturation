import { InjectionToken } from '@angular/core';
import { IArticle } from 'app/core/models/general/article.model';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { ICalculationTva, IResultCalculationModel, IReverseCalculationResultModel } from 'app/core/models/general/calculation.model';
import { IFacture, IFactureDevis } from 'app/pages/facture/facture.model';

/**
 * interface describe calculation operations
 */
export interface ICalculation {

    /**
     * calculation price HT
     * @param priceTTC the price in TTC
     * @param tva the value of tva
     */
    priceHT(priceTTC: number, tva: number): number;

    /**
     * calculation price TTC
     * @param priceTTC the price in HT
     * @param tva the value of tva
     */
    priceTTC(priceHT: number, tva: number): number;

    /**
     * total hors tax article
     * @param article the article
     */
    totalHTArticle(article: IArticle): number;

    /**
     * total ttc article
     * @param article the article
     */
    totalTTCArticle(article: IArticle): number;

    /**
     * total hors tax articles
     * @param articles the list of articles
     */
    totalHT(articles: IArticle[]): number;

    /**
     * total hors tax with remise
     * @param globalTotalHT the global total HT
     * @param remiseGlobal the value of remise
     * @param typeRemiseGlobal the type of remise
     */
    totalHtRemise(globalTotalHT: number, remiseGlobal: number, typeRemiseGlobal: RemiseType): number;

    /**
     * calculation ventilation remise
     * @param articles the list of articles
     * @param globalTotalHT the global total HT
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationVentilationRemise(articles: IArticle[], globalTotalHT: number, remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : ICalculationTva[];

    /**
     * calculation of total TTC
     * @param globalTotalHT the global total HT
     * @param globalTotalHTRemise the total global HT with remise
     * @param calculationTva the list of calculation ventilation remise
     * @param remiseGlobal the global value of remise
     */
    totalTTC(globalTotalHT: number, globalTotalHTRemise: number, calculationTva: ICalculationTva[], remiseGlobal: number): number;

    /**
     * the calculation generale
     * @param articles the list of articles
     * @param totalReduction the total of reduction
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationGenerale(articles: IArticle[], remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : IResultCalculationModel;

    /**
     * the calculation generale
     * @param articles the list of articles
     * @param totalReduction the total of reduction
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationGeneraleWithReduction(articles: IArticle[], totalReduction: number, remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : IResultCalculationModel;

    /**
     * the calculation generale
     * @param articles the list of articles
     * @param totalPaid the total of paid
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationGeneraleWithPaid(articles: IArticle[], totalPaid: number, remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : IResultCalculationModel;

    /**
     * reverse calculation from total ttc
     * @param totalTTC the total ttc
     * @param articles the list of articles
     * @param calculationTva the calculation of tva
     */
    reverseCalculate(totalTTC: number, articles: IArticle[], calculationTva: ICalculationTva[]): IReverseCalculationResultModel;

    /**
     * calculation rest to pay facture
     * @param facture the facture entity
     */
    restPayerFacture(facture: IFacture): number;

    /**
     * sum of list facture devis
     * @param factureDevis the list of type facture devis
     * @param devisTotalTTC the total TTC of devis
     */
    sumFactureDevis(factureDevis: IFactureDevis[], devisTotalTTC: number): number;

    /**
     * calculate percent
     */
    calculatePercent(value: number, total: number): number;

    /**
     * calculate montant facture devis
     */
    calculateMontantFactureDevis(factureDevis: IFactureDevis, devisTotalTTC: number): number;

    /**
     * calculate percent of avancement of devis
     */
    percentAvancementDevis(factures: IFactureDevis[], devisTotalTTC: number): number;
}

export const CalculationToken = new InjectionToken<ICalculation>('calculation behavior');
