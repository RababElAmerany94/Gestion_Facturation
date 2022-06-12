import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'kt-agenda-commercial-status',
  templateUrl: './agenda-commercial-status.component.html'
})
export class AgendaCommercialStatusComponent {

  /** the status of echange commercial */
  @Input()
  status: EchangeCommercialStatus;

  /** the enumeration status */
  echangeCommercialStatus = EchangeCommercialStatus;

}
