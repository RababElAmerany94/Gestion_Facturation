import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { RouteName } from 'app/core/enums/route-name.enum';
import { SubSink } from 'subsink';
import { ColumnDataTable } from '../data-table/data-table.component';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { BasePermissions } from './base-permissions';

@Component({
    selector: 'kt-base-index-template',
    template: ''
})
export class BaseIndexTemplateComponent<IModelDataTables, IKey> extends BasePermissions implements OnDestroy {

    subs = new SubSink();

    /** filter emitter */
    @Output() filters = new EventEmitter<IFilterOption>();

    /** add emitter */
    @Output() addEvent = new EventEmitter();

    /** edit emitter */
    @Output() editEvent = new EventEmitter<IModelDataTables>();

    /** show emitter */
    @Output() showEvent = new EventEmitter<IModelDataTables>();

    /** delete emitter */
    @Output() deleteEvent = new EventEmitter<IKey>();

    /** columns table */
    columns: ColumnDataTable[] = [];

    /** the routes name */
    routeName = RouteName;

    constructor() {
        super();
    }

    /**
     * change dataTables
     */
    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filters.emit(dataTableOutput);
    }

    // #region click events

    /**
     * click add button
     */
    addClick() {
        this.addEvent.emit();
    }

    /**
     * edit button click
     */
    editClick(model: IModelDataTables) {
        this.editEvent.emit(model);
    }


    /**
     * show button click
     */
    showClick(model: IModelDataTables) {
        this.showEvent.emit(model);
    }

    //#endregion

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
