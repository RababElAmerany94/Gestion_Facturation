import { Component, OnInit, Input } from '@angular/core';
import { AvoirStatus } from 'app/core/enums/avoir-status.enum';

@Component({
    selector: 'kt-avoir-status',
    templateUrl: './avoir-status.component.html'
})
export class AvoirStatusComponent implements OnInit {

    /** the status of avoir */
    @Input() status: AvoirStatus;

    /** the enumeration status */
    AvoirStatus = AvoirStatus;

    constructor() { }

    ngOnInit() {
    }

}
