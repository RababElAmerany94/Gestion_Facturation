/**
 * a class describe copy helper
 */
export class CopyHelper {

    /**
     * copy object
     * @param object the object to copy
     */
    static copy(object: any) {
        return JSON.parse(JSON.stringify(object));
    }
}
