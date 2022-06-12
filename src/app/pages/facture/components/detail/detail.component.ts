import { Component, Input } from '@angular/core';
import { FactureStatus } from 'app/core/enums/facture-status.enum';

@Component({
  selector: 'kt-facture-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent {

  showPayment = false;

  @Input() set status(value: FactureStatus) {
    if (value) {
      this.showPayment = this.canShowPayment(value);
    }
  }

  constructor() { }

  private canShowPayment(value: FactureStatus): boolean {
    return value === FactureStatus.ENCOURS || value === FactureStatus.ENRETARD || value === FactureStatus.CLOTUREE;
  }
}
