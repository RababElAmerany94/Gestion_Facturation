import { Component, Input } from '@angular/core';

export interface IMatMenuItem {
  action: () => void;
  icon: string;
  title: string;
  appear: boolean;
}

@Component({
  selector: 'kt-custom-mat-menu',
  templateUrl: './custom-mat-menu.component.html'
})
export class CustomMatMenuComponent {

  @Input()
  items: IMatMenuItem[] = [];

  constructor() { }

}
