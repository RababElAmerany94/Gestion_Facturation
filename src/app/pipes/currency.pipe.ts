import { Pipe, PipeTransform } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';

@Pipe({
    name: 'Currency'
})
export class CurrencyPipe implements PipeTransform {

    transform(price: any): string {
        if (price === null) { return `0.0 ${AppSettings.CURRENCY}`; }
        return `${price.toString()} ${AppSettings.CURRENCY}`;
    }

}
