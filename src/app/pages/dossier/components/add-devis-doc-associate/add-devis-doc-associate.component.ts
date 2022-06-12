import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { DocType } from 'app/core/enums/doctype.enums';

@Component({
    selector: 'kt-add-devis-doc-associate',
    templateUrl: './add-devis-doc-associate.component.html'
})
export class AddDevisDocAssociateComponent {

    /** the title of component */
    title: string;

    /** the type of devis enumeration */
    devisType = DevisType;

    /** the type of devis enumeration */
    selectedType: DevisType;

    /** the primeCEE of devis */
    isPrimeCEE = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { isPrimeCEE: boolean, type: DocType },
        private matDialogRef: MatDialogRef<AddDevisDocAssociateComponent>
    ) {
        this.initializationData();
    }

    /**
     * initialize data
     */
    initializationData() {
        if (this.data != null) {
            this.isPrimeCEE = this.data.isPrimeCEE;
            this.title = this.data.type === DocType.BonCommande ? 'BON_COMMANDE.ADD_TITLE' : 'DEVIS.ADD_TITLE';
        }
    }

    /** select type */
    add() {
        this.matDialogRef.close(this.selectedType);
    }
}
