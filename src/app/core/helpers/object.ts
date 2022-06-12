export class ObjectHelper {

    /**
     * check object is null or undefined
     * @param obj the given object
     */
    static isNullOrUndefined(obj: any) {
        return obj == null || obj === undefined;
    }

    /**
     * check object is null or empty
     * @param obj the given object
     */
    static isNullOrEmpty(obj: any) {
        return obj == null || obj === undefined || obj === {} || obj === [] || obj === '';
    }

}
