import { INumeration } from '../numerotation.model';
import { StringHelper } from 'app/core/helpers/string';
import { DateFormat } from 'app/core/enums/date-format.enum';

export class SharedNumerotation {

    /**
     * generate preview numerotation
     * @param numerotation numerotation
     */
    static generateExampleCode(numerotation: INumeration): string {
        let exampleCode = '';

        if (!StringHelper.isEmptyOrNull(numerotation.root)) {
            exampleCode += numerotation.root;
        }

        if (numerotation.dateFormat != null && numerotation.dateFormat !== DateFormat.NoDate) {
            const date = new Date();
            if (numerotation.dateFormat === DateFormat.Year) {
                exampleCode += date.getFullYear().toString();
            } else if (numerotation.dateFormat === DateFormat.YearMonth) {
                exampleCode += date.getFullYear().toString() + (date.getMonth() + 1).toString();
            }
        }

        exampleCode += (numerotation.counter == null ? '' : numerotation.counter.toString()).padStart(numerotation.counterLength, '0');
        return exampleCode;
    }

}
