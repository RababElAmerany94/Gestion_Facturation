import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteName } from 'app/core/enums/route-name.enum';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { SuiviActiviteComponent } from './containers/suivi-activite/suivi-activite.component';

const routes: Routes = [
    {
        path: ``,
        component: DashboardComponent
    },
    {
        path: `${RouteName.SuiviActivite}`,
        component: SuiviActiviteComponent
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
