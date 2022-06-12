import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ArticleType } from 'app/core/enums/article-type.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IArticle } from 'app/core/models/general/article.model';

@Component({
    selector: 'kt-add-ligne-article',
    templateUrl: './add-ligne-article.component.html'
})
export class AddLigneArticleComponent {

    /** the form TO LIGNE */
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddLigneArticleComponent>,
        private toastService: ToastService,
        private translate: TranslateService
    ) {
        this.initForm();
    }
    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            description: [null, [Validators.required]],
            designation: [null, [Validators.required]],
        });
    }
    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            const article: IArticle = {
                id: '',
                description: this.form.value.description,
                designation: this.form.value.designation,
                fournisseurId: null,
                prixAchat: 0,
                prixHT: 0,
                tva: 0,
                prixOriginal: 0,
                qte: 0,
                reference: '',
                remise: 0,
                remiseType: RemiseType.Currency,
                prixParTranche: [],
                totalHT: 0,
                totalTTC: 0,
                unite: null,
                percentTotalHtRateTVA: 0,
                category: null,
                type: ArticleType.Ligne
            };
            this.dialogRef.close(article);
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }
}
