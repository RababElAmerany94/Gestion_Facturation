/**
 * a class that defines the history of properties values changes in a given entity
 */
export interface IChangesHistory {
    /**
     * the date of the changes
     */
    ChangeDate: Date;

    /**
     * the id of the user who made the change
     */
    IdUser: number;

    /**
     * the type of the action performed, example : Added / Modified / Deleted
     */
    Action: ChangesHistoryType;

    /**
     * list of Fields that has been changed
     */
    Fields: IChangedFields[];
}

/**
 * a class that defines the fields that has changed
 */
export interface IChangedFields {

    /**
     * the name of the field
     */
    FieldName: string;

    /**
     * the before/old value
     */
    Before: string;

    /**
     * the after/new value
     */
    After: string;

    /**
     *  mark if this field is a complex type or not
     */
    IsComplexType: boolean;
}

export enum ChangesHistoryType {
    Added = 1,
    Updated = 2,
    Deleted = 3
}
