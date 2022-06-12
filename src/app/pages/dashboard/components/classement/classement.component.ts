import { Component, Input } from '@angular/core';
import { IMatMenuItem } from 'app/shared/ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { InputClassementDashboard } from '../../dashboard.model';

@Component({
    selector: 'kt-classement',
    templateUrl: './classement.component.html'
})
export class ClassementComponent {

    @Input()
    set classementData(data: InputClassementDashboard) {
        if (data != null) {
            this.data = data;
        }
    }

    show = {
        classementClientShow: true,
        articlesByCategory: false,
        articlesQuantities: false,
        articlesTotals: false
    }

    data: InputClassementDashboard = {
        classementClient: [],
        facturesArticlesByCategory: [],
        facturesArticlesQuantities: [] = [],
        facturesArticlesTotals: [] = []
    };

    menuItems: IMatMenuItem[] = [];

    constructor() {
        this.menuItems = this.getMenuItems();
    }

    /**
     * menu items of actions
     */
    getMenuItems() {
        const items: IMatMenuItem[] = [
            {
                appear: !this.show.classementClientShow,
                action: () => {
                    this.show = {
                        classementClientShow: true,
                        articlesByCategory: false,
                        articlesQuantities: false,
                        articlesTotals: false
                    };
                    this.getMenuItems();
                },
                icon: '',
                title: 'LABELS.CLIENTS'
            },
            {
                appear: !this.show.articlesTotals,
                action: () => {
                    this.show = {
                        classementClientShow: false,
                        articlesByCategory: false,
                        articlesQuantities: false,
                        articlesTotals: true
                    };
                    this.getMenuItems();
                },
                icon: '',
                title: 'LABELS.ARTICLES'
            },
            {
                appear: !this.show.articlesByCategory,
                action: () => {
                    this.show = {
                        classementClientShow: false,
                        articlesByCategory: true,
                        articlesQuantities: false,
                        articlesTotals: false
                    };
                    this.getMenuItems();
                },
                icon: '',
                title: 'LABELS.ARTICLES_CATEGORY'
            },
            {
                appear: !this.show.articlesQuantities,
                action: () => {
                    this.show = {
                        classementClientShow: false,
                        articlesByCategory: false,
                        articlesQuantities: true,
                        articlesTotals: false
                    };
                    this.getMenuItems();
                },
                icon: '',
                title: 'LABELS.ARTICLES_QTE'
            },
        ];
        return this.menuItems = items;
    }
}
