import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-label-tag',
    templateUrl: './label-tag.component.html'
})
export class LabelTagComponent extends BaseCustomUiComponent {

    @Input()
    label: string;

    @Input()
    tags: string[] = [];

    @Input()
    mode = ModeEnum.Add;

    /**
     * The tag update event
     */
    @Output()
    tagsEvent: EventEmitter<string[]> = new EventEmitter<string[]>();

    separatorKeysCodes: number[] = [ENTER, COMMA];
    removable = true;

    @ViewChild('tagInput', { static: false })
    tagInput: ElementRef<HTMLInputElement>;

    @ViewChild('auto', { static: false })
    matAutocomplete: MatAutocomplete;

    constructor() {
        super();
    }

    /**
     * add tag
     */
    add(event: MatChipInputEvent): void {
        if (this.control.valid) {
            const input = event.input;
            const value = event.value;

            if ((value || '').trim()) {
                this.tags.push(value.trim());
            }
            if (input) {
                input.value = '';
            }
            this.control.setValue(null);
            this.tagsEvent.emit(this.tags);
        }
    }

    /**
     * remove tag
     */
    remove(tag: string): void {
        const index = this.tags.indexOf(tag);
        if (index >= 0) {
            this.tags.splice(index, 1);
            this.tagsEvent.emit(this.tags.slice());
        }
    }

    /**
     * is show mode
     */
    isShowMode = () => this.mode === ModeEnum.Show;

}
