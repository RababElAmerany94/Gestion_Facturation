import { uuid } from 'uuidv4';

/**
 * an interface describe string helpers
 */
export class StringHelper {

    /**
     * check string is empty or null
     * @param value the value that we want to check
     */
    static isEmptyOrNull(value: string): boolean {
        return value === null || value === '' || value === undefined || value === 'null';
    }

    /**
     * Guid
     */
    static guid() {
        return uuid();
    }

    /** check if data is array type or not */
    static hasdata(data) {
        if (Array.isArray(data)) {
            return data.length > 0;
        } else {
            return data != null;
        }
    }
}
