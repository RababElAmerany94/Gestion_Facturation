import { ResultStatus } from '../../enums/result-status';
import { Error } from './error-model';

export class ResultModel {
    hasValue: true;
    status: number;
    message: string;
    hasError: boolean;
    value: any;
}

/**
 * an interface to describe a result from a database operation.
 */
export interface IResultBase {

    /**
     * the Status of the result
     */
    status: ResultStatus;

    /**
     * get the message associated with this result
     */
    message: string;

    /**
     * a code that represent a message, used for multilingual scenario
     */
    messageCode: string;

    /**
     * check if the operation associated with this result has produce a value
     */
    hasValue: boolean;

    /**
     * is this Result has raised an error
     */
    hasError: boolean;

    /**
     * the exception instant, if there is an error associated with operation
     * if no error this will be null
     */
    error: Error;
}

/**
 * an interface to describe a result from a database operation
 * {T} the type of the returned result
 */
export interface IResult<T> extends IResultBase {

    /**
     * the result of the operation
     */
    value: T;
}

/**
 * an interface that defines a paged result
 * {T} is the type of the result
 */
export interface IPagedResult<T> extends IResult<T[]> {

    /**
     * the index of the current page
     */
    currentPage: number;

    /**
     * the total count of the pages
     */
    pageCount: number;

    /**
     * the page size
     */
    pageSize: number;

    /**
     * the total count of rows
     */
    rowCount: number;

    /**
     * the index of the first row on the page
     */
    firstRowOnPage: number;

    /**
     * the index of the last row on the page
     */
    lastRowOnPage: number;
}
