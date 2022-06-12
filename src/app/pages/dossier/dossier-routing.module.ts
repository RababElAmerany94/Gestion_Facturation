import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DossierShellComponent } from './containers/dossier-shell/dossier-shell.component';


const routes: Routes = [
    {
        path: '',
        component: DossierShellComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DossierRoutingModule { }
