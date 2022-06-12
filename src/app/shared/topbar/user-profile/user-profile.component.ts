// Angular
import { Component, Input } from '@angular/core';
// RxJS
import { Router } from '@angular/router';
import { RouteName } from 'app/core/enums/route-name.enum';
import { UserHelper } from 'app/core/helpers/user';
import { ITokenModel } from 'app/core/models/general/token-model';
import { AppSettings } from '../../../app-settings/app-settings';


@Component({
    selector: 'kt-user-profile',
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {

    // Public properties
    user: ITokenModel = UserHelper.getTokeInfo();

    @Input()
    avatar = true;

    @Input()
    greeting = true;

    @Input()
    badge: boolean;

    @Input()
    icon: boolean;

    /**
     * Component constructor
     */
    constructor(
        private router: Router) { }

    /**
     * go to profile
     */
    profileUser() {
        this.router.navigate([`/${RouteName.Utilisateurs}/profile`]);
    }

    /**
     * Log out
     */
    logout() {
        this.router.navigate(['/auth']);
        localStorage.clear();
    }

    /**
     * get name of current user
     */
    getNameUser() {
        return localStorage.getItem(AppSettings.NAME);
    }

}
