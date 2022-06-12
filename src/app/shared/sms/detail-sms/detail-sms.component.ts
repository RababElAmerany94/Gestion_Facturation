import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISmsModel } from '../sms.model';

@Component({
    selector: 'kt-detail-sms',
    templateUrl: './detail-sms.component.html',
    styleUrls: ['./detail-sms.component.scss']
})
export class DetailSmsComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DetailSmsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            sms: ISmsModel,
        },
    ) {
        this.initComponent();
    }

    sms: ISmsModel;

    ngOnInit(): void {
    }

    //#region init component

    /**
     * initialize component
     */
    initComponent() {
        if (this.data != null) {
            this.sms = this.data.sms;
        }
    }

    //#endregion

}
