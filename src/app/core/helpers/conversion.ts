import { IDropDownItem } from '../models/general/drop-down-item.model';

export class ConversionHelper {

    /**
     * Convert enumeration to list of keys values
     * @param enumeration enumeration object
     * @param typeValue type of value (number, boolean, ...)
     */
    static convertEnumToListKeysValues<TValue, TText>(enumeration, typeValue: string): IDropDownItem<TValue, TText>[] {
        const list: IDropDownItem<TValue, TText>[] = [];
        for (const n in enumeration) {
            if (typeof enumeration[n] === typeValue) {
                list.push({ text: n as any as TText, value: enumeration[n] as any as TValue });
            }
        }
        return list;
    }

}
