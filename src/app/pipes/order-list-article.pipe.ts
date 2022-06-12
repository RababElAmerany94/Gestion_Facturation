import { Pipe, PipeTransform } from '@angular/core';
import { IArticle } from '../core/models/general/article.model';

@Pipe({
    name: 'OrderListArticle',
    pure: true
})
export class OrderListArticle implements PipeTransform {

    constructor() { }

    transform(list: IArticle[]): any {

        if (list == null) {
            return [];
        }

        list.sort((a, b) => {
            if (a.designation < b.designation) { return 1; }
            if (a.designation > b.designation) { return -1; }
            return 0;
        });

        return list;
    }

}
