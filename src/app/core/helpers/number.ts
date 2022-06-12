import { StringHelper } from './string';
import { AppSettings } from 'app/app-settings/app-settings';

/**
 * a class describe number helper
 */
export class NumberHelper {

    /**
     * Format Number Price
     * @param num the number you want to format
     */
    static formatNumberPrice(num: number): string {
        return num.toFixed(2).replace(/./g, (c, i, a) => {
            return c === '.' ? ',' : (i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ' ' + c : c);
        });
    }

    /**
     * check number is null or NaN
     * @param num the number you want to check
     */
    static isNullOrNaN(num: number): boolean {
        return num == null || isNaN(num);
    }

    /**
     * rounding number
     * @param amount the amount want to rounding
     */
    static roundingNumber(amount: number) {
        if (amount == null) { return 0; }
        return parseFloat(Number(amount.toString()).toFixed(2));
    }

    /**
     * convert string to float
     */
    static stringToFloat(value: string): number {
        if (StringHelper.isEmptyOrNull(value) || (typeof (value) === 'number' && isNaN(value))) {
            return 0;
        } else {
            return parseFloat(value);
        }
    }

    /**
     * Format Number to currency
     * @param num the number you want to format
     */
    static formatNumberCurrency(num: number): string {
        const price = num.toFixed(2).replace(/./g, (c, i, a) => {
            return c === '.' ? ',' : (i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ' ' + c : c);
        });
        return `${price} ${AppSettings.CURRENCY}`;
    }
}
