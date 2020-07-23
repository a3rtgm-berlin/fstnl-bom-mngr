import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { XlsLoaderComponent } from './xls-loader/xls-loader.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CompareOrdersComponent } from './compare-orders/compare-orders.component';
import { MasterViewComponent } from './master-view/master-view.component';
// import { QueryFormComponent } from './query-form/query-form.component';
import { MaterialListViewComponent } from './master-view/material-list-view/material-list-view.component';
import { MaterialListsCollectionViewComponent } from './project-list/material-lists-collection-view/material-lists-collection-view.component';
import { ComparisonRowViewComponent } from './compare-orders/comparison-row-view/comparison-row-view.component';
import { ComparisonMetaViewComponent } from './compare-orders/comparison-meta-view/comparison-meta-view.component';
import { ComparisonListViewComponent } from './compare-orders/comparison-list-view/comparison-list-view.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { CreateProjectComponent } from './manage-projects/create-project/create-project.component';
import { MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ModalService } from './services/modal/modal.service';
import { DomService } from './services/dom/dom.service';
import { MatrixFilesComponent } from './matrix-files/matrix-files.component';
import { MenuComponent } from './menu/menu.component';
import { ProjectListViewComponent } from './manage-projects/project-list-view/project-list-view.component';
import { ProjectSubSettingsComponent } from './manage-projects/project-sub-settings/project-sub-settings.component';
import { DeleteProjectComponent } from './manage-projects/delete-project/delete-project.component';
import { LoginComponent } from './login/login.component';
import { MasterlistviewComponent } from './masterlistview/masterlistview.component';
import { CreateuserComponent } from './settings/createuser/createuser.component';
import { SettingsComponent } from './settings/settings.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ProjectRemainNeedComponent } from './project-remain-need/project-remain-need.component';
import { RoundDecimalsPipe } from './pipes/round-decimals.pipe';
import { UpdateProjectComponent } from './manage-projects/update-project/update-project.component';
import { BomMetaViewComponent } from './bom-meta-view/bom-meta-view.component';
import { ErrorInterceptor } from './services/interceptors/error.interceptor';
import { ConsumptionUploadComponent } from './project-remain-need/consumption-upload/consumption-upload.component';
import { LocaleNumberPipe } from './pipes/locale-number.pipe';
import { MasterOverviewComponent } from './master-overview/master-overview.component';
import { BasicAuthInterceptor } from './services/interceptors/basic-auth.interceptor';
import { UserListComponent } from './settings/user-list/user-list.component';
import { PlanogramComponent } from './planogram/planogram.component';
import { PlanogramUploadComponent } from './planogram/planogram-upload/planogram-upload.component';
import { DeleteUserComponent } from './settings/delete-user/delete-user.component';
import { RolePipe } from './pipes/role.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularStickyThingsModule} from '@w11k/angular-sticky-things';
import { PercentPipe } from './pipes/percent.pipe';

@NgModule({
  declarations: [
    AppComponent,
    XlsLoaderComponent,
    ProjectListComponent,
    MaterialListViewComponent,
    CompareOrdersComponent,
    MasterViewComponent,
    MaterialListsCollectionViewComponent,
    ComparisonRowViewComponent,
    ComparisonMetaViewComponent,
    ComparisonListViewComponent,
    ManageProjectsComponent,
    CreateProjectComponent,
    MatrixFilesComponent,
    MenuComponent,
    ProjectListViewComponent,
    ProjectSubSettingsComponent,
    DeleteProjectComponent,
    LoginComponent,
    MasterlistviewComponent,
    CreateuserComponent,
    SettingsComponent,
    ProjectRemainNeedComponent,
    RoundDecimalsPipe,
    UpdateProjectComponent,
    BomMetaViewComponent,
    ConsumptionUploadComponent,
    LocaleNumberPipe,
    MasterOverviewComponent,
    UserListComponent,
    PlanogramComponent,
    PlanogramUploadComponent,
    DeleteUserComponent,
    RolePipe,
    PercentPipe,
  ],
  entryComponents: [
    CreateProjectComponent,
    ProjectSubSettingsComponent,
    DeleteProjectComponent,
    DeleteUserComponent,
    UpdateProjectComponent,
    BomMetaViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularStickyThingsModule
  ],
  exports: [
    XlsLoaderComponent
  ],
  providers: [
    DomService,
    ModalService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
