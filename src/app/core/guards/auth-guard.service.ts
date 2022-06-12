import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserHelper } from 'app/core/helpers/user';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!UserHelper.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return false;
        }
        return true;
    }
}
