import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {

    translate: TranslateService;
    itemsPerPageLabel = 'Items per page';
    nextPageLabel = 'Next page';
    previousPageLabel = 'Previous page';

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        const rangePageLabel = this.translate ? this.translate.instant('PAGINATOR.RANGE_PAGE_LABEL') : 'of';
        if (length === 0 || pageSize === 0) {
            return `0 ${rangePageLabel} ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} ${rangePageLabel} ${length}`;
    }

    injectTranslateService(translate: TranslateService) {
        this.translate = translate;
        this.translate.onLangChange.subscribe(() => {
            this.translateLabels();
        });
        this.translateLabels();
    }

    translateLabels() {
        this.itemsPerPageLabel = this.translate ? this.translate.instant('PAGINATOR.ITEMS_PER_PAGE') : this.itemsPerPageLabel;
        this.nextPageLabel = this.translate ? this.translate.instant('PAGINATOR.NEXT_PAGE') : this.nextPageLabel;
        this.previousPageLabel = this.translate ? this.translate.instant('PAGINATOR.PREVIOUS_PAGE') : this.previousPageLabel;
    }

}
