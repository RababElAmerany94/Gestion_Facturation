/**
 * dialog options
 */
export interface DialogOptions {
    header?: string;
    message?: string;
    data?: any;
    cssClass?: string | string[];
    buttons?: (AlertButton | string)[];
}

/**
 * the alert button options
 */
export interface AlertButton {
    text: string;
    cssClass?: string;
    disabled?: boolean;
    handler?: (value: any) => boolean | void | {
        [key: string]: any;
    };
}