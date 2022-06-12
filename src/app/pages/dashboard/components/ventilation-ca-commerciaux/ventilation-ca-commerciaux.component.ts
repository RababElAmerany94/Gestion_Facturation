import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ArrayHelper } from 'app/core/helpers/array';
import { IVentilationChiffreAffairesCommercial } from '../../dashboard.model';

@Component({
    selector: 'kt-ventilation-ca-commerciaux',
    template: `
        <kt-portlet [class]="'kt-portlet__body--fit kt-portlet--border-bottom-brand'">

            <kt-portlet-header
                [title]="'CHART.VENTILATION_CA_COMMERCIAUX' | translate ">
            </kt-portlet-header>

            <kt-portlet-body>
                    <div style="height:400px">
                        <ng-container *ngIf="data?.length >0 ; else emptyResult">
                            <ngx-charts-bar-horizontal-stacked
                                [legend]="false"
                                [showXAxisLabel]="false"
                                [showYAxisLabel]="false"
                                [xAxis]="true"
                                [yAxis]="true"
                                [results]="data">
                            <ng-template #tooltipTemplate let-model="model">
                                {{model?.name}}: {{ model?.value | RoundingNumber | Currency }}
                            </ng-template>
                            <ng-template #seriesTooltipTemplate let-model="model">
                                {{model[0]?.name}}: {{ model[0]?.value | RoundingNumber | Currency }}
                            </ng-template>
                            </ngx-charts-bar-horizontal-stacked>
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
export class VentilationCaCommerciauxComponent {

    data: {
        name: string,
        series: { name: number, value: number }[]
    }[] = [];

    @Input()
    set dataChart(value: IVentilationChiffreAffairesCommercial[]) {
        if (!ArrayHelper.isEmptyOrNull(value)) {
            this.initializeChart(value);
        }
    }

    constructor(
        private translate: TranslateService
    ) { }

    /**
     * initialize chart data
     */
    initializeChart(data: IVentilationChiffreAffairesCommercial[]) {
        this.data = data.map(x => {
            return {
                name: x.commercial,
                series: x.dataParMois.map(value => {
                    return {
                        name: this.translate.instant(`MONTHS.${value.month}`),
                        value: value.totalHT
                    };
                }),
            };
        });
    }
}
