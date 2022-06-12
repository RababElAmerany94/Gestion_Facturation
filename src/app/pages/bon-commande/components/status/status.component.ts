import { Component, Input } from '@angular/core';
import { BonCommandeStatus } from 'app/core/enums/bon-commande-status.enum';

@Component({
    selector: 'kt-status',
    templateUrl: './status.component.html'
})
export class StatusComponent {

    /** the status of Bon Commande */
    @Input()
    status: BonCommandeStatus;

    /** the enumeration status */
    bonCommandeStatus = BonCommandeStatus;

}
