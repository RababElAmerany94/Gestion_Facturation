import { Component, EventEmitter, Input, OnDestroy, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
    selector: 'kt-facture-card',
    templateUrl: './facture.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FactureComponent implements OnDestroy {

    subs = new SubSink();

    @Output()
    changeSelected = new EventEmitter<number>();

    @Input()
    formFacture: FormGroup;

    /** show and hide model */
    showCardBody = false;

    constructor() { }

    /** tabs select changed */
    selectedTabs() {
        this.changeSelected.emit();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
