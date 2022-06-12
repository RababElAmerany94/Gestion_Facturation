import { Pipe, PipeTransform } from '@angular/core';
import { UsersService } from 'app/pages/users/users.service';


@Pipe({
    name: 'GetNameOfUserById',
    pure: false
})
export class GetNameOfUserById implements PipeTransform {
    private userName: any = null;
    private cachedIdUser = null;

    constructor(private userService: UsersService) { }

    transform(idUser: any, args?: any): any {

        if (!idUser || typeof (parseInt(idUser, 10)) !== 'number') {
            return '-';
        }

        if (idUser !== this.cachedIdUser) {
            this.userName = null;
            this.cachedIdUser = idUser;

            this.userService.GetLite(idUser).subscribe(user => {
                this.userName = `${user.value.lastName} ${user.value.firstName}`;
            });
        }

        return this.userName;
    }
}
