import { StringHelper } from './string';

/**
 * a class contains JSON helpers
 */
export class JsonHelper {

    /**
     * deserialze json string
     */
    static DeSerializeJson(json: string) {
        if (StringHelper.isEmptyOrNull(json) || !JsonHelper.IsJsonString(json)) { return null; }
        return JSON.parse(json);
    }

    /**
     * check json string is valid
     * @param json the json to check
     */
    static IsJsonString(json: string) {
        try {
            JSON.parse(json);
        } catch (e) {
            return false;
        }
        return true;
    }

}
