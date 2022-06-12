import { Component, Input } from '@angular/core';
import { ICommercialPlanning } from 'app/pages/users/user.model';
import { AddressAndContactHelper } from 'app/core/helpers/addressAndContact';

@Component({
    selector: 'kt-commercials-planning-table-details',
    templateUrl: './commercials-planning-table-details.component.html',
    styles: []
})
export class CommercialsPlanningTableDetailsComponent {

    @Input()
    commercialPlanning: ICommercialPlanning;

    @Input()
    showTitle = false;

    @Input()
    title: string;

    /** list columns table */
    columns: string[];

    constructor() {
        this.initColumns();
    }


    //#region init component

    /**
     * initialize columns
     */
    initColumns() {
        this.columns = [
            'LABELS.CLIENT',
            'LABELS.HEURE',
            'ADDRESS.TITLE',
            'ADDRESS.VILLE',
            'ADDRESS.CODE_POSTAL',
            'CONTACTS.TITLE',
        ];
    }

    //#endregion

    //#region view setter and getter

    /**
     * display default address
     */
    getDefaultAddress(addresses: string) {
        return AddressAndContactHelper.getAddress(addresses);
    }

    /**
     * display default contact
     */
    getDefaultContact(contact: string) {
        return AddressAndContactHelper.buildPhraseContact(AddressAndContactHelper.getContact(contact));
    }

    //#endregion

}
