import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AppSettings } from 'app/app-settings/app-settings';
import { ArticleType } from 'app/core/enums/article-type.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { CopyHelper } from 'app/core/helpers/copy';
import { ProduitHelper } from 'app/core/helpers/produit';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IArticle } from 'app/core/models/general/article.model';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { SpecialArticleService } from 'app/pages/parametres/special-article/special-article.service';
import { ProduitsService } from 'app/pages/produits/produits.service';


@Component({
    selector: 'kt-select-articles-dialog',
    templateUrl: './select-articles-dialog.component.html',
    styleUrls: ['./select-articles-dialog.component.scss']
})
export class SelectArticlesDialogComponent implements OnInit {

    subs = new SubSink();

    /**
     * type of article in select Dialog
     */
    type = ArticleType.Produit;

    /**
     * the list of articles
     */
    articles: IArticle[] = [];

    /**
     * the number of page
     */
    pageCount = 1;

    /**
     * the filter option of produits
     */
    filterOption: IFilterOption = {
        OrderBy: 'designation',
        SortDirection: SortDirection.Asc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    /**
     * search form control
     */
    searchControl = new FormControl();

    constructor(
        private translate: TranslateService,
        private produitService: ProduitsService,
        private toastService: ToastService,
        private specialArticleService: SpecialArticleService,
        private dialogRef: MatDialogRef<SelectArticlesDialogComponent>,
        @Inject(CalculationToken) private calculation: ICalculation,
        @Inject(MAT_DIALOG_DATA) public data: {
            articles: [],
            type: ArticleType
        },
    ) { }

    ngOnInit() {
        this.initializeData();
        this.initializeComponent('');
        this.subscribeSearchControl();
    }

    /**
     * load more data
     */
    loadMore() {
        if (this.pageCount > this.filterOption.Page) {
            this.filterOption.Page++;
            this.getProduits(this.filterOption);
        }
    }

    /**
     * save changes
     */
    save() {
        this.dialogRef.close(this.articles.filter(e => e.qte > 0));
    }

    //#region actions

    /**
     * add quantity to article
     * @param index index of article in array
     * @param qte the qte to add to article
     */
    addQuantity(index: number, qte: number) {
        const article = JSON.parse(JSON.stringify(this.articles[index]));
        article.qte += qte;
        if (article.qte >= 0) {
            this.articles[index].qte = article.qte;
            this.articles[index].totalHT = this.calculation.totalHTArticle(article);
            this.articles[index].totalTTC = this.calculation.totalTTCArticle(article);
        }
    }

    /**
     * subscribe changes of search control
     */
    subscribeSearchControl() {
        this.subs.sink = this.searchControl.valueChanges
            .pipe(debounceTime(700), distinctUntilChanged())
            .subscribe(result => {
                this.initializeComponent(result);
            });
    }

    /**
     * initialize parameters of component
     * @param searchQuery the search query
     */
    initializeComponent(searchQuery: string) {
        this.articles = this.articles.filter(e => e.qte > 0);
        this.filterOption.Page = 1;
        this.filterOption.SearchQuery = searchQuery;
        this.getProduits(this.filterOption);
    }

    /**
     * initialize data component
     */
    initializeData() {
        if (this.data.articles != null) {
            this.articles = CopyHelper.copy(this.data.articles);
        }
        if (this.data.type != null) {
            this.type = CopyHelper.copy(this.data.type);
        }
    }

    //#endregion

    //#region services

    /**
     * get list of produit
     */
    getProduits(filterOption: IFilterOption) {
        if (this.type === ArticleType.Produit) {
            this.subs.sink = this.produitService.GetAsPagedResult(filterOption).subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    const articles = result.value
                        .map(e => ProduitHelper.mapProduitToArticle(e))
                        .filter(e => this.articles.filter(a => a.id === e.id && a.type === e.type).length === 0);
                    this.articles = [...this.articles, ...articles];
                    this.pageCount = result.pageCount;
                } else {
                    this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                }
            });
        } else {
            this.subs.sink = this.specialArticleService.GetAsPagedResult(filterOption)
                .subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        const articles = result.value
                            .map(e => ProduitHelper.mapSpecialArticleToArticle(e))
                            .filter(e => this.articles.filter(a => a.id === e.id && a.type === e.type).length === 0);
                        this.articles = [...this.articles, ...articles];
                        this.pageCount = result.pageCount;
                    } else {
                        this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                    }
                });
        }
    }

    //#endregion

}
