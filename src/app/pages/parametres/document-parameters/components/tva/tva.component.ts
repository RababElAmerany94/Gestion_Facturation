import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ITvaModel } from '../../document-parameter.model';
import { EditTvaComponent } from './edit-tva/edit-tva.component';

@Component({
    selector: 'kt-tva-card',
    templateUrl: './tva.component.html'
})
export class TvaComponent implements OnInit, OnDestroy {

    subs = new SubSink();

    @Output() tvaEventValue = new EventEmitter();

    @Input() formTva: FormGroup;
    @Input() formAddTva: FormGroup;
    @Input() tvaModels: ITvaModel[];

    showCardBody = false;

    constructor(
        private dialogMat: MatDialog,
        private translate: TranslateService) {
    }

    ngOnInit() {
        this.subscribeForm();
    }

    /** add tva to tva model */
    addTva() {
        if (this.formAddTva.valid) {
            this.tvaModels.push({ ... this.formAddTva.value });
            this.formAddTva.reset();
        } else {
            this.formAddTva.markAllAsTouched();
        }
    }

    /**
     * subscribe in form
     */
    subscribeForm() {
        this.subs.sink = this.formTva.valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(_ => {
                this.tvaEventValue.emit({ ...this.formTva.value, list: this.tvaModels });
            });
    }

    /** update tva */
    updateTva(index: number) {
        const list: ITvaModel = this.tvaModels[index];
        DialogHelper.openDialog(this.dialogMat, EditTvaComponent, DialogHelper.SIZE_SMALL, {
            list
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.tvaModels[index] = result;
                this.tvaEventValue.emit({ ...this.formTva.value, list: this.tvaModels });
            }
        });
    }

    /** delete tva */
    deleteTva(index: number) {
        DialogHelper.openConfirmDialog(this.dialogMat, {
            header: this.translate.instant('DOCUMENT_PARAMETER.TVA.DELETE.HEADER'),
            message: this.translate.instant('DOCUMENT_PARAMETER.TVA.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.tvaModels.splice(index, 1);
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
