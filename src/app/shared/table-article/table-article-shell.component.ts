import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { ArticleType } from 'app/core/enums/article-type.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { DialogHelper } from 'app/core/helpers/dialog';
import { NumberHelper } from 'app/core/helpers/number';
import { ObjectHelper } from 'app/core/helpers/object';
import { StringHelper } from 'app/core/helpers/string';
import { IArticle } from 'app/core/models/general/article.model';
import { IInputTableArticleComponent, IResultCalculationModel } from 'app/core/models/general/calculation.model';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AddLigneArticleComponent } from './components/add-ligne-article/add-ligne-article.component';
import { DetailArticleDialogComponent } from './components/detail-article-dialog/detail-article-dialog.component';
import { SelectArticlesDialogComponent } from './components/select-articles-dialog/select-articles-dialog.component';

/**
 * the type of table articles
 */
export enum TableArticleMode {
    Normal = 1,
    Euro = 2,
    Reduction = 3
}

@Component({
    selector: 'kt-table-article',
    templateUrl: './table-article-shell.component.html',
})
export class TableArticleShellComponent implements OnInit {

    subs = new SubSink();

    @Output()
    changeEvent = new EventEmitter<IResultCalculationModel>();

    /** the current select articles */
    @Input()
    set data(data: IInputTableArticleComponent) {
        if (data != null) {
            this.articles = ObjectHelper.isNullOrUndefined(data.articles) ? [] : data.articles;
            this.mode = data.mode != null ? data.mode : TableArticleMode.Normal;
            this.updateFormControlRemise();
            this.setFormControlTotalReductionValue((NumberHelper.isNullOrNaN(data.totalReduction) ? 0 : data.totalReduction));
            this.doCalculation(true);
            this.updateStatusFormControlTotalReduction();
        }
    }

    /** type of remise */
    @Input()
    remiseType = RemiseType.Percent;

    /** remise */
    @Input()
    remise = 0;

    /** the read only mode */
    @Input()
    readOnly = false;

    @Input()
    disableRemiseGlobal = false;

    @Input()
    showTotals = false;

    @Input()
    primeCEEEDF: string;

    /** the form totals */
    formTotals: FormGroup;

    /** total ttc form control */
    formControlTotalTTC = new FormControl();

    /** the list of remise type */
    remiseTypes: IDropDownItem<number, string>[] = [];

    /** the result of calculation */
    resultCalculation: IResultCalculationModel;

    /** list articles */
    articles: IArticle[] = [];

    /** the current mode of component */
    mode = TableArticleMode.Normal;

    /** the modes of table article */
    modes = TableArticleMode;

    /** enumeration of type articles */
    articleType = ArticleType;

    constructor(
        private dialog: MatDialog,
        private fb: FormBuilder,
        private translate: TranslateService,
        @Inject(CalculationToken) private calculation: ICalculation,
    ) {
        this.initFormRemise();
        this.subscribeFormRemise();
        this.subscribeFormControlTotalTTC();
    }

    ngOnInit() {
        this.getRemiseType();
    }

    //#region initialization

    /**
     * init form remise
     */
    initFormRemise() {
        this.formTotals = this.fb.group({
            remise: [0],
            remiseType: [RemiseType.Percent],
            totalReduction: [0]
        });
    }

    /**
     * subscribe form remise
     */
    subscribeFormRemise() {
        this.subs.sink = this.formTotals.valueChanges
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(_ => {
                this.remise = parseFloat(this.formTotals.value.remise);
                this.remiseType = parseInt(this.formTotals.value.remiseType, 10);
                this.doCalculation();
            });
    }

    /**
     * subscribe form control of total TTC
     */
    subscribeFormControlTotalTTC() {
        this.subs.sink = this.formControlTotalTTC.valueChanges
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(value => {
                this.updateCalculationOnChangeTotalTTC(NumberHelper.stringToFloat(value));
            });
    }

    //#endregion

    //#region actions

