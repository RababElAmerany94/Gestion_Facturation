import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'RoundingNumberInput',
    pure: false
})
export class RoundingNumberInputPipe implements PipeTransform {


    transform(number: any, args?: any): any {

        const num = Number(number);
        const rounded = Number(num).toFixed(2);

        return parseFloat(rounded);
    }

}
