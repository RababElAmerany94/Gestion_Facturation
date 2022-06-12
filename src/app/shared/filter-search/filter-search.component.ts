import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'kt-filter-search',
    templateUrl: './filter-search.component.html'
})
export class FilterSearchComponent {

    @Output() searchEvent = new EventEmitter();

    /** show body filter */
    showCardBody = false;

    constructor() { }

    /** emit search event */
    search() {
        this.searchEvent.emit();
    }
}
