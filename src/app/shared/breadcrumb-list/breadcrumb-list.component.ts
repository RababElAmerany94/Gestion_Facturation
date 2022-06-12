import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModeEnum } from 'app/core/enums/mode.enum';

@Component({
    selector: 'kt-breadcrumb-list',
    template: `
    <div class="row mb-1">
        <div class="col-6">
            <h3 *ngIf="showTitle" class="kt-subheader__title">{{ title }}</h3>
        </div>
        <div class="col-6 text-right" *ngIf="!isListMode()">
            <button class="btn btn-brand" (click)="cancel()" >
                <i class="fa fa-arrow-left"></i>
                {{ 'LABELS.RETURN' | translate }}
            </button>
        </div>
    </div>
    <nav aria-label="breadcrumb" *ngIf="showTitle">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" [ngClass]="{'active': !isListMode()}">
                <ng-container *ngIf="isListMode()">
                    {{ 'LABELS.LIST' | translate }}
                </ng-container>
                <ng-container *ngIf="!isListMode()">
                    <a href="javascript:void(0);" (click)="modeList()">
                        {{ 'LABELS.LIST' | translate }}
                    </a>
                </ng-container>
            </li>
            <li class="breadcrumb-item active" *ngIf="isEditMode()">
                {{ 'LABELS.EDIT' | translate }}
            </li>
            <li class="breadcrumb-item active" *ngIf="isAddMode()">
                {{ 'LABELS.ADD' | translate }}
            </li>
            <li class="breadcrumb-item active" *ngIf="isShowMode()">
                {{ 'LABELS.SHOW' | translate }}
            </li>
        </ol>
    </nav>
`})
export class BreadcrumbListComponent {

    /** mode change event */
    @Output()
    modeChangeEvent = new EventEmitter<ModeEnum>();

    /** mode change event */
    @Output()
    cancelEvent = new EventEmitter();

    /** the mode as list */
    @Input()
    mode = ModeEnum.List;

    @Input()
    title: string;

    @Input()
    showTitle = true;

    constructor() { }

    /** show mode to list */
    modeList() {
        this.mode = ModeEnum.List;
        this.modeChangeEvent.emit(this.mode);
    }

    cancel() {
        this.cancelEvent.emit();
    }

    // #region modes
    isShowMode = () => this.mode === ModeEnum.Show;
    isEditMode = () => this.mode === ModeEnum.Edit;
    isAddMode = () => this.mode === ModeEnum.Add;
    isListMode = () => this.mode === ModeEnum.List;
    // #endregion

}
