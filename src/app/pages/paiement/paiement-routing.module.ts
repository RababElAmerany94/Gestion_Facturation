import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaiementShellComponent } from './container/paiement-shell/paiement-shell.component';



const routes: Routes = [
    {
      path: '',
      component: PaiementShellComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }
