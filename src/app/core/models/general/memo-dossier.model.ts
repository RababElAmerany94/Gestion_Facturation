import { ICategoryDocument } from 'app/pages/parametres/document-category/category-document.model';
import { Memo } from './memo.model';

/**
 * an interface describe memo dossier model
 */
export interface MemoDossier extends Memo {
    name: string;
    category: ICategoryDocument;
}
