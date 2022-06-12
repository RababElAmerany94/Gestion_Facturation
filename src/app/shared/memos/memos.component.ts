import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from 'app/core/enums/result-status';
import { CopyHelper } from 'app/core/helpers/copy';
import { DialogHelper } from 'app/core/helpers/dialog';
import { FileHelper } from 'app/core/helpers/file';
import { MemoHelper } from 'app/core/helpers/memo';
import { StringHelper } from 'app/core/helpers/string';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Memo, PieceJoin, AddMemoModalOutput } from 'app/core/models/general/memo.model';
import { FileManagerService } from 'app/core/services/file-manager/file-manager.service';
import { PreviewBase64Component } from '../preview-base64/preview-base64.component';
import { AddMemosComponent } from './add-memos/add-memos.component';
import { MemoDossier } from 'app/core/models/general/memo-dossier.model';

@Component({
    selector: 'kt-memos',
    templateUrl: './memos.component.html',
    styles: ['.fa {font-size: 1.2em;}']
})
export class MemosComponent {

    @Output()
    saveMemoEvent = new EventEmitter<Memo[]>();

    @Input()
    set Memos(val: Memo[]) {
        if (val) {
            this.memos = val;
        }
    }

    @Input()
    title = 'MEMOS.TITLE';

    @Input()
    isDossier = false;

    memos: Memo[] | MemoDossier[] = [];

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
        private dialog: MatDialog,
        private fileManagerService: FileManagerService,
        private matDialog: MatDialog) { }

    //#region memos

    /**
     * open add address dialog
     */
    addMemo(): void {
        const data = { title: this.isDossier ? 'MEMOS_DOSSIER.ADD' : 'MEMOS.ADD', isDossier: this.isDossier };
        DialogHelper.openDialog(this.dialog, AddMemosComponent, DialogHelper.SIZE_MEDIUM, data).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result) && result as AddMemoModalOutput) {
                FileHelper.UploadMemo(this.fileManagerService, result.memo, (memo: Memo) => {
                    this.memos = MemoHelper.addMemoToMemos(this.memos, memo);
                    this.emitSaveMemo();
                }, () => {
                    this.errorUpload();
                });
            }
        });
    }

    /**
     * remove memo
     */
    removeMemo(index: number) {
        const memo = this.memos[index];
        const filesNames = memo.pieceJointes.map(e => e.name);
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant(`${this.isDossier ? 'MEMOS_DOSSIER' : 'MEMOS'}.DELETE.HEADER`),
            message: this.translate.instant(`${this.isDossier ? 'MEMOS_DOSSIER' : 'MEMOS'}.DELETE.MESSAGE`),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant(`LABELS.CONFIRM_${this.isDossier ? 'DELETE_LA' : 'DELETE_LE'}`)
        }, () => {
            this.deleteFiles(filesNames, () => {
                this.memos.splice(index, 1);
                this.emitSaveMemo();
            });
        });
    }

    /**
     * edit memo
     */
    editMemo(index: number) {
        const data = {
            memo: this.isDossier ? null : CopyHelper.copy(this.memos[index]),
            memoDossier: this.isDossier ? CopyHelper.copy(this.memos[index]) : null,
            title: this.isDossier ? 'MEMOS_DOSSIER.EDIT' : 'MEMOS.EDIT',
            isDossier: this.isDossier
        };
        DialogHelper.openDialog(this.dialog, AddMemosComponent, DialogHelper.SIZE_MEDIUM, data).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result) && result as AddMemoModalOutput) {
                FileHelper.UploadMemo(this.fileManagerService, result.memo, (memo: Memo) => {
                    this.memos[index] = memo;
                    this.emitSaveMemo();
                }, () => {
                    this.errorUpload();
                });

                if (result.removedFiles.length > 0) {
                    this.deleteFiles(result.removedFiles.map(e => e.name), () => null);
                }
            }
        });
    }

    //#endregion

    //#region files

    /**
     * download file
     */
    downloadFile(piece: PieceJoin) {
        FileHelper.downloadMemo(this.fileManagerService, piece, this.toastService, this.translate);
    }

    /**
     * display file
     */
    displayFile(piece: PieceJoin) {
        this.fileManagerService.Get(piece.name).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                DialogHelper.openDialog(
                    this.dialog,
                    PreviewBase64Component,
                    DialogHelper.SIZE_LARGE,
                    { base64: result.value });
            } else {
                this.errorServer();
            }
        });
    }

    /**
     * remove file
     */
    removeFile(memoIndex: number, pieceJointIndex: number) {
        const fileName = this.memos[memoIndex].pieceJointes[pieceJointIndex].name;
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('MEMOS.DELETE_FILE.HEADER'),
            message: this.translate.instant('MEMOS.DELETE_FILE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteFiles([fileName], () => {
                this.memos[memoIndex].pieceJointes.splice(pieceJointIndex, 1);
                this.emitSaveMemo();
            });
        });
    }

    //#endregion

    //#region services

    private deleteFiles(filesNames: string[], callbackSuccess: () => void = null) {
        this.fileManagerService.DeleteList(filesNames).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastService.success(this.translate.instant('SUCCESS.DELETE'));
                if (callbackSuccess != null) {
                    callbackSuccess();
                }
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    //#endregion

    //#region helpers

    emitSaveMemo() {
        this.saveMemoEvent.emit(this.memos);
    }


    private errorServer() {
        this.toastService.error(this.translate.instant('ERRORS.SERVER'));
    }

    private errorUpload() {
        this.toastService.success(this.translate.instant('ERRORS.UPLOAD_FILE'));
    }

    //#endregion
}
