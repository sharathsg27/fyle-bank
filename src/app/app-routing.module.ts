import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListBanksComponent} from './list-banks/list-banks.component';
import {BankDetailComponent} from './bank-detail/bank-detail.component';


const routes: Routes = [
  {path: '', redirectTo: '/banks', pathMatch: 'full'},
  {path: 'banks', component: ListBanksComponent},
  {path: 'banks/:id', component: BankDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
