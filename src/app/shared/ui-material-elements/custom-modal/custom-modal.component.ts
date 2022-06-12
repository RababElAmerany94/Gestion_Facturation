import { Component, Input } from '@angular/core';

@Component({
  selector: 'kt-custom-modal',
  templateUrl: './custom-modal.component.html'
})
export class CustomModalComponent {

  /** title modal */
  @Input()
  title: string;

  constructor() { }

}
