import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild, QueryList
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
    selector: 'kt-mat-select-search',
    templateUrl: './mat-select-search.component.html',
    styleUrls: ['./mat-select-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSelectSearchComponent implements OnInit, OnDestroy, AfterViewInit {

    subSink = new SubSink();

    /** Event that emits when the current value changes */
    @Output() changeEvent = new EventEmitter<string>();

    /** Label of the search placeholder */
    @Input() placeholderLabel = 'LABELS.SEARCH';

    /** Label to be shown when no entries are found. Set to null if no message should be shown. */
    @Input() noEntriesFoundLabel = 'LABELS.ELEMENT_NOT_FOUND';

    /** Reference to the search input field */
    @ViewChild('searchSelectInput', { static: true }) searchSelectInput: ElementRef;

    /** the control of search query field */
    formControl = new FormControl();

    /** the current value of search */
    value: string;

    /** Whether the backdrop class has been set */
    private overlayClassSet = false;

    /** Reference to the MatSelect options  */
    options: QueryList<MatOption>;


    constructor(
        @Inject(MatSelect) public matSelect: MatSelect,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        // set custom panel class
        const panelClass = 'mat-select-search-panel';
        if (this.matSelect.panelClass) {
            if (Array.isArray(this.matSelect.panelClass)) {
                this.matSelect.panelClass.push(panelClass);
            } else if (typeof this.matSelect.panelClass === 'string') {
                this.matSelect.panelClass = [this.matSelect.panelClass, panelClass];
            } else if (typeof this.matSelect.panelClass === 'object') {
                this.matSelect.panelClass[panelClass] = true;
            }
        } else {
            this.matSelect.panelClass = panelClass;
        }

        // when the select dropdown panel is opened or closed
        this.subSink.sink = this.matSelect.openedChange
            .subscribe((opened) => {
                if (opened) {
                    // focus the search field when opening
                    this._focus();
                } else {
                    // clear it when closing
                    this._reset();
                }
            });

        // set the first item active after the options changed
        this.subSink.sink = this.matSelect.openedChange
            .pipe(take(1))
            .subscribe(() => {
                this.options = this.matSelect.options;
                this.subSink.sink = this.options.changes.subscribe(() => {
                    const keyManager = this.matSelect._keyManager;
                    if (keyManager && this.matSelect.panelOpen) {
                        // avoid "expression has been changed" error
                        setTimeout(() => {
                            keyManager.setFirstItemActive();
                        });
                    }
                });
            });

        // detect changes when the input changes
        this.subSink.sink = this.changeEvent
            .subscribe(() => {
                this.changeDetectorRef.detectChanges();
            });

        this.onFormControlChange();
    }

    ngOnDestroy() {
        this.subSink.unsubscribe();
    }

    ngAfterViewInit() {
        this.setOverlayClass();
    }

    /**
     * Handles the key down event with MatSelect.
     * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
     */
    _handleKeydown(event: KeyboardEvent) {
        event.stopPropagation();
    }

    onFormControlChange() {
        this.subSink.sink = this.formControl.valueChanges
            .pipe(debounceTime(700), distinctUntilChanged())
            .subscribe(value => {
                const valueChanged = value !== this.value;
                if (valueChanged) {
                    this.value = value;
                    this.changeEvent.emit(value);
                }
            });
    }

    /**
     * Focuses the search input field
     */
    public _focus() {
        if (!this.searchSelectInput) {
            return;
        }
        // save and restore scrollTop of panel, since it will be reset by focus()
        // note: this is hacky
        const panel = this.matSelect.panel.nativeElement;
        const scrollTop = panel.scrollTop;

        // focus
        this.searchSelectInput.nativeElement.focus();

        panel.scrollTop = scrollTop;
    }

    /**
     * Resets the current search value
     * @param focus whether to focus after resetting
     */
    public _reset(focus?: boolean) {
        if (!this.searchSelectInput) {
            return;
        }
        this.formControl.setValue('');
        if (focus) {
            this._focus();
        }
    }

    /**
     * Sets the overlay class  to correct offsetY
     * so that the selected option is at the position of the select box when opening
     */
    private setOverlayClass() {

        if (this.overlayClassSet) {
            return;
        }
        const overlayClass = 'cdk-overlay-pane-select-search';

        this.subSink.sink = this.matSelect.overlayDir.attach
            .subscribe(() => {
                // note: this is hacky, but currently there is no better way to do this
                this.searchSelectInput.nativeElement
                    .parentElement
                    .parentElement
                    .parentElement
                    .parentElement
                    .parentElement
                    .classList
                    .add(overlayClass);
            });

        this.overlayClassSet = true;
    }
}
