import { TranslateService } from '@ngx-translate/core';
import { IDocumentStatisticByStatus } from './../../dashboard.model';
import { Component, Input } from '@angular/core';
import { NumberHelper } from 'app/core/helpers/number';

@Component({
    selector: 'kt-document-statistic',
    template: `
        <div class="kt-portlet kt-portlet--fit kt-portlet--head-noborder kt-portlet--height-fluid-half">
            <div class="kt-widget14">
                <div class="kt-widget14__header">
                    <h3 class="kt-widget14__title">
                        {{ title | translate }}
                    </h3>
                    <span class="kt-widget14__desc">
                        {{ sousTitle | translate }}
                    </span>
                </div>
                <div class="kt-widget14__content">
                    <ngx-charts-advanced-pie-chart
                        [results]="data"
                        [animations]="false"
                        [valueFormatting]="formatting">
                        <ng-template #tooltipTemplate let-model="model">
                            {{model?.name}}: {{ model?.value | RoundingNumber | Currency }}
                        </ng-template>
                    </ngx-charts-advanced-pie-chart>
                </div>
            </div>
        </div>
    `
})
export class DocumentStatisticComponent {

    data: {
        name: string,
        value: number
    }[] = [];

    @Input()
    title: string;

    @Input()
    sousTitle: string;

    @Input()
    prefixTranslateStatus: string;

    @Input()
    set dataStatistic(value: IDocumentStatisticByStatus[]) {
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
    initializeChart(data: IDocumentStatisticByStatus[]) {
        this.data = data.map(item => {
            return {
                name: this.translateStatus(item.status),
                value: item.total
            };
        });
    }

    /**
     * translate status
     * @param status the given status to translate
     */
    translateStatus(status: number) {
        return this.translate.instant(`${this.prefixTranslateStatus}.${status}`);
    }

    /**
     * formatting value
     */
    formatting(value: number) {
        return NumberHelper.formatNumberCurrency(value);
    }

}
