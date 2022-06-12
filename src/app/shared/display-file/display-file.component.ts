import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'kt-display-file',
    templateUrl: './display-file.component.html',
    styleUrls: ['./display-file.component.scss']
})
export class DisplayFileComponent {

    /** display pdf data */
    displayData: string;

    constructor(
        public dialogRef: MatDialogRef<DisplayFileComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            displayData: string
        }
    ) {
        this.displayData = this.data.displayData;
    }

}
