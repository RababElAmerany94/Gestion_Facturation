import { Access } from 'app/core/enums/access.enum';
import { Modules } from 'app/core/enums/modules.enum';

/**
 * an interface describe token model
 */
export interface ITokenModel {
    userId: string;
    agenceId?: string;
    roleId: number;
    isActive: boolean;
    name: string;
    modules: Modules[];
    permissions: IPermissionModel[];
}

export interface IPermissionModel {
    access: Access;
    modules: IPermissionModuleModel[];
}

export interface IPermissionModuleModel {
    moduleId: Modules;
}
