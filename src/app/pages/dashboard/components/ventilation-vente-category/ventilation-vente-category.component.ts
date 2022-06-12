import { Component, Input, OnInit } from '@angular/core';
import { ArrayHelper } from 'app/core/helpers/array';
import { IGetFacturesArticlesByCategory } from '../../dashboard.model';

@Component({
    selector: 'kt-ventilation-vente-category',
    template: `
        <kt-portlet [class]="'kt-portlet__body--fit kt-portlet--border-bottom-brand'">

            <kt-portlet-header
                [title]="'CHART.VENTILATION_DES_VENTES_PAR_CATEGORIE' | translate ">
            </kt-portlet-header>

            <kt-portlet-body>
                <div style="height:400px">
                    <ng-container *ngIf="data?.length >0 ; else emptyResult">
                        <ngx-charts-pie-chart
                            [legend]="true"
                            [results]="data">
                        </ngx-charts-pie-chart>
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
export class VentilationVenteCategoryComponent {

    data: {
        name: string,
        value: number,
    }[] = [];

    @Input()
    set dataChart(value: IGetFacturesArticlesByCategory[]) {
        if (!ArrayHelper.isEmptyOrNull(value)) {
            this.initializeChart(value);
        }
    }

    constructor(
    ) { }

    /**
     * initialize chart data
     */
    initializeChart(data: IGetFacturesArticlesByCategory[]) {
        this.data = data.map(x => {
            return {
                name: x.name,
                value: x.total
            };
        });
    }

}
