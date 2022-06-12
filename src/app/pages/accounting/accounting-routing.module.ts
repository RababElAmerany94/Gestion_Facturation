import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingShellComponent } from './container/accounting-shell/accounting-shell.component';

const routes: Routes = [
    {
        path: '',
        component: AccountingShellComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountingRoutingModule { }
