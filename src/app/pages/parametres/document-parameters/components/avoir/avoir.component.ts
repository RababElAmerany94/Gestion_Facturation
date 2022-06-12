import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'kt-avoir-card',
    templateUrl: './avoir.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvoirComponent {

    @Output()
    changeSelected = new EventEmitter<number>();

    @Input()
    formAvoir: FormGroup;

    /** show hide card */
    showCardBody = false;

    constructor() { }

    /** tabs select changed */
    selectedTabs() {
        this.changeSelected.emit();
    }

}
