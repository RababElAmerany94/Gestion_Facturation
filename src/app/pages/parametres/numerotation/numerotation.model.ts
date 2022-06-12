import { NumerationType } from 'app/core/enums/numerotation.enum';
import { DateFormat } from 'app/core/enums/date-format.enum';

/**
 * an interface define numerotation
 */
export interface INumeration {

    /**
     * the id of numerotation
     */
    id: string;

    /**
     * the root of numerotation
     */
    root: string;

    /**
     * the date format of numerotation
     */
    dateFormat: DateFormat;

    /**
     * the counter of numerotation
     */
    counter: number;

    /**
     * the length of numerotation
     */
    counterLength: number;

    /**
     * the type of numerotation
     */
    type: NumerationType;

    /**
     * the agence id of numerotation
     */
    agenceId: number;
}


/**
 * an interface define numerotation model
 */
export interface INumerationModel {
    /**
     * the root of numerotation
     */
    root: string;

    /**
     * the date format of numerotation
     */
    dateFormat: string;

    /**
     * the counter of numerotation
     */
    counter: number;

    /**
     * the length of numerotation
     */
    counterLength: number;

    /**
     * the type of numerotation
     */
    type: string;

    /**
     * the agence id of numerotation
     */
    agenceId: number;
}
