import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AgendaCommercialTabs } from 'app/core/enums/agenda-commercial-tabs.enum';

@Component({
    selector: 'kt-agenda-commercial-tabs',
    templateUrl: './tabs.component.html'
})
export class AgendaCommercialTabsComponent {

    /** emit change event */
    @Output()
    changeSelected = new EventEmitter<AgendaCommercialTabs>();

    /** the index of selected tabs */
    @Input()
    selectedTab: AgendaCommercialTabs;

    @Input()
    changeColor: false;

    /** list tabs */
    tabs: AgendaCommercialTabs[] = [AgendaCommercialTabs.Agenda,
    AgendaCommercialTabs.Taches,
    AgendaCommercialTabs.RendezVous,
    AgendaCommercialTabs.Appels];

    constructor() { }

    /** tabs select changed */
    selectedTabs(indexTab: number) {
        this.selectedTab = this.tabs[indexTab];
        this.changeSelected.emit(this.selectedTab);
    }

}
