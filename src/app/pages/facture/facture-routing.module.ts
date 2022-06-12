import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FactureShellComponent } from './containers/facture-shell/facture-shell.component';


const routes: Routes = [
    {
        path: '',
        component: FactureShellComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FactureRoutingModule { }
