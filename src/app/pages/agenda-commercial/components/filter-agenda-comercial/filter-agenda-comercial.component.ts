import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgendaType } from 'app/core/enums/agenda-type.enum';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface OutputFilterAgendaCommercial {
    SearchQuery: string;
    responsableId: string;
    clientId: string;
    categorieId: string;
}

@Component({
    selector: 'kt-filter-agenda-comercial',
    templateUrl: './filter-agenda-comercial.component.html',
    styles: [
    ]
})
export class FilterAgendaComercialComponent {

    @Output()
    searchEvent = new EventEmitter<OutputFilterAgendaCommercial>();

    @Input()
    showFilterClient = false;

    @Input()
    title: string;

    @Input()
    icon: string;

    form: FormGroup;

    type = AgendaType;

    constructor(
        private fb: FormBuilder) {
        this.initializationForm();
    }

    /**
     * initialization form and detect changes
     */
    initializationForm() {
        this.form = this.fb.group({
            categorieId: [null, []],
            responsableId: [null, []],
            clientId: [null, []],
            search: [null, []],
        });
        this.form.valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(res => {
            this.searchEvent.emit(this.form.value);
        });
    }
}
