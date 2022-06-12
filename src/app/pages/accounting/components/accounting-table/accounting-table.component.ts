import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountingTabs } from 'app/core/enums/accounting-tabs.enum';
import { PeriodeComptableFilter } from 'app/core/enums/periode-comptable.enum';
import { RouteName } from 'app/core/enums/route-name.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ColumnDataTable } from 'app/shared/data-table/data-table.component';

@Component({
    selector: 'kt-accounting-table',
    templateUrl: './accounting-table.component.html'
})
export class AccountingTableComponent implements OnInit {

    /** filter event */
    @Output()
    filters = new EventEmitter();

    /** export event */
    @Output()
    exportEvent = new EventEmitter();

    /** set data */
    @Input()
    set data(data: IPagedResult<any>) {
        if (data != null) {
            this.journalData = { ...data as IPagedResult<any> };
            this.journalData.value = data.value;
        }
    }

    /** array columns */
    @Input()
    columns: ColumnDataTable[];

    /** the filter options */
    @Input()
    filterOptions: any;

    /** set tab type */
    @Input()
    set tabType(value: AccountingTabs) {
        if (value != null) {
            this.type = value;
            this.initializeFilter();
        }
    }

    /** period comptable */
    PeriodeComptable: IDropDownItem<number, string>[] = [];

    /** the enumeration of routes */
    routeName: typeof RouteName = RouteName;

    /** the form group */
    form: FormGroup;

    /** the list data of journal */
    journalData: IPagedResult<any>;

    /** the type of tab selected */
    type: AccountingTabs;

    /** show the interval */
    showInterval = false;

    constructor(private fb: FormBuilder) {
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            period: [PeriodeComptableFilter.All],
            dateFrom: [null],
            dateTo: [null]
        });
        this.form.controls.period.valueChanges.subscribe(value => {
            if (value === PeriodeComptableFilter.Interval) {
                this.showInterval = true;
            } else {
                this.showInterval = false;
            }
        });
    }

    ngOnInit() {
        this.chargeAccountingPeriod();
    }

    /** search event */
    searchEvent() {
        this.filterOptions = {
            ...this.filterOptions,
            period: this.form.controls.period.value,
            dateFrom: this.form.controls.period.value === PeriodeComptableFilter.Interval ? this.form.controls.dateFrom.value : null,
            dateTo: this.form.controls.period.value === PeriodeComptableFilter.Interval ? this.form.controls.dateTo.value : null
        };
        this.filters.emit(this.filterOptions);
    }

    /**
     * change dataTables
     */
    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOptions = { ...this.filterOptions, ...dataTableOutput };
        this.filters.emit(this.filterOptions);
    }

    /** export click */
    exportClick() {
        this.exportEvent.emit(this.filterOptions);
    }

    /** period comptable enum  */
    chargeAccountingPeriod() {
        this.PeriodeComptable = ConversionHelper.convertEnumToListKeysValues(PeriodeComptableFilter, 'number');
        this.PeriodeComptable.forEach(e => e.text = `PERIOD_COMPTABLE.${e.value}`);
    }

    initializeFilter() {
        switch (this.type) {

            case AccountingTabs.Bank:
                this.filterOptions.isForCaisse = false;
                break;

            case AccountingTabs.Caisse:
                this.filterOptions.isForCaisse = true;
                break;
        }
    }

}
