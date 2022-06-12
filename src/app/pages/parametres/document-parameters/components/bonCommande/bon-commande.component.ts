import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'kt-bon-commande',
    templateUrl: './bon-commande.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonCommandeComponent {

    @Output()
    changeSelected = new EventEmitter<number>();

    @Input()
    formBonCommande: FormGroup;

    showCardBody = false;

    constructor() { }

    /** tabs select changed */
    selectedTabs() {
        this.changeSelected.emit();
    }

}
