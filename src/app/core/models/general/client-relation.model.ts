import { ClientRelationType } from 'app/core/enums/type-relation-client.enum';
import { IClient } from 'app/pages/clients/client.model';

export interface IClientRelation {
    id: string;
    type: ClientRelationType;
    clientId: string;
    client: IClient;
}

export interface IClientRelationModel {
    type: ClientRelationType;
    clientId: string;
    client: IClient;
}
