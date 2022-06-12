import { Component, Input } from '@angular/core';
import { ArrayHelper } from 'app/core/helpers/array';
import { IRepartitionDossiersTechnicien } from '../../dashboard.model';

@Component({
    selector: 'kt-repartition-dossier-technicien',
    template: `
        <kt-portlet [class]="'kt-portlet__body--fit kt-portlet--border-bottom-brand'">

            <kt-portlet-header
                [title]="'CHART.REPARTITION_DOSSIER_TECHNICIEN' | translate ">
            </kt-portlet-header>

            <kt-portlet-body>
                <div style="height:400px">
                    <ng-container *ngIf="data?.length >0 ; else emptyResult">
                        <ngx-charts-bar-horizontal
                            [legend]="false"
                            [showXAxisLabel]="false"
                            [showYAxisLabel]="false"
                            [xAxis]="true"
                            [yAxis]="true"
                            [results]="data"
                            >
                        </ngx-charts-bar-horizontal>
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
export class RepartitionDossierTechnicienComponent {

    data: {
        name: string,
        value: number,
    }[] = [];

    @Input()
    set dataChart(value: IRepartitionDossiersTechnicien[]) {
        if (!ArrayHelper.isEmptyOrNull(value)) {
            this.initializeChart(value);
        }
    }

    constructor(
    ) { }

    /**
     * initialize chart data
     */
    initializeChart(data: IRepartitionDossiersTechnicien[]) {
        this.data = data.map(x => {
            return {
                name: x.technicien,
                value: x.nombreDossiers
            };
        });
    }

}
