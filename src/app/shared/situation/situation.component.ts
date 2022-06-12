import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IDashboardFilterOption } from 'app/core/models/general/filter-option.model';

@Component({
    selector: 'kt-situation',
    templateUrl: './situation.component.html'
})
export class SituationComponent {

    @Output()
    searchEvent = new EventEmitter<IDashboardFilterOption>()

    @Input()
    numberOfFolder: number;

    @Input()
    chiffreAffaireStatistics: {
        name: string,
        series: { name: string, value: number }[]
    }[] = [];

    @Input()
    showFilterClient = true;

    constructor() { }

}
