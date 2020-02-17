import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListBanksComponent} from './list-banks/list-banks.component';


const routes: Routes = [
  {path: '', redirectTo: '/list-banks', pathMatch: 'full'},
  {path: 'list-banks', component: ListBanksComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
