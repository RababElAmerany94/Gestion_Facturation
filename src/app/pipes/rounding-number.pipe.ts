import { Pipe, PipeTransform } from '@angular/core';
import { NumberHelper } from '../core/helpers/number';

@Pipe({
    name: 'RoundingNumber',
    pure: false
})

export class RoundingNumberPipe implements PipeTransform {

    cachedResult = null;

    transform(value: any, args?: any): any {

        if (!value || value === undefined || value == null) {
            return NumberHelper.formatNumberPrice(0);
        }

        const num = Number(value);

        if (num !== this.cachedResult) {
            const res = NumberHelper.formatNumberPrice(num);
            this.cachedResult = res;
            return res;
        }

    }

}
