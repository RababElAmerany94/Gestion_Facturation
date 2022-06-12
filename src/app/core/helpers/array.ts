export class ArrayHelper {

    /**
     * check array is empty or null
     * @param array the array to check
     */
    static isEmptyOrNull(array: any[]) {
        return array == null || array === undefined || array.length === 0;
    }

}
