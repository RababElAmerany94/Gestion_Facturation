import { DocType } from 'app/core/enums/doctype.enums';

export interface IDocumentAssociate {

    /** the id of document */
    id: string;

    /** reference of document */
    reference: string;

    /** dateCreation */
    createOn: Date;

    /** type of document */
    type: DocType;

    /** the TotalTTC of dossier */
    totalTTC: number;
}
