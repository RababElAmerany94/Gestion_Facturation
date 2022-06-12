import { FileManagerModel } from '../models/general/file-manager.model';
import { MemoDossier } from '../models/general/memo-dossier.model';
import { StringHelper } from './string';

/**
 * memo helpers
 */
export class MemoDossierHelper {

    /**
     * Get list of files base64
     * @param memo the memo object
     */
    static getFilesFromMemo(memo: MemoDossier): FileManagerModel[] {
        const files: FileManagerModel[] = [];

        memo.pieceJointes.forEach((pj, _) => {
            const file = {
                base64: pj.file,
                name: pj.name
            };
            files.push(file);
        });

        return files;
    }

    /**
     * Delete base64 from memo
     * @param memo the memo that we want to clean
     */
    static cleanBase64(memo: MemoDossier): MemoDossier {
        memo.pieceJointes.forEach((_, index) => {
            memo.pieceJointes[index].file = '';
        });
        return memo;
    }

    /**
     * add memo to list memos
     * @param memos the list memos in Format JSON
     * @param memo the memo that we want to add
     */
    static addMemoToMemos(memos: string, memo: MemoDossier) {
        let arrMemos = [];
        if (!StringHelper.isEmptyOrNull(memos)) { arrMemos = JSON.parse(memos); }
        arrMemos.unshift(memo);
        return JSON.stringify(arrMemos);
    }

}