    /**
     * open dialog select articles
     */
    openSelectArticles(type: ArticleType) {
        const data = { articles: this.articles, type };
        DialogHelper.openDialog(this.dialog, SelectArticlesDialogComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    const article = result as IArticle[];
                    if (this.articles.length > 0) {
                        this.articles = this.articles.filter(e => e.type === ArticleType.Ligne);
                        this.articles = [...this.articles, ...article];
                    } else {
                        this.articles = article;
                    }
                    this.doCalculation();
                }
            });
    }

    /**
     * delete article by index
     * @param index the index of article in the list articles
     */
    deleteArticle(index: number) {
        DialogHelper.openConfirmDialog(this.dialog, {
            header: this.translate.instant('TABLE_ARTICLE.DELETE.HEADER'),
            message: this.translate.instant('TABLE_ARTICLE.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LA')
        }, () => {
            this.articles.splice(index, 1);
            this.doCalculation();
        });
    }

    /**
     * detail article
     */
    detailArticle(index: number) {
        const article = this.articles[index];
        const title = 'TABLE_ARTICLE.DETAIL_ARTICLE';
        DialogHelper.openDialog(
            this.dialog,
            DetailArticleDialogComponent,
            DialogHelper.SIZE_MEDIUM,
            { title, article, remiseTypes: this.remiseTypes }
        ).subscribe(result => {
            if (result != null) {
                this.articles[index] = { ...article, ...result };
                this.doCalculation();
            }
        });
    }

    /**
     * add article
     */
    addArticle() {
        const title = 'TABLE_ARTICLE.ADD';
        const data = { title, remiseTypes: this.remiseTypes };
        DialogHelper.openDialog(this.dialog, DetailArticleDialogComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.articles.push(result);
                    this.doCalculation();
                }
            });
    }

    /**
     * add ligne to article
     */
    addLigne() {
        DialogHelper.openDialog(this.dialog, AddLigneArticleComponent, DialogHelper.SIZE_SMALL, null)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.articles.push(result);
                }
            });
    }

    //#endregion

    //#region helpers

    /**
     * do the calculation of article
     */
    doCalculation(updateTotalTtcForm = true) {
        switch (this.mode) {
            case TableArticleMode.Normal:
                this.resultCalculation = this.calculation
                    .calculationGenerale(this.articles, this.remise, this.remiseType);
                break;

            case TableArticleMode.Reduction:
                this.resultCalculation = this.calculation
                    .calculationGeneraleWithReduction(this.articles, this.getTotalReduction(), this.remise, this.remiseType);
                if (updateTotalTtcForm) {
                    this.setFormControlTotalTTCValue(this.resultCalculation.totalTTC);
                }
                break;

            case TableArticleMode.Euro:
                this.resultCalculation = this.calculation
                    .calculationGeneraleWithPaid(this.articles, 1, this.remise, this.remiseType);
                if (updateTotalTtcForm) {
                    this.setFormControlTotalTTCValue(this.resultCalculation.totalTTC);
                }
                break;
        }
        this.changeEvent.emit(this.resultCalculation);
    }

    /**
     * check is currency remise
     */
    isCurrencyRemise = (remiseType: RemiseType) => remiseType === RemiseType.Currency;

    /**
     * get remise as IDropDown
     */
    getRemiseType() {
        this.remiseTypes = [
            { value: RemiseType.Currency, text: AppSettings.CURRENCY },
            { value: RemiseType.Percent, text: '%' }
        ];
    }

    /**
     * update status form control total reduction status (enabled or disabled)
     */
    updateStatusFormControlTotalReduction() {
        if (this.mode === TableArticleMode.Reduction) {
            this.formTotals.get('totalReduction').enable();
        } else {
            this.formTotals.get('totalReduction').disable();
        }
    }

    /**
     * update form control remise and remise type
     */
    updateFormControlRemise() {
        if (!this.disableRemiseGlobal) {
            this.formTotals.get('remise').setValue(this.remise);
            this.formTotals.get('remiseType').setValue(this.remiseType);
        }
    }

    /**
     * get total of reduction
     */
    getTotalReduction(): number {
        if (this.formTotals == null) { return 0; }
        const value = this.formTotals.get('totalReduction').value;
        if (!StringHelper.isEmptyOrNull(value)) {
            return parseFloat(value);
        } else {
            return 0;
        }
    }

    /**
     * set value in form control TTC
     */
    setFormControlTotalTTCValue(value: number) {
        this.formControlTotalTTC.setValue(NumberHelper.roundingNumber(value));
    }

    /**
     * set value in form control TTC
     */
    setFormControlTotalReductionValue(value: number) {
        this.formTotals.get('totalReduction').setValue(NumberHelper.roundingNumber(value));
    }

    /**
     * update calculation on change total ttc
     */
    updateCalculationOnChangeTotalTTC(totalTTC: number) {
        const calculationTva = this.resultCalculation != null ? this.resultCalculation.calculationTva : [];
        this.articles = this.calculation.reverseCalculate(totalTTC, this.articles, calculationTva).articles;
        this.doCalculation(false);
    }

    /**
     * is all articles without remise
     */
    isAllWithoutRemise(): boolean {
        return this.articles.every(e => e.remise === 0 || e.remise === null)
    }

    /**
     * get columns
     */
    getColumns(): string[] {
        if (this.isAllWithoutRemise()) {
            return [
                'LABELS.FIRSTNAME',
                'LABELS.QUANTITY',
                'LABELS.PRIX_HT',
                'LABELS.TOTAL_HT',
                'LABELS.TVA',
                'LABELS.TOTAL_TTC',
                'LABELS.ACTIONS'
            ];
        } else {
            return [
                'LABELS.FIRSTNAME',
                'LABELS.QUANTITY',
                'LABELS.PRIX_HT',
                'LABELS.DISCOUNT',
                'LABELS.TOTAL_HT',
                'LABELS.TVA',
                'LABELS.TOTAL_TTC',
                'LABELS.ACTIONS'
            ];
        }
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.articles, event.previousIndex, event.currentIndex);
    }

    //#endregion

}
