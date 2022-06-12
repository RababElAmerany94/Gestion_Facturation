import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { TranslationService } from 'app/core/layout';
import { IClientRelationModel } from 'app/core/models/general/client-relation.model';
import { AddRelationClientComponent } from './add-relation-client/add-relation-client.component';

@Component({
    selector: 'kt-relation-client',
    templateUrl: './relation-client.component.html'
})
export class RelationClientComponent implements OnInit {

    @Output()
    changeRelationClient = new EventEmitter();

    @Input()
    clientRelation: IClientRelationModel[] = [];

    @Input()
    mode: ModeEnum;

    @Input()
    title = 'RELATION_CLIENT.TITLE';

    modes = ModeEnum;

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private translationService: TranslationService
    ) { }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    /**
     * open add clientRelation dialog
     */
    addclientRelationDialog(): void {
        const data = { title: 'RELATION_CLIENT.ADD_RELATION_CLIENT', showIsDefault: true };
        DialogHelper
            .openDialog(this.dialog, AddRelationClientComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe((result: IClientRelationModel) => {
                if (result) {
                    this.clientRelation.push(result);
                    this.emitChange();
                }
            });
    }

    /**
     * open edit clientRelation dialog
     * @param index the index of clientRelation to edit
     */
    editclientRelationDialog(index: number) {
        const data = {
            clientRelation: this.clientRelation[index],
            showIsDefault: true,
            title: 'RELATION_CLIENT.EDIT_RELATION_CLIENT',
        };
        DialogHelper
            .openDialog(this.dialog, AddRelationClientComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe(result => {
                if (result) {
                    this.clientRelation[index] = result;
                    this.emitChange();
                }
            });
    }

    /**
     * delete clientRelation by index
     * @param addressIndex the index of clientRelation to delete
     */
    deleteclientRelation(addressIndex: number) {
        DialogHelper.openConfirmDialog(this.dialog, {
            header: this.translate.instant('RELATION_CLIENT.DELETE.HEADER_TEXT'),
            message: this.translate.instant('RELATION_CLIENT.DELETE.QUESTION'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.clientRelation.splice(addressIndex, 1);
            this.emitChange();
        });
    }

    /**
     * emit changes
     */
    emitChange() {
        this.changeRelationClient.emit(this.clientRelation);
    }

    //#endregion
}
