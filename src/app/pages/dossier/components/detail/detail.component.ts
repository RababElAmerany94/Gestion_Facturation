import { Component, Input } from '@angular/core';

@Component({
    selector: 'kt-dossier-detail',
    templateUrl: './detail.component.html',
})
export class DetailComponent {

    @Input()
    canAddVisiteTechnique = false;

    constructor() { }

}
