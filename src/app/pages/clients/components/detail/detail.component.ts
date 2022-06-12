import { Component, Input } from '@angular/core';
import { ClientType } from 'app/core/enums/client-type.enum';

@Component({
    selector: 'kt-client-detail',
    templateUrl: './detail.component.html',
})
export class DetailComponent {

    @Input()
    type: ClientType = ClientType.Obliges;

    constructor() { }

    isObliges = () => this.type === ClientType.Obliges;
}
