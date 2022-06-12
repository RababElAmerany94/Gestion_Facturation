import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { DateHelper } from 'app/core/helpers/date';
import { StringHelper } from 'app/core/helpers/string';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { MemoDossier } from 'app/core/models/general/memo-dossier.model';
import { Memo, PieceJoin, AddMemoModalOutput } from 'app/core/models/general/memo.model';
import { ICategoryDocument } from 'app/pages/parametres/document-category/category-document.model';

@Component({
    selector: 'kt-add-memos',
    templateUrl: './add-memos.component.html',
    styleUrls: ['./add-memos.component.scss']
})
export class AddMemosComponent implements OnInit {

    form: FormGroup;
    title = 'MEMOS.ADD';
    files: File[] = [];
    maxFileSize = AppSettings.MAX_SIZE_FILE;
    currentCategory: ICategoryDocument;
    isDossier = false;
    accept = this.isDossier ? 'image/*,application/pdf' : '*';

    // edit memo
    editMemo: Memo;
    editMemoDossier: MemoDossier;
    removedFiles: PieceJoin[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string,
            memo: Memo,
            memoDossier: MemoDossier,
            isDossier: boolean
        },
        public dialogRef: MatDialogRef<AddMemosComponent>,
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.setData();
        this.initializeForm();
    }

    //#region private methods and helpers

    /**
     * set select category
     */
    setCategory(category: ICategoryDocument) {
        this.currentCategory = category;
    }

    private initializeForm() {
        if (this.isDossier) {
            this.currentCategory = this.editMemoDossier ? this.editMemoDossier.category : null;
            this.form = this.fb.group({
                commentaire: [this.editMemoDossier ? this.editMemoDossier.commentaire : null, [Validators.required]],
                name: [this.editMemoDossier ? this.editMemoDossier.name : null, [Validators.required]],
                category: [this.currentCategory ? this.currentCategory.id : null, [Validators.required]],
            });
        } else {
            this.form = this.fb.group({
                commentaire: [this.editMemo ? this.editMemo.commentaire : null, [Validators.required]]
            });
        }
    }

    private setData() {
        if (this.data != null) {
            this.isDossier = this.data.isDossier;
            this.title = this.data.title;
            this.editMemo = this.data.memo;
            this.editMemoDossier = this.data.memoDossier;
        }
    }

    private creationMemo(): Memo {
        if (this.editMemo == null) {
            return {
                commentaire: this.form.value.commentaire,
                date: DateHelper.formatDateTime(new Date().toString()),
                pieceJointes: [],
                userId: UserHelper.getUserId()
            };
        } else {
            return {
                ...this.editMemo,
                commentaire: this.form.value.commentaire
            };
        }
    }

    private creationMemoDossier(): MemoDossier {
        if (this.editMemoDossier == null) {
            return {
                commentaire: this.form.value.commentaire,
                name: this.form.value.name,
                category: this.currentCategory,
                date: DateHelper.formatDateTime(new Date().toString()),
                pieceJointes: [],
                userId: UserHelper.getUserId()
            }
                ;
        } else {
            return {
                ...this.editMemoDossier,
                commentaire: this.form.value.commentaire,
                name: this.form.value.name,
                category: this.currentCategory
            };
        }
    }

    //#endregion

    //#region events

    onSelect(event) {

        if (event.rejectedFiles.length > 0 && event.rejectedFiles.filter(e => e.reason = 'type').length > 0) {
            this.toastService.warning(this.translate.instant('ERRORS.FORMAT_INVALID_DOCUMENT'));
        }

        if (event.rejectedFiles.length > 0 && event.rejectedFiles.filter(e => e.reason = 'size').length > 0) {
            this.toastService.warning(this.translate.instant('ERRORS.SIZE'));
        }

        this.files.push(...event.addedFiles);
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    removeFile(index: number) {
        const removedFile = this.isDossier ?
            this.editMemoDossier.pieceJointes.splice(index, 1) :
            this.editMemo.pieceJointes.splice(index, 1);
        this.removedFiles = [...this.removedFiles, ...removedFile];
    }

    //#endregion

    //#region save changes

    save() {
        if (this.form.valid) {
            const data: AddMemoModalOutput = {
                memo: this.buildMemoObject(),
                removedFiles: this.removedFiles
            };
            this.dialogRef.close(data);
        } else {
            this.form.markAllAsTouched();
        }
    }

    buildMemoObject() {
        const memo: Memo = this.isDossier ? this.creationMemoDossier() : this.creationMemo();

        this.files.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {

                const pieceJoin: PieceJoin = {
                    name: StringHelper.guid(),
                    type: file.name.substring(file.name.lastIndexOf('.') + 1),
                    orignalName: file.name,
                    file: reader.result.toString()
                };

                memo.pieceJointes.push(pieceJoin);
            };
        });

        return memo;
    }

    //#endregion
}
