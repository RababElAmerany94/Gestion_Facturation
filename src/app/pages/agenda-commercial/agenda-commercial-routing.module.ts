import { AgendaCommercialShellComponent } from './containers/agenda-commercial-shell/agenda-commercial-shell.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        component: AgendaCommercialShellComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgendaCommercialRoutingModule { }
