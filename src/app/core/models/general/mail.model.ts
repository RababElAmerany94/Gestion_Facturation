/** a class describe mail history model */
export interface IMailHistoryModel {

    /** that meaning send email to */
    emailTo: string;

    /** the subject of email */
    subject: string;

    /** the body of email    */
    body: string;

    /** the date of creation this history mail object */
    dateCreation: Date;

    /** the id of user */
    userId: number;
}

/** a class describe mail model */
export interface IMailModel {

    /** that meaning send email to */
    emailTo: string[];

    /** the subject of email */
    subject: string;

    /** the body of email */
    body: string;
}
