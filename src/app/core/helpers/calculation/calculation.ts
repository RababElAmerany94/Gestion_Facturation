import { MontantType } from 'app/core/enums/montant-type.enum';
import { IFacture, IFactureDevis } from 'app/pages/facture/facture.model';
import { RemiseType } from '../../enums/remise-type.enum';
import { IArticle } from '../../models/general/article.model';
import { ICalculationTva, IResultCalculationModel, IReverseCalculationResultModel } from '../../models/general/calculation.model';
import { NumberHelper } from '../number';
import { ICalculation } from './icalculation';

/**
 * a class describe ICalculation functions
 */
export class Calculation implements ICalculation {

    /**
     * calculation price HT
     * @param priceTTC the price in TTC
     * @param tva the value of tva
     */
    priceHT(priceTTC: number, tva: number): number {
        return NumberHelper.roundingNumber(priceTTC / (1 + tva / 100));
    }

    /**
     * calculation price TTC
     * @param priceTTC the price in HT
     * @param tva the value of tva
     */
    priceTTC(priceHT: number, tva: number): number {
        return NumberHelper.roundingNumber(priceHT * (1 + tva / 100));
    }

    /**
     * total hors tax article
     * @param article the article
     */
    totalHTArticle(article: IArticle): number {
        article.prixHT = this.priceTranche(article);
        if (article.remise) {
            switch (article.remiseType) {
                case RemiseType.Percent:
                    return ((article.prixHT - (article.prixHT * article.remise) / 100) * article.qte);
                case RemiseType.Currency:
                    return ((article.prixHT - article.remise) * article.qte);
            }
        } else {
            return (article.prixHT * article.qte);
        }
    }

    /**
     * total ttc article
     * @param article the article
     */
    totalTTCArticle(article: IArticle): number {
        const totalHT = this.totalHTArticle(article);
        return totalHT * (article.tva / 100) + totalHT;
    }

    /**
     * total hors tax articles
     * @param articles the list of articles
     */
    totalHT(articles: IArticle[]): number {
        return articles.reduce((x, y) => x + y.totalHT, 0);
    }


    /**
     * total hors tax with remise
     * @param globalTotalHT the global total HT
     * @param remiseGlobal the value of remise
     * @param typeRemiseGlobal the type of remise
     */
    totalHtRemise(globalTotalHT: number, remiseGlobal: number, typeRemiseGlobal: RemiseType): number {
        if (typeRemiseGlobal === RemiseType.Currency) {
            return (globalTotalHT - remiseGlobal);
        } else {
            return (globalTotalHT - (globalTotalHT * (remiseGlobal / 100)));
        }
    }

    /**
     * calculation ventilation remise
     * @param articles the list of articles
     * @param globalTotalHT the global total HT
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationVentilationRemise(articles: IArticle[], globalTotalHT: number, remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : ICalculationTva[] {

        // init variable
        const calculationTvas: ICalculationTva[] = [];

        // group tva
        const groupTvaDistinct = articles.filter(
            (value, index, self) => self.map(e => e.tva).indexOf(value.tva) === index
        );

        const groupTva = groupTvaDistinct.map(x => x.tva).sort((a, b) => a - b);

        // foreach groups tva
        for (const tva of groupTva) {

            // init calculation tva
            const calculationTva: ICalculationTva = {
                tva, totalHT: 0, totalTVA: 0, totalTTC: 0, percentTvaBaseTotalTTC: 0
            };

            // select products that they have this tva
            const articlesHasTva = articles.filter(x => x.tva === tva);

            // sum of products HT
            const sumTotalHtProduits = articlesHasTva.reduce((x, y) => x + y.totalHT, 0);


            // if remise in currency
            if (typeRemiseGlobal === RemiseType.Currency) {
                const percent = (sumTotalHtProduits / globalTotalHT);
                calculationTva.totalHT = sumTotalHtProduits - percent * remiseGlobal;
                calculationTva.totalTVA = calculationTva.totalHT * (tva / 100);
                calculationTva.totalTTC = calculationTva.totalTVA + calculationTva.totalHT;
            } else {
                calculationTva.totalHT = sumTotalHtProduits - ((sumTotalHtProduits * remiseGlobal) / 100);
                calculationTva.totalTVA = calculationTva.totalHT * (tva / 100);
                calculationTva.totalTTC = calculationTva.totalTVA + calculationTva.totalHT;
            }

            // push in array
            calculationTvas.push(calculationTva);
        }

        // the sum of total TTC of group TVA
        const totalTTC = calculationTvas.reduce((p, c) => p + c.totalTTC, 0);

        // calculate percent TVA
        for (const calculation of calculationTvas) {
            calculation.percentTvaBaseTotalTTC = calculation.totalTTC > 0 ? calculation.totalTVA / totalTTC : 0;
        }

        return calculationTvas;
    }

    /**
     * calculation of total TTC
     * @param globalTotalHT the global total HT
     * @param globalTotalHTRemise the total global HT with remise
     * @param calculationTva the list of calculation ventilation remise
     * @param remiseGlobal the global value of remise
     */
    totalTTC(globalTotalHT: number, globalTotalHTRemise: number, calculationTva: ICalculationTva[], remiseGlobal: number): number {
        const sumTVA = calculationTva.reduce((x, y) => x + y.totalTVA, 0);
        if (remiseGlobal && remiseGlobal > 0) {
            return (globalTotalHTRemise + sumTVA);
        } else {
            return (globalTotalHT + sumTVA);
        }
    }


