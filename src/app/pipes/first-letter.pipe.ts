// Angular
import { Pipe, PipeTransform } from '@angular/core';
import { StringHelper } from 'app/core/helpers/string';

/**
 * Returns only first letter of string
 */
@Pipe({
    name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

    /**
     * Transform
     *
     * @param value: any
     * @param args: any
     */
    transform(value: any, args?: any): any {
        if (StringHelper.isEmptyOrNull(value)) { return ''; }
        return value.split(' ').map(n => n[0]).join('');
    }

}
