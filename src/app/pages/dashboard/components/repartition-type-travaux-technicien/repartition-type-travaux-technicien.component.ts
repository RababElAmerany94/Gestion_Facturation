import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NumberHelper } from 'app/core/helpers/number';
import { IRepartitionTypesTravauxParTechnicien } from '../../dashboard.model';

@Component({
    selector: 'kt-repartition-type-travaux-technicien',
    template: `
        <kt-portlet [class]="'kt-portlet__body--fit kt-portlet--border-bottom-brand'">

            <kt-portlet-header
                [title]="'CHART.VENTILATION_DES_TYPES_TRAVAUX_PAR_TECHNICIEN' | translate ">
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
                                {{model?.name}}: {{ formatNumber(model?.value) }} m²
                            </ng-template>
                            <ng-template #seriesTooltipTemplate let-model="model">
                                {{model[0]?.name}}: {{ formatNumber(model[0]?.value) }} m²
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
export class RepartitionTypeTravauxTechnicienComponent {

    data: {
        name: string,
        series: { name: number, value: number }[]
    }[] = [];

    @Input()
    set dataChart(value: IRepartitionTypesTravauxParTechnicien[]) {
        if (value != null) {
            this.initializeChart(value);
        }
    }

    constructor(
        protected translate: TranslateService
    ) { }

    /**
     * initialize chart
     * @param data the data of chart
     */
    initializeChart(data: IRepartitionTypesTravauxParTechnicien[]) {
        this.data = data.map(item => {
            return {
                name: item.technicien,
                series: item.surfaceParTypeTravaux.map(value => {
                    return {
                        name: this.translate.instant(`TYPE_TRAVAUX.${value.typeTravaux}`),
                        value: value.surfaceTraiter != null ? value.surfaceTraiter : 0,
                    };
                }),
            };
        });
    }

    /**
     * change number to price format
     */
    formatNumber(value: number){
        return NumberHelper.formatNumberPrice(value);
    }
}
