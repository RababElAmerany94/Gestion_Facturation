import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IArticle } from 'app/core/models/general/article.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NumberHelper } from 'app/core/helpers/number';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ArticleType } from 'app/core/enums/article-type.enum';

@Component({
    selector: 'kt-detail-article-dialog',
    templateUrl: './detail-article-dialog.component.html'
})
export class DetailArticleDialogComponent implements OnInit {

    /** the form edit */
    form: FormGroup;

    /** the title */
    title = 'TABLE_ARTICLE.DETAIL_ARTICLE';

    /** the list of remise types */
    remiseTypes: IDropDownItem<number, string>[] = [];

    constructor(
        @Inject(CalculationToken) private calculation: ICalculation,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, article: IArticle, remiseTypes: IDropDownItem<number, string>[] },
        private dialogRef: MatDialogRef<DetailArticleDialogComponent>,
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.initComponent();
    }

    /**
     * initialize form
     */
    initComponent() {
        this.title = this.data.title;
        this.remiseTypes = this.data.remiseTypes;
        this.initForm();
        if (this.data.article != null) {
            this.setDataForm(this.data.article);
        }
    }

    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            qte: [1, [Validators.required]],
            reference: ['', [Validators.required]],
            tva: [20, [Validators.required]],
            prixAchat: [0],
            prixHT: [0, [Validators.required]],
            description: [null],
            designation: [null, [Validators.required]],
            unite: [null],
            fournisseurId: [null],
            prixTTC: [0],
            remise: [0, [Validators.required]],
            remiseType: [RemiseType.Percent, [Validators.required]]
        });
    }

    /**
     * set data in form
     */
    setDataForm(article: IArticle) {
        this.form.setValue({
            fournisseurId: article.hasOwnProperty('fournisseurId') ? article.fournisseurId : null,
            qte: article.qte,
            reference: article.reference,
            tva: article.tva,
            prixAchat: article.hasOwnProperty('prixAchat') ? article.prixAchat : 0,
            prixHT: article.prixHT,
            description: article.description,
            designation: article.designation,
            unite: article.unite,
            prixTTC: this.calculation.priceTTC(article.prixHT, article.tva),
            remise: article.remise,
            remiseType: article.remiseType
        });
    }

    /**
     * subscribe change prix HT
     */
    subscribePrixHt() {
        const prix = this.calculation.priceTTC(this.getPrixHT(), this.getTva());
        this.form.get('prixTTC').setValue(prix);
    }

    /**
     * subscribe change prix TTC
     */
    subscribePrixTTC() {
        const prix = this.calculation.priceHT(this.getPrixTTC(), this.getTva());
        this.form.get('prixHT').setValue(prix);
    }

    /**
     * subscribe change prix TVA
     */
    subscribePrixTVA() {
        const prixTTC = this.calculation.priceTTC(this.getPrixHT(), this.getTva());
        this.form.get('prixTTC').setValue(prixTTC);
    }

    /**
     * get TVA from FORM
     */
    getTva() {
        const tva = this.form.get('tva').value;
        return NumberHelper.stringToFloat(tva);
    }

    /**
     * get prix TTC from FORM
     */
    getPrixTTC() {
        const prixTTC = this.form.get('prixTTC').value;
        return NumberHelper.stringToFloat(prixTTC);
    }

    /**
     * get prix HT from FORM
     */
    getPrixHT() {
        const prixHT = this.form.get('prixHT').value;
        return NumberHelper.stringToFloat(prixHT);
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            this.form.value.type = ArticleType.Produit;
            this.dialogRef.close(this.form.value);
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }
}
