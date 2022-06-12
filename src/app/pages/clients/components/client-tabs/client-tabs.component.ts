import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ClientType } from 'app/core/enums/client-type.enum';

@Component({
    selector: 'kt-client-tabs',
    templateUrl: './client-tabs.component.html'
})
export class ClientTabsComponent {

    /** emit change event */
    @Output()
    changeSelected = new EventEmitter<ClientType>();

    /** the index of selected tabs */
    @Input()
    selectedTab: ClientType;

    /** client type enumeration */
    clientType = ClientType;

    /** list tabs */
    tabs: ClientType[] = [ ClientType.Particulier, ClientType.Professionnel, ClientType.Obliges];

    constructor() { }

    /** tabs select changed */
    selectedTabs(indexTab: number) {
        this.selectedTab = this.tabs[indexTab];
        this.changeSelected.emit(this.selectedTab);
    }

}
