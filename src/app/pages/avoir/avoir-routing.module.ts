import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvoirShellComponent } from './containers/avoir-shell/avoir-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AvoirShellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvoirRoutingModule { }
