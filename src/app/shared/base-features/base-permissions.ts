import { Access } from 'app/core/enums/access.enum';
import { Modules } from 'app/core/enums/modules.enum';
import { UserHelper } from 'app/core/helpers/user';

export class BasePermissions {

    module: Modules;
    modules: typeof Modules = Modules;
    access: typeof Access = Access;
    userHelper: typeof UserHelper = UserHelper;

    //#region helpers permissions
    canUpdate = () => UserHelper?.hasPermission(this.module, Access.Update);
    canRead = () => UserHelper?.hasPermission(this.module, Access.Read);
    canCreate = () => UserHelper?.hasPermission(this.module, Access.Create);
    canDelete = () => UserHelper?.hasPermission(this.module, Access.Delete);
    //#endregion

    protected setModule(module: Modules) {
        this.module = module;
    }

}
