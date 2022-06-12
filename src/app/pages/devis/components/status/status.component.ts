import { Component, Input } from '@angular/core';
import { DevisStatus } from 'app/core/enums/devis-status.enum';

@Component({
    selector: 'kt-status',
    templateUrl: './status.component.html'
})
export class StatusComponent {

    /** the status of devis */
    @Input()
    status: DevisStatus;

    /** the nouveau avancement percent of devis */
    @Input()
    nouveauAvancementPercent = 0.0;;

    /** the enumeration status */
    devisStatus = DevisStatus;
}
