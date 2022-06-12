import { ChangesHistoryType } from 'app/core/enums/change-history-type.enum';

export interface IHistorique {
    changeDate: Date;
    userId: number;
    action: ChangesHistoryType;
    fields: IField[];
}

export interface IField {
    fieldName: string;
    after: string;
    before: string;
    isComplexType: boolean;
}
