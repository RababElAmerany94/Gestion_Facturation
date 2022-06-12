import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersShellComponent } from './containers/users-shell/users-shell.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';

const routes: Routes = [
    {
        path: '',
        component: UsersShellComponent
    },
    {
        path: 'profile',
        component: ProfileUserComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
