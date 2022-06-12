import { Component, ContentChild, EventEmitter, Input, OnInit, Output, ElementRef, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IPagedResult } from 'app/core/models/general/result-model';
import { AppSettings } from 'app/app-settings/app-settings';
import { StringHelper } from 'app/core/helpers/string';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { SortDirection } from 'app/core/enums/sort-direction';
import { UserHelper } from 'app/core/helpers/user';

export interface ColumnDataTable {
    name: string;
    nameTranslate: string;
    isOrder: boolean;
    type: ColumnType;
}

export enum ColumnType {
    Date,
    DateTime,
    Currency,
    Translate,
    Number,
    Tags,
    List,
    colorNews,
    Status,
    Html,
    any,
    longText,
}

@Component({
    selector: 'kt-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements OnInit {

    @ContentChild('actionsTemplate', { static: true })
    actionsTemplate: QueryList<ElementRef>;

    @ContentChild('statusTemplate', { static: true })
    statusTemplate: QueryList<ElementRef>;

    @Output()
    changeEvent = new EventEmitter<IFilterOption>();

    @Input()
    title: string;

    @Input()
    columns: ColumnDataTable[];

    @Input()
    name: string;

    @Input()
    isAction = true;

    @Input()
    set orderBy(value: string) {
        if (!StringHelper.isEmptyOrNull(value)) {
            this.state.OrderBy = value;
        }
    }

    @Input() set data(val: IPagedResult<any>) {
        if (val == null) {
            this.items = [];
            this.rowCount = 0;
        } else {
            this.items = val.value;
            this.rowCount = val.rowCount;
        }
    }

    @Input() set defaultColumnOrder(value: string) {
        if (!StringHelper.isEmptyOrNull(value)) {
            this.state = { ...this.state, OrderBy: value };
        }
    }

    items: any[];
    rowCount: number;
    checkedColumns: boolean[] = [];
    state: IFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };
    pageSizeOptions = AppSettings.PAGE_SIZE_OPTIONS;
    searchFormControl = new FormControl();
    columnType: typeof ColumnType = ColumnType;

    constructor() { }

    ngOnInit() {
        this.retrieveState();
        this.getCheckedColumns();
        this.subscribeSearchQuery();
    }

    // #region changes dataTables

    subscribeSearchQuery() {
        this.searchFormControl.valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(searchQuery => {
            this.state.SearchQuery = searchQuery;
            this.saveState();
        });
    }

    sortChange(event: any) {
        if (!StringHelper.isEmptyOrNull(event.direction)) {
            this.state.OrderBy = event.active;
            this.state.SortDirection = event.direction;
            this.saveState();
        }
    }

    pageChange(event: any) {
        this.state.Page = event.pageIndex + 1;
        this.state.PageSize = event.pageSize;
        this.saveState();
    }

    // #endregion

    // #region checked columns

    getCheckedColumns() {
        const checkedColumns = localStorage.getItem(`item_column_${UserHelper.getUserId()}_${this.name}`);
        const data = JSON.parse(checkedColumns) as boolean[];
        this.checkedColumns = (data == null ? this.getDefaultCheckedColumns() : data);
    }

    setCheckedColumns(value: boolean[]) {
        localStorage.setItem(`item_column_${UserHelper.getUserId()}_${this.name}`, JSON.stringify(value));
    }

    getDefaultCheckedColumns() {
        const checkedColumns = [];
        for (const _ of this.columns) { checkedColumns.push(true); }
        if (this.isAction) { checkedColumns.push(true); }
        return checkedColumns;
    }

    // #endregion

    // #region helpers

    getColumnsName() {
        const columns = this.columns.map(e => e.name);
        if (this.isAction) {
            columns.push('actions');
        }
        return columns;
    }

    getColumnsNameTranslated() {
        const columns = this.columns.map(e => e.nameTranslate);
        if (this.isAction) {
            columns.push('LABELS.ACTIONS');
        }
        return columns;
    }

    emitChange() {
        this.changeEvent.emit(this.state);
    }

    // #endregion

    // #region save and retrieve state

    /**
     * save current state
     */
    saveState() {
        localStorage.setItem(`state_${UserHelper.getUserId()}_${this.name}`, JSON.stringify(this.state));
        this.emitChange();
    }

    /**
     * retrieve old state
     */
    retrieveState() {
        const oldState = localStorage.getItem(`state_${UserHelper.getUserId()}_${this.name}`);
        if (oldState != null && oldState !== '') {
            this.state = JSON.parse(oldState);
            this.searchFormControl.setValue(this.state.SearchQuery);
        }
        this.emitChange();
    }

    // #endregion

}
