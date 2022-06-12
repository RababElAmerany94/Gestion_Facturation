export interface ILoginModel {

    /** login id */
    id: string;

    /** username  */
    userName: string;

    /** password */
    password: string;

    /** actif flag */
    actif: boolean;

    /** token  */
    token?: string;

    /** user Id */
    userId?: string;

    /** the id of role */
    roleId: number;
}
