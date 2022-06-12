import { Component, EventEmitter, Output, Input } from '@angular/core';
import { DossierTabs } from 'app/core/enums/dossier-tabs.enum';

@Component({
    selector: 'kt-dossier-tabs',
    templateUrl: './dossier-tabs.component.html'
})
export class DossierTabsComponent {

    /** emit change event */
    @Output()
    changeSelected = new EventEmitter<DossierTabs>();

    /** the index of selected tabs */
    @Input()
    selectedTab: DossierTabs;

    /** list tabs */
    tabs: DossierTabs[] = [DossierTabs.AValider,
    DossierTabs.AVenir,
    DossierTabs.AReplanifier,
    DossierTabs.Toutes,
    DossierTabs.DemandeDepuisWeb];

    constructor() { }

    /** tabs select changed */
    selectedTabs(indexTab: number) {
        this.selectedTab = this.tabs[indexTab];
        this.changeSelected.emit(this.selectedTab);
    }
}
