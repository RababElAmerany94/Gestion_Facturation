import { Component, EventEmitter, Output } from '@angular/core';
import { AccountingTabs } from 'app/core/enums/accounting-tabs.enum';

@Component({
    selector: 'kt-index-accounting',
    templateUrl: './index.component.html'
})
export class IndexAccountingComponent {

    @Output()
    changeSelected = new EventEmitter<AccountingTabs>();

    /** the list of tabs */
    tabs: AccountingTabs[] = [];

    constructor() {
        this.initTabs();
    }

    /**
     * initialization tabs
     */
    initTabs() {
        this.tabs = [
            AccountingTabs.Sales,
            AccountingTabs.Bank,
            AccountingTabs.Caisse
        ];
    }

    /** tabs select changed */
    selectedTabs(indexTab: number) {
        this.changeSelected.emit(this.tabs[indexTab]);
    }

}
