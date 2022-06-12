import { Component, Output, Input, EventEmitter } from '@angular/core';
import { AgendaType } from 'app/core/enums/agenda-type.enum';

@Component({
    selector: 'kt-agenda-tabs',
    templateUrl: './agenda-tabs.component.html'
})
export class AgendaTabsComponent {

    /** emit change event */
    @Output()
    changeSelected = new EventEmitter<AgendaType>();

    /** the index of selected tabs */
    @Input()
    selectedTab: AgendaType;

    /** list tabs */
    tabs: AgendaType[] = [
        AgendaType.TacheType,
        AgendaType.RdvType,
        AgendaType.AppelType,
        AgendaType.EvenementCategorie,
        AgendaType.SourceRDV
    ];

    constructor() { }

    /** tabs select changed */
    selectedTabs(indexTab: number) {
        this.selectedTab = this.tabs[indexTab];
        this.changeSelected.emit(this.selectedTab);
    }

}