    /**
     * the calculation generale
     * @param articles the list of articles
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationGenerale(articles: IArticle[], remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : IResultCalculationModel {

        // calculate total TTC and HT of articles
        for (const article of articles) {
            article.totalHT = this.totalHTArticle(article);
            article.totalTTC = this.totalTTCArticle(article);
        }

        // total HT of all articles
        const totalHT = this.totalHT(articles);

        // calculate TVA
        const calculationTva = this.calculationVentilationRemise(articles, totalHT, remiseGlobal, typeRemiseGlobal);

        // calculate percent of total HT
        for (const article of articles) {
            if (article.tva != null && article.tva > 0 && article.qte > 0) {
                const tva = calculationTva.find(t => t.tva === article.tva);
                article.percentTotalHtRateTVA = article.totalHT > 0 ? article.totalHT / tva.totalHT : 0;
            }
        }

        // total HT with discount
        const totalHTRemise = this.totalHtRemise(totalHT, remiseGlobal, typeRemiseGlobal);

        // the total TTC
        const totalTTC = this.totalTTC(totalHT, totalHTRemise, calculationTva, remiseGlobal);

        return {
            articles,
            totalHT,
            calculationTva,
            totalHTRemise,
            totalTTC,
            totalReduction: 0,
            totalPaid: 0,
            remise: remiseGlobal,
            remiseType: typeRemiseGlobal
        };
    }

    /**
     * the calculation generale
     * @param articles the list of articles
     * @param totalReduction the total of reduction
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationGeneraleWithReduction(articles: IArticle[], totalReduction: number, remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : IResultCalculationModel {
        const result = this.calculationGenerale(articles, remiseGlobal, typeRemiseGlobal);
        result.totalReduction = totalReduction;
        result.totalPaid = result.totalTTC - totalReduction;
        return result;
    }

    /**
     * the calculation generale
     * @param articles the list of articles
     * @param totalPaid the total of paid
     * @param remiseGlobal the value of remise global
     * @param typeRemiseGlobal the type of remise global
     */
    calculationGeneraleWithPaid(articles: IArticle[], totalPaid: number, remiseGlobal: number, typeRemiseGlobal: RemiseType)
        : IResultCalculationModel {
        const result = this.calculationGenerale(articles, remiseGlobal, typeRemiseGlobal);
        result.totalPaid = totalPaid;
        result.totalReduction = result.totalTTC - totalPaid;
        return result;
    }

    /**
     * reverse calculation from total ttc
     * @param totalTTC the total ttc
     * @param articles the list of articles
     * @param calculationTva the calculation of tva
     */
    reverseCalculate(totalTTC: number, articles: IArticle[], calculationTva: ICalculationTva[]): IReverseCalculationResultModel {

        // update calculation tva
        for (const calculation of calculationTva) {
            calculation.totalTVA = calculation.percentTvaBaseTotalTTC ? (totalTTC * calculation.percentTvaBaseTotalTTC) : 0;
            calculation.totalHT = (calculation.tva / 100) !== 0 ? (calculation.totalTVA / (calculation.tva / 100)) : 0;
            calculation.totalTTC = calculation.totalTVA + calculation.totalHT;
        }

        // update article
        for (const article of articles) {
            if (article.qte > 0) {
                const tva = calculationTva.find(t => t.tva === article.tva);
                article.totalHT = article.percentTotalHtRateTVA ? (tva.totalHT * article.percentTotalHtRateTVA) : 0;
                article.totalTTC = article.totalHT * (article.tva / 100) + article.totalHT;
                if (article.remiseType === RemiseType.Currency) {
                    article.prixHT = (article.totalHT / article.qte) + article.remise;
                } else {
                    article.prixHT = article.totalHT / (article.qte * (1 - (article.remise / 100)));
                }
            }
        }

        return {
            totalTTC,
            totalHT: articles.reduce((p, c) => p + c.totalHT, 0),
            articles
        };
    }

    /**
     * calculation rest to pay facture
     * @param facture the facture entity
     */
    restPayerFacture(facture: IFacture): number {
        return facture.totalTTC - facture?.facturePaiements?.reduce((x, y) => x + y.montant, 0);
    }

    /**
     * sum of list facture devis
     * @param factureDevis the list of type facture devis
     * @param devisTotalTTC the total TTC of devis
     */
    sumFactureDevis(factureDevis: IFactureDevis[], devisTotalTTC: number): number {
        return factureDevis.reduce(
            (previous: number, current: IFactureDevis) => previous + this.calculateMontantFactureDevis(current, devisTotalTTC), 0)
    }

    /**
     * calculation percent
     */
    calculatePercent(value: number, total: number): number {
        return (value / total) * 100;
    }

    /**
     * calculate montant facture devis
     */
    calculateMontantFactureDevis(factureDevis: IFactureDevis, devisTotalTTC: number): number {
        if (factureDevis.montantType === MontantType.Currency) {
            return factureDevis.montant;
        } else {
            return (factureDevis.montant * devisTotalTTC) / 100;
        }
    }

    percentAvancementDevis(factures: IFactureDevis[], devisTotalTTC: number): number {
        const nouveauAvancement = this.sumFactureDevis(factures, devisTotalTTC);
        return this.calculatePercent(nouveauAvancement, devisTotalTTC);
    }

    //#region private methods

    /**
     * check current quantity include in a tranche
     */
    private priceTranche(article: IArticle): number {
        if (article.prixParTranche == null || article.prixParTranche.length === 0) { return article.prixHT; }
        const filterTranche = article.prixParTranche.filter(e => e.quantiteMinimal <= article.qte && article.qte <= e.quantiteMaximal);
        if (filterTranche.length === 0) { return article.prixHT; }
        return filterTranche[0].prix;
    }

    //#endregion
}
