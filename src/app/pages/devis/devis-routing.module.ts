import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevisShellComponent } from './containers/devis-shell/devis-shell.component';

const routes: Routes = [
    {
        path: '',
        component: DevisShellComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DevisRoutingModule { }
