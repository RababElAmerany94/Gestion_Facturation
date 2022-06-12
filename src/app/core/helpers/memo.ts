import { FileManagerModel } from '../models/general/file-manager.model';
import { Memo } from '../models/general/memo.model';
import { StringHelper } from './string';

/**
 * memo helpers
 */
export class MemoHelper {

    /**
     * Get list of files base64
     * @param memo the memo object
     */
    static getFilesFromMemo(memo: Memo): FileManagerModel[] {
        const files: FileManagerModel[] = [];

        for (const pieceJoint of memo.pieceJointes) {
            if (!StringHelper.isEmptyOrNull(pieceJoint.file)) {
                const file = {
                    base64: pieceJoint.file,
                    name: pieceJoint.name
                };
                files.push(file);
            }
        }

        return files;
    }

    /**
     * Delete base64 from memo
     * @param memo the memo that we want to clean
     */
    static cleanBase64(memo: Memo): Memo {
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
    static addMemoToMemos(memos: Memo[], memo: Memo): Memo[] {
        memos.unshift(memo);
        return memos;
    }

}
