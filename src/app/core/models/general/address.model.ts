export interface Address {
    adresse: string;
    complementAdresse: string;
    departement: string;
    ville: string;
    codePostal: string;
    pays: string;
    isDefault: boolean;
}
export interface IAddressModel extends Address {
    isNew: boolean;
}
