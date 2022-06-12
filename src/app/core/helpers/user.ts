import { TranslateService } from '@ngx-translate/core';
import { JwtHelper } from 'angular2-jwt';
import { AppSettings } from 'app/app-settings/app-settings';
import { ILoginCreateModel } from 'app/pages/users/user.model';
import { UsersService } from 'app/pages/users/users.service';
import { SubSink } from 'subsink';
import { Access } from '../enums/access.enum';
import { Modules } from '../enums/modules.enum';
import { ResultStatus } from '../enums/result-status';
import { UserProfile } from '../enums/user-role.enums';
import { ToastService } from '../layout/services/toast.service';
import { IMenuConfig, IMenuItem, IMenuSection, isIMenuSection } from '../layout/_config/menu.config';
import { IPermissionModel, ITokenModel } from '../models/general/token-model';
import { StringHelper } from './string';

/**
 * a class describe user helper
 */
export class UserHelper {

    private static token: string;
    private static tokenExpiration: string;
    private static tokenModel: ITokenModel;
    private static isNotExpired = true;

    /**
     * Check is admin
     */
    static isAdmin = (): boolean => UserHelper.getRole() === UserProfile.Admin;

    /**
     * Check is agence
     */
    static isAdminAgence = (): boolean => UserHelper.getRole() === UserProfile.AdminAgence;

    /**
     * Check is directeur commercial
     */
    static isDirecteur = (): boolean => UserHelper.getRole() === UserProfile.Directeur;

    /**
     * Check is technicien
     */
    static isTechnicien = (): boolean => UserHelper.getRole() === UserProfile.Technicien;

    /**
     * Check is Commercial
     */
    static isCommercial = (): boolean => UserHelper.getRole() === UserProfile.Commercial;

    /**
     * Get User Id
     */
    static getUserId = (): string => UserHelper.getTokeInfo().userId;

    /**
     * Get agence id
     */
    static getAgenceId = () => UserHelper.getTokeInfo().agenceId;

    /**
     * is follow agence
     */
    static isFollowAgence = () => UserHelper.getTokeInfo().agenceId != null;

    /**
     * Get role of current user
     */
    static getRole = (): number => UserHelper.getTokeInfo().roleId;

    /**
     * get permissions list of the current user
     */
    static getPermissions = (): IPermissionModel[] => UserHelper.getTokeInfo()?.permissions;

    /**
     * get permissions list of the current user
     */
    static getModules = (): string[] => UserHelper.getTokeInfo().modules;

    /**
     * get token info
     */
    static getTokeInfo(): ITokenModel {
        const token = localStorage.getItem(AppSettings.TOKEN);
        if (this.isAuthenticated()) {
            if (token === this.token) {
                return this.tokenModel;
            } else {
                this.token = token;
                const helper = new JwtHelper();
                this.tokenModel = UserHelper.mapTokenToTokenModel(helper.decodeToken(token));
                return this.tokenModel;
            }
        }
        return null;
    }

    /**
     * is authenticated
     */
    static isAuthenticated() {
        const token = localStorage.getItem(AppSettings.TOKEN);
        if (this.tokenExpiration !== token) {
            this.tokenExpiration = token;
            const helper = new JwtHelper();
            this.isNotExpired = !StringHelper.isEmptyOrNull(token) && !helper.isTokenExpired(token);
        }
        return this.isNotExpired;
    }

    /**
     * is the current user has the same Agence id
     */
    static hasOwner(agenceId?: string) {
        const currentAgenceId = UserHelper.getAgenceId();
        return agenceId === currentAgenceId;
    }

    /**
     * check user has permission
     */
    static hasPermission(module: Modules, access: Access): boolean {
        return UserHelper?.getPermissions()
            ?.filter(e => e.access === access && e.modules?.filter(m => m.moduleId === module).length > 0).length > 0;
    }

    /**
     * check username is unique
     * @param callback the callback
     */
    static checkUsernameIsUnique(
        subs: SubSink,
        usersService: UsersService,
        toastService: ToastService,
        translate: TranslateService,
        currentUsername: string,
        userModel: ILoginCreateModel,
        callback) {
        subs.sink = usersService.IsUniqueUsername(userModel.userName).subscribe((result) => {
            if (
                result.status === ResultStatus.Succeed &&
                !result.value &&
                (!StringHelper.isEmptyOrNull(currentUsername) ? currentUsername !== userModel.userName : true)
            ) {
                toastService.error(translate.instant('ERRORS.USERNAME_NOT_UNIQUE'));
                callback(false);
                return;
            }

            callback(true);
        });
    }


    /**
     * check permissions
     */
    static modulePermitted(menuConfig: IMenuConfig): IMenuConfig {
        /** the final items of menu */
        const items: (IMenuItem | IMenuSection)[] = [];

        /** the module accessible for the current user */
        const currentUserModules = UserHelper.getModules();

        let isSection = false;

        /** filter the menu items */
        menuConfig.aside.items.forEach(route => {

            if (!isIMenuSection(route)) {
                route = route as IMenuItem;
                if (route.moduleId != null && currentUserModules.includes(route.moduleId)) {
                    if (route.submenu != null && route.submenu.length > 0) {
                        route.submenu = route.submenu.filter(e => currentUserModules.find(current => e.moduleId === current));
                    }
                    items.push(route);
                    isSection = false;

                } else if (route.moduleId == null && route.submenu.length > 0) {
                    route.submenu = route.submenu.filter(e => currentUserModules.find(current => e.moduleId === current));
                    if (route.submenu.length > 0) {
                        items.push(route);
                        isSection = false;

                    }
                }
            } else {
                if (isSection) {
                    items.pop();
                }
                isSection = true;
                items.push(route);
            }
        });

        if (isIMenuSection(items[items.length - 1])) {
            items.pop();
        }

        /** set the new list item menu */
        menuConfig.aside.items = items;

        return menuConfig;
    }

    // #region private methods

    /**
     * map information token into token model
     * @param token the token information
     */
    private static mapTokenToTokenModel(token: any): ITokenModel {
        return {
            name: token.name,
            isActive: token.isActive.toLowerCase() === 'true',
            modules: JSON.parse(token.modules),
            permissions: JSON.parse(token.permissions),
            roleId: parseInt(token.roleId, 10),
            userId: token.userId,
            agenceId: StringHelper.isEmptyOrNull(token.agenceId) ? null : token.agenceId,
        };
    }

    // #endregion
}
