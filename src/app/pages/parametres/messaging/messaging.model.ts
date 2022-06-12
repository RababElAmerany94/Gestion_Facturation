/**
 * an interface define messaging
 */
export interface IMessaging {

    /**
     * the id of messaging config
     */
    id: string;

    /**
     * the userName of messaging
     */
    username: string;

    /**
     * the password of messaging
     */
    password: string;

    /**
     * the server of messaging
     */
    server: string;

    /**
     * the port of messaging
     */
    port: number;

    /**
     * is SSL of messaging
     */
    ssl: boolean;

    /**
     * the agence id of messaging
     */
    agenceId?: string;
}

/**
 * an interface messaging model
 */
export interface IMessagingModel {

    /**
     * the userName of messaging
     */
    username: string;

    /**
     * the password of messaging
     */
    password: string;

    /**
     * the server of messaging
     */
    server: string;

    /**
     * the port of messaging
     */
    port: number;

    /**
     * is SSL of messaging
     */
    ssl: boolean;

    /**
     * the agence id of messaging
     */
    agenceId: string;
}
