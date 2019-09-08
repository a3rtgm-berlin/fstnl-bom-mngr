import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { XlsLoaderComponent } from './xls-loader/xls-loader.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CompareOrdersComponent } from './compare-orders/compare-orders.component';
import { ProjectComponent } from './project/project.component';
import { QueryFormComponent } from './query-form/query-form.component';
import { MaterialListViewComponent } from './material-list-view/material-list-view.component';
import { MaterialListsCollectionViewComponent } from './material-lists-collection-view/material-lists-collection-view.component';

@NgModule({
  declarations: [
    AppComponent,
    XlsLoaderComponent,
    ProjectListComponent,
    CompareOrdersComponent,
    ProjectComponent,
    QueryFormComponent,
    MaterialListViewComponent,
    MaterialListsCollectionViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    XlsLoaderComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
