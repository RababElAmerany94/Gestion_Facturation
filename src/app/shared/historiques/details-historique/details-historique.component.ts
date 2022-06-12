import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'kt-details-historique',
    templateUrl: './details-historique.component.html',
    styleUrls: ['./details-historique.component.scss']
})
export class DetailsHistoriqueComponent implements OnInit {

    details: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { detailsHistory},
        private dialogRef: MatDialogRef<DetailsHistoriqueComponent>
    ) { }

    ngOnInit() {
        this.initializationData();
    }

    initializationData() {
        this.details = this.data.detailsHistory;
    }

    close() {
        this.dialogRef.close(true);
    }

}
