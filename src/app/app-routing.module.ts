import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XlsLoaderComponent } from './xls-loader/xls-loader.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CompareOrdersComponent } from './compare-orders/compare-orders.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  { path: '',  redirectTo: '/app/lists', pathMatch: 'full' },
  { path: 'app/lists', component: ProjectListComponent },
  { path: 'app/lists/:id', component: ProjectComponent },
  { path: 'app/lists/compare/:id1&:id2', component: CompareOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
