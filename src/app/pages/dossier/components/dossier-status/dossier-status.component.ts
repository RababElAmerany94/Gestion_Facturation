import { Component, Input } from '@angular/core';
import { DossierStatus } from 'app/core/enums/dossier-status.enums';

@Component({
  selector: 'kt-dossier-status',
  templateUrl: './dossier-status.component.html'
})
export class DossierStatusComponent {

  /** the status of dossier */
  @Input()
  status: DossierStatus;

  /** the enumeration status */
  dossierStatus = DossierStatus;

}
