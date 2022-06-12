/**
 * an interface describe memo model
 */
export interface Memo {
    userId: string;
    date: Date | string;
    commentaire: string;
    pieceJointes: PieceJoin[];
}

/**
 * an interface describe piece join model
 */
export interface PieceJoin {
    type: string;
    orignalName: string;
    name: string;
    file: string;
    size?: number;
    lastModified?: number;
    lastModifiedDate?: Date;
    slice?: Blob;
}

export interface AddMemoModalOutput {
    memo: Memo;
    removedFiles: PieceJoin[];
}
