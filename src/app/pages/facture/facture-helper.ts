import { DatePipe } from '@angular/common';
import { ArticleType } from 'app/core/enums/article-type.enum';
import { FactureType } from 'app/core/enums/facture-type.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { ICalculation } from 'app/core/helpers/calculation/icalculation';
import { IArticle } from 'app/core/models/general/article.model';
import { FactureStatus } from 'app/core/enums/facture-status.enum';
import { IDevis } from '../devis/devis.model';
import { IFactureDevis } from './facture.model';

export class FactureHelper {

    static createArticleFactureAcompte(factureDevis: IFactureDevis, calculation: ICalculation, datePipe: DatePipe): IArticle {
        const devis = factureDevis.devis;
        const amount = calculation.calculateMontantFactureDevis(factureDevis, factureDevis.devis.totalTTC);
        const { totalHT, totalTVA } = FactureHelper.getTotalHtAndTvaFactureDevis(devis, calculation, amount);
        return {
            designation: `Situation au ${datePipe.transform(new Date(), 'shortDate')} sur devis ${factureDevis.devis.reference}`,
            description: '',
            fournisseurId: null,
            id: '',
            percentTotalHtRateTVA: 1,
            prixAchat: 0,
            prixHT: totalHT,
            prixOriginal: 0,
            prixParTranche: [],
            qte: 1,
            reference: '',
            category: null,
            remise: 0,
            remiseType: RemiseType.Currency,
            totalHT,
            totalTTC: amount,
            tva: (totalTVA / totalHT) * 100,
            type: ArticleType.Other,
            unite: 'U'
        };
    }

    static calculateFactureCloture(calculation: ICalculation, factureDevis: IFactureDevis[])
        : { totalHT: number, totalTTC: number } {
        const totalPaid = factureDevis
            .filter(e => e.facture.type === FactureType.Acompte)
            .reduce((previous, current) => previous + calculation.calculateMontantFactureDevis(current, current.devis.totalTTC), 0);
        const devis = factureDevis[0].devis
        const restToPay = devis.totalTTC - totalPaid;
        const { totalHT } = FactureHelper.getTotalHtAndTvaFactureDevis(devis, calculation, restToPay);
        return { totalHT, totalTTC: restToPay };
    }

    //#region private methods

    private static getTotalHtAndTvaFactureDevis(devis: IDevis, calculation: ICalculation, amount: number) {
        const devisArticles = devis.articles as IArticle[];
        const articlesTypeProduit = devisArticles.filter(e => e.type === ArticleType.Produit);
        const ventilation = calculation.calculationVentilationRemise(articlesTypeProduit, devis.totalHT, 0, RemiseType.Currency);
        const totalTVA = ventilation
            .reduce((previous, current) => previous + (current.percentTvaBaseTotalTTC * amount), 0);
        const totalHT = amount - totalTVA;
        return { totalHT, totalTVA };
    }

    //#endregion

    /**
     * can cancel a facture
     */
    static isStatusAnnulee(status: FactureStatus, type: FactureType) {
        return [FactureStatus.ANNULEE].includes(status) || type === FactureType.Acompte;
    }

    /**
     * can cancel a facture
     */
    static canDupliquer(type: FactureType) {
        return [FactureType.Acompte, FactureType.Cloture].includes(type);
    }

    static canEditOrDelete(status: FactureStatus) {
        return [FactureStatus.BROUILLON].includes(status);
    }

}
