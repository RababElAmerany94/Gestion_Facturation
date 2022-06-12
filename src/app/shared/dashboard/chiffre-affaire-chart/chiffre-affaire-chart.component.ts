import { TranslateService } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import * as shape from 'd3-shape';
import { IChartData } from 'app/pages/dashboard/dashboard.model';

@Component({
    selector: 'kt-chiffre-affaire-chart',
    template: `
        <kt-portlet [class]="'kt-portlet__body--fit kt-portlet--border-bottom-brand'">

            <kt-portlet-header
                [title]="'CHART.EVOLUTION_CHIFFRE_AFFAIRE' | translate ">
            </kt-portlet-header>

            <kt-portlet-body>
                <div style="height:400px;display: grid">
                    <ng-container *ngIf="data?.length > 0; else emptyResult">
                        <ngx-charts-line-chart
                            [legend]="false"
                            [showXAxisLabel]="false"
                            [showYAxisLabel]="false"
                            [xAxis]="true"
                            [yAxis]="true"
                            [results]="data"
                            [curve]="curve">
                            <ng-template #tooltipTemplate let-model="model">
                                {{model?.name}}: {{ model?.value | RoundingNumber | Currency }}
                            </ng-template>
                            <ng-template #seriesTooltipTemplate let-model="model">
                                {{model[0]?.name}}: {{ model[0]?.value | RoundingNumber | Currency }}
                            </ng-template>
                        </ngx-charts-line-chart>
                    </ng-container>
                    <ng-template #emptyResult>
                        <div class="empty-data kt-subheader__title">
                            <span class="empty-data__text">{{'LABELS.EMPTY_TABLE' |translate }}</span>
                        </div>
                    </ng-template>
                </div>
            </kt-portlet-body>
        </kt-portlet>
    `
})
export class ChiffreAffaireChartComponent {

    data: {
        name: string,
        series: { name: string, value: number }[]
    }[] = [];

    curve = shape.curveLinear;

    @Input()
    set dataChart(value: IChartData) {
        if (value != null) {
            this.initializeChart(value);
        }
    }

    constructor(
        private translate: TranslateService
    ) { }

    /**
     * initialize chart data
     */
    initializeChart(data: IChartData) {
        this.data = [
            {
                name: this.translate.instant('LABELS.CHIFFRE_AFFAIRE'),
                series: data.labels.map((value, index) => {
                    return {
                        name: this.translate.instant(`MONTHS.${value}`),
                        value: data.serie[index]
                    }
                })
            }
        ];
    }
}
