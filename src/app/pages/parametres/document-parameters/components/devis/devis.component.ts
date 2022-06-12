import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'kt-devis',
    templateUrl: './devis.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevisComponent {

    @Output()
    changeSelected = new EventEmitter<number>();

    @Input()
    formDevis: FormGroup;

    showCardBody = false;

    constructor() { }

    /** tabs select changed */
    selectedTabs() {
        this.changeSelected.emit();
    }

}
