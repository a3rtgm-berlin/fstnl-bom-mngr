import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XlsLoaderComponent } from './xls-loader/xls-loader.component';
import { ProjectListComponent } from './project-list/project-list.component';


const routes: Routes = [
  { path: '',  redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectListComponent },
  { path: 'upload', component: XlsLoaderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
