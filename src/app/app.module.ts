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
import { MaterialListViewComponent } from './project/material-list-view/material-list-view.component';
import { MaterialListsCollectionViewComponent } from './project-list/material-lists-collection-view/material-lists-collection-view.component';
import { ComparisonRowViewComponent } from './compare-orders/comparison-row-view/comparison-row-view.component';
import { ComparisonMetaViewComponent } from './compare-orders/comparison-meta-view/comparison-meta-view.component';
import { ComparisonListViewComponent } from './compare-orders/comparison-list-view/comparison-list-view.component';
import { DialogComponent } from './snippets/dialog/dialog.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { CreateProjectComponent } from './manage-projects/create-project/create-project.component';

import { ModalService } from './services/modal/modal.service';
import { DomService } from './services/dom/dom.service';
import { MatrixLoaderComponent } from './matrix-loader/matrix-loader.component';

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
    ComparisonRowViewComponent,
    ComparisonMetaViewComponent,
    ComparisonListViewComponent,
    DialogComponent,
    ManageProjectsComponent,
    CreateProjectComponent,
    MatrixLoaderComponent,
  ],
  entryComponents: [
    CreateProjectComponent,
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
  providers: [
    DomService,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
