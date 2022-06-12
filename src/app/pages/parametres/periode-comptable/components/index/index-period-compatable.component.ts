import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { IPeriodeComptable } from '../../period-comptable.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ColumnType } from 'app/shared/data-table/data-table.component';

@Component({
    selector: 'kt-index-peripd-comptable',
    templateUrl: './index-period-compatable.component.html',
})
export class IndexPeriodCompatableComponent extends BaseIndexTemplateComponent<IPeriodeComptable, string>  {

    @Input() set data(values: IPagedResult<IPeriodeComptable>) {
        if (values != null) {
            this.periodesComptable = { ...values as IPagedResult<any> };
            this.periodesComptable.value = values.value;
        }
    }

    @Output() ClosingPeriodEvent = new EventEmitter();

    /** the list of period comptable */
    periodesComptable: IPagedResult<IPeriodeComptable>;

    constructor(
    ) {
        super();
        this.setColumns();
        this.setModule(this.modules.Parameters);
    }
    /**
     * set columns table
     */
    setColumns() {
        this.columns = [
            {
                name: 'dateDebut',
                nameTranslate: 'LABELS.DUREE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'period',
                nameTranslate: 'LABELS.DATE_START',
                isOrder: true,
                type: ColumnType.any
            }
        ];
    }
    /** cloture event click */
    cloturePeriod(id: string) {
        this.ClosingPeriodEvent.emit(id);
    }
}
