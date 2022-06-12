import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgenceShellComponent } from './containers/agence-shell/agence-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AgenceShellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencesRoutingModule { }
