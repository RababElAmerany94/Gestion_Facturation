import { Component, Input } from '@angular/core';
import { FactureStatus } from 'app/core/enums/facture-status.enum';

@Component({
  selector: 'kt-facture-status',
  templateUrl: './facture-status.component.html'
})
export class FactureStatusComponent {

  /** the status of facture */
  @Input() status: FactureStatus;

  /** the enumeration status */
  factureStatus = FactureStatus;

}
