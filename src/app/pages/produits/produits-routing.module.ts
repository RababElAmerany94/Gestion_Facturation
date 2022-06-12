import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProduitsShellComponent } from './containers/produits-shell/produits-shell.component';


const routes: Routes = [{
  path: '',
  component: ProduitsShellComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduitsRoutingModule { }
