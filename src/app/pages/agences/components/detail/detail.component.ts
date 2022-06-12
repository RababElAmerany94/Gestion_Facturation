import { Component, Input } from '@angular/core';

@Component({
    selector: 'kt-agence-detail',
    templateUrl: './detail.component.html'
})
export class DetailComponent {

    @Input()
    set IsActive(value: boolean) {
        if (value != null) {
            this.isActive = value;
        }
    }

    isActive = false;

    constructor() { }

}
