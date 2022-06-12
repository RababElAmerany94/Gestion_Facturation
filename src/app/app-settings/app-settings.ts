export class AppSettings {

    // Local
    public static API_ENDPOINT = 'http://localhost:5000/api/';

    /* La langue de site web */
    static lang = 'fr';

    /* Max size file (bytes) */
    static MAX_SIZE_FILE = 2097152;

    static PAGE_SIZE_OPTIONS = [25, 50, 100];
    static DEFAULT_PAGE_SIZE = 50;
    static MAX_GET_DATA = 100;

    /** token */
    static TOKEN = '145d17e9-7488-4a17-b67a-98bfe2bd0dd19';
    static USER_ID = '3562dcc6-1824-4c89-8422-c0769806eb80c';
    static ROLE_ID = 'b11ba14c-4253-46ac-81b1-dd4f40b0f56f4';
    static NAME = '158b59ed-e733-463e-85ec-798460b6cc8ba';

    /*------------------------------------------------------------------*/
    /*                  Regular expression                              */
    /*------------------------------------------------------------------*/
    static regexURL = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    // tslint:disable-next-line: max-line-length
    static regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static regexPhone = /^\+?\d*$/;

    /** default currency  */
    static CURRENCY = '€';

}
