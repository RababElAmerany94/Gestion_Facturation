import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouteName } from 'app/core/enums/route-name.enum';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { UserRouteActions } from 'app/core/enums/users-route-actions.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { UserHelper } from 'app/core/helpers/user';
import { TranslationService } from 'app/core/layout/services/translation.service';
import { ChangePasswordComponent } from 'app/shared';
import { IUser } from '../../user.model';
import { UsersService } from '../../users.service';

@Component({
    selector: 'kt-profile-user',
    templateUrl: './profile-user.component.html'
})
export class ProfileUserComponent implements OnInit {

    user: IUser;

    /** User profile */
    userProfile: typeof UserProfile = UserProfile;

    constructor(
        private router: Router,
        private userService: UsersService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.getUserInfo();
    }

    /**
     * display user Info
     */
    getUserInfo() {
        this.userService.Get(UserHelper.getUserId())
            .subscribe(res => {
                this.user = res.value;
            });
    }

    /**
     * modifier user
     */
    modifierUser() {
        const navigationExtrasUser: NavigationExtras = {
            state: {
                user: this.user,
                redirectUrl: `/${RouteName.Profile}`
            },
            queryParams: {
                mode: UserRouteActions.EditFromClient
            }
        };
        this.router.navigate([`/${RouteName.Utilisateurs}`], navigationExtrasUser);
    }

    /**
     * change password
     */
    changePassword() {
        DialogHelper.openDialog(
            this.dialog,
            ChangePasswordComponent,
            DialogHelper.SIZE_SMALL,
            { userId: UserHelper.getUserId() }
        );
    }

}
