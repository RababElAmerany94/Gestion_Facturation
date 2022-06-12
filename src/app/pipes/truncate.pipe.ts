import { Pipe, PipeTransform } from '@angular/core';
import { StringHelper } from '../core/helpers/string';

@Pipe({
    name: 'truncate'
})

export class TruncatePipe implements PipeTransform {

    transform(value: string, limit = 25, completeWords = false, ellipsis = '…') {

        if (StringHelper.isEmptyOrNull(value)) { return ''; }

        ellipsis = value.length > limit ? '...' : '';

        if (completeWords) {
            limit = value.substr(0, limit).lastIndexOf(' ');
        }

        return `${value.substr(0, limit)}${ellipsis}`;

    }

}
