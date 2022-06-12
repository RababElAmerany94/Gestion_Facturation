export interface Contact {
    civilite: string;
    email: string;
    nom: string;
    mobile: string;
    prenom: string;
    fixe: string;
    fonction: string;
    commentaire: string;
    isDefault: boolean;
}
export interface IContactModel extends Contact {
    isNew: boolean;
}
