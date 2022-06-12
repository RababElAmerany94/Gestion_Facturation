import { Component, EventEmitter, OnDestroy, Output, Input } from '@angular/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { SubSink } from 'subsink';
import { FormGroup } from '@angular/forms';
import { IDocumentAssociate } from 'app/core/models/general/documentAssociate.model';
import { BasePermissions } from './base-permissions';

@Component({
    selector: 'kt-base-edit-template',
    template: ''
})
export class BaseEditTemplateComponent<IModel> extends BasePermissions implements OnDestroy {

    subs = new SubSink();

    /** add event */
    @Output() addEvent = new EventEmitter<IModel>();

    /** edit event */
    @Output() editEvent = new EventEmitter<IModel>();

    /** cancel event */
    @Output() cancelEvent = new EventEmitter();

    /** the mode of component */
    @Input() mode: ModeEnum;

    /** the form group */
    @Input() form: FormGroup;

    /** related documents */
    relatedDocs: IDocumentAssociate[] = [];

    constructor() {
        super();
    }

    /**
     * cancel edit
     */
    cancel() {
        this.cancelEvent.emit();
    }


    // #region view helpers
    isShowMode = () => this.mode === ModeEnum.Show;
    isEditMode = () => this.mode === ModeEnum.Edit;
    isAddMode = () => this.mode === ModeEnum.Add;
    // #endregion

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
