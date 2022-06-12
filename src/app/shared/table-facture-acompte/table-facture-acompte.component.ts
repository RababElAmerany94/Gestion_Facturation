import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { IArticle } from 'app/core/models/general/article.model';
import { IResultCalculationModel } from 'app/core/models/general/calculation.model';
import { IFactureDevis } from 'app/pages/facture/facture.model';

@Component({
    selector: 'kt-table-facture-acompte',
    templateUrl: './table-facture-acompte.component.html'
})
export class TableFactureAcompteComponent implements OnInit {

    @Input()
    factureDevis: IFactureDevis[];

    @Input()
    currentFactureDevis: IFactureDevis;

    @Input()
    articles: IArticle[];

    mode: ProgressBarMode = 'determinate';
    avancementPercent = 0.0;
    nouveauAvancementPercent = 0.0;
    resultCalculation: IResultCalculationModel;

    constructor(
        @Inject(CalculationToken) private calculation: ICalculation
    ) { }

    ngOnInit() {
        this.initComponent();
    }

    getTotalTva() {
        return this.resultCalculation?.calculationTva.reduce((previous, next) => previous + next.totalTVA, 0);
    }

    private initComponent() {
        if (this.factureDevis != null && this.articles != null && this.currentFactureDevis != null) {
            this.nouveauAvancementPercent = this.calculation
                .percentAvancementDevis([...this.factureDevis, this.currentFactureDevis], this.currentFactureDevis.devis.totalTTC);
            const avancement = this.calculation.sumFactureDevis([this.currentFactureDevis], this.currentFactureDevis.devis.totalTTC);
            this.avancementPercent = this.calculation.calculatePercent(avancement, this.currentFactureDevis.devis.totalTTC)
            this.resultCalculation = this.calculation.calculationGenerale(this.articles, 0, RemiseType.Currency);
        }
    }

}
