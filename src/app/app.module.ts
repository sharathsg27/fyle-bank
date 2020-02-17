import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {SearchBoxComponent} from './shared/search-box/search-box.component';
import {ListBanksComponent} from './list-banks/list-banks.component';
import {FormsModule} from '@angular/forms';
import {DataTableComponent} from './shared/data-table/data-table.component';
import {PaginationComponent} from './pagination/pagination.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DotSpinnerComponent} from './shared/dot-spinner/dot-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    ListBanksComponent,
    DataTableComponent,
    PaginationComponent,
    DotSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
